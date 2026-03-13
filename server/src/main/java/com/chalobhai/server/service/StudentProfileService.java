package com.chalobhai.server.service;

import com.chalobhai.server.dto.profile.StudentProfileRequest;
import com.chalobhai.server.dto.profile.StudentProfileResponse;
import com.chalobhai.server.entity.StudentProfile;
import com.chalobhai.server.entity.User;
import com.chalobhai.server.repository.StudentProfileRepository;
import com.chalobhai.server.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public StudentProfileService(
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper
    ) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public StudentProfileResponse upsertProfile(String email, StudentProfileRequest request) {
        User user = findUserByEmail(email);
        List<String> sanitizedSkills = sanitizeSkills(request.currentSkills());

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(StudentProfile::new);

        profile.setUser(user);
        profile.setCurrentSkillsJson(toJson(sanitizedSkills));
        profile.setCareerGoal(normalizeText(request.careerGoal(), "Career goal"));
        profile.setHoursPerWeek(request.hoursPerWeek());
        profile.setExperienceLevel(normalizeText(request.experienceLevel(), "Experience level"));

        StudentProfile saved = studentProfileRepository.save(profile);
        return toResponse(saved);
    }

    public StudentProfileResponse getCurrentUserProfile(String email) {
        User user = findUserByEmail(email);
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found."));

        return toResponse(profile);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired session."));
    }

    private List<String> sanitizeSkills(List<String> skills) {
        LinkedHashSet<String> deduplicated = new LinkedHashSet<>();

        for (String skill : skills) {
            if (skill == null) {
                continue;
            }
            String normalized = skill.trim();
            if (!normalized.isEmpty()) {
                deduplicated.add(normalized);
            }
        }

        if (deduplicated.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one valid skill is required.");
        }

        return new ArrayList<>(deduplicated);
    }

    private String normalizeText(String value, String field) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " cannot be empty.");
        }
        return normalized;
    }

    private String toJson(List<String> skills) {
        try {
            return objectMapper.writeValueAsString(skills);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to persist skills.");
        }
    }

    private List<String> fromJson(String skillsJson) {
        try {
            return objectMapper.readValue(skillsJson, new TypeReference<>() {
            });
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to read stored profile skills.");
        }
    }

    private StudentProfileResponse toResponse(StudentProfile profile) {
        return new StudentProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                fromJson(profile.getCurrentSkillsJson()),
                profile.getCareerGoal(),
                profile.getHoursPerWeek(),
                profile.getExperienceLevel(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
