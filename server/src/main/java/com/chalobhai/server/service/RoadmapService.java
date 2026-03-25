package com.chalobhai.server.service;

import com.chalobhai.server.dto.roadmap.RoadmapMilestoneResponse;
import com.chalobhai.server.dto.roadmap.RoadmapResponse;
import com.chalobhai.server.entity.Roadmap;
import com.chalobhai.server.entity.StudentProfile;
import com.chalobhai.server.entity.User;
import com.chalobhai.server.repository.RoadmapRepository;
import com.chalobhai.server.repository.StudentProfileRepository;
import com.chalobhai.server.repository.UserRepository;
import com.chalobhai.server.service.ai.AiRoadmapClient;
import com.chalobhai.server.service.ai.AiRoadmapResult;
import com.chalobhai.server.service.ai.RoadmapDraft;
import com.chalobhai.server.service.ai.RoadmapGenerationInput;
import com.chalobhai.server.service.ai.RoadmapMilestoneDraft;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoadmapService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RoadmapRepository roadmapRepository;
    private final AiRoadmapClient aiRoadmapClient;
    private final ObjectMapper objectMapper;

    public RoadmapService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            RoadmapRepository roadmapRepository,
            AiRoadmapClient aiRoadmapClient,
            ObjectMapper objectMapper
    ) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.roadmapRepository = roadmapRepository;
        this.aiRoadmapClient = aiRoadmapClient;
        this.objectMapper = objectMapper;
    }

    public RoadmapResponse generateCurrentUserRoadmap(String email) {
        User user = findUserByEmail(email);
        StudentProfile profile = findProfileByUserId(user.getId());

        List<String> skills = readSkills(profile.getCurrentSkillsJson());
        RoadmapGenerationInput input = new RoadmapGenerationInput(
                profile.getCareerGoal(),
                profile.getHoursPerWeek(),
                profile.getExperienceLevel(),
                skills
        );

        AiRoadmapResult generated = aiRoadmapClient.generateRoadmap(input);
        RoadmapDraft draft = sanitizeDraft(generated.roadmap(), profile.getCareerGoal());
        // System.out.println(draft);

        Roadmap roadmap = roadmapRepository.findByUserId(user.getId()).orElseGet(Roadmap::new);
        roadmap.setUser(user);
        roadmap.setProfile(profile);
        roadmap.setProvider(normalize(generated.provider(), "template"));
        roadmap.setModelName(normalize(generated.model(), "phase4-template"));
        roadmap.setSummaryText(normalize(draft.summary(), "A roadmap has been generated."));
        roadmap.setEstimatedWeeks(clampWeeks(draft.estimatedWeeks()));
        roadmap.setMilestonesJson(writeMilestones(draft.milestones()));
        roadmap.setRawAiResponse(normalize(generated.rawResponse(), "no-raw-response"));

        Roadmap saved = roadmapRepository.save(roadmap);
        return toResponse(saved);
    }

    public RoadmapResponse getCurrentUserRoadmap(String email) {
        User user = findUserByEmail(email);
        Roadmap roadmap = roadmapRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roadmap not generated yet."));

        return toResponse(roadmap);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired session."));
    }

    private StudentProfile findProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Please complete your profile before generating the roadmap."
                ));
    }

    private List<String> readSkills(String skillsJson) {
        try {
            return objectMapper.readValue(skillsJson, new TypeReference<>() {
            });
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to read profile skills.");
        }
    }

    private String writeMilestones(List<RoadmapMilestoneDraft> milestones) {
        try {
            return objectMapper.writeValueAsString(milestones);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to persist roadmap milestones.");
        }
    }

    private List<RoadmapMilestoneResponse> readMilestones(String milestonesJson) {
        try {
            List<RoadmapMilestoneDraft> drafts = objectMapper.readValue(milestonesJson, new TypeReference<>() {
            });
            List<RoadmapMilestoneResponse> milestones = new ArrayList<>();
            for (RoadmapMilestoneDraft draft : drafts) {
                milestones.add(new RoadmapMilestoneResponse(
                        draft.weekStart(),
                        draft.weekEnd(),
                        draft.title(),
                        draft.goal(),
                        draft.deliverable()
                ));
            }
            return milestones;
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to read stored roadmap milestones.");
        }
    }

    private RoadmapDraft sanitizeDraft(RoadmapDraft draft, String careerGoal) {
        if (draft == null || draft.milestones() == null || draft.milestones().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Roadmap generation failed. Please try again.");
        }

        List<RoadmapMilestoneDraft> sanitized = new ArrayList<>();
        int previousWeekEnd = 0;

        for (RoadmapMilestoneDraft milestone : draft.milestones()) {
            int weekStart = milestone.weekStart() == null ? previousWeekEnd + 1 : Math.max(previousWeekEnd + 1, milestone.weekStart());
            int weekEnd = milestone.weekEnd() == null ? weekStart : Math.max(weekStart, milestone.weekEnd());

            String title = normalize(milestone.title(), "Learning milestone");
            String goal = normalize(milestone.goal(), "Progress toward " + careerGoal);
            String deliverable = normalize(milestone.deliverable(), "Complete one practical outcome for this milestone");

            sanitized.add(new RoadmapMilestoneDraft(weekStart, weekEnd, title, goal, deliverable));
            previousWeekEnd = weekEnd;
        }

        String summary = normalize(draft.summary(), "A personalized roadmap focused on " + careerGoal + ".");
        return new RoadmapDraft(summary, clampWeeks(draft.estimatedWeeks()), sanitized);
    }

    private int clampWeeks(Integer value) {
        int weeks = value == null ? 12 : value;
        return Math.max(6, Math.min(24, weeks));
    }

    private String normalize(String value, String fallback) {
        String normalized = value == null ? "" : value.trim();
        return normalized.isBlank() ? fallback : normalized;
    }

    private RoadmapResponse toResponse(Roadmap roadmap) {
        return new RoadmapResponse(
                roadmap.getId(),
                roadmap.getProfile().getId(),
                roadmap.getProvider(),
                roadmap.getModelName(),
                roadmap.getSummaryText(),
                roadmap.getEstimatedWeeks(),
                readMilestones(roadmap.getMilestonesJson()),
                roadmap.getCreatedAt(),
                roadmap.getUpdatedAt()
        );
    }
}
