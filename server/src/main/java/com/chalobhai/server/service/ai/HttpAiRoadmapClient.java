package com.chalobhai.server.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class HttpAiRoadmapClient implements AiRoadmapClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(HttpAiRoadmapClient.class);

    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${app.ai.provider:gemini}")
    private String provider;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${app.ai.openai.model:gpt-4o-mini}")
    private String openAiModel;

    public HttpAiRoadmapClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public AiRoadmapResult generateRoadmap(RoadmapGenerationInput input) {
        // System.out.println(apiKey);
        if (apiKey == null || apiKey.isBlank()) {
            LOGGER.warn("AI API key is not configured. Falling back to generated template roadmap.");
            return buildFallbackResult(input, "missing-api-key");
        }

        String normalizedProvider = provider == null ? "gemini" : provider.trim().toLowerCase(Locale.ENGLISH);
        try {
            return switch (normalizedProvider) {
                case "openai" -> callOpenAi(input);
                case "gemini" -> callGemini(input);
                default -> {
                    LOGGER.warn("Unsupported AI provider '{}'. Falling back to generated template roadmap.", provider);
                    yield buildFallbackResult(input, "unsupported-provider");
                }
            };
        } catch (Exception exception) {
            LOGGER.warn("AI request failed. Falling back to generated template roadmap.", exception);
            return buildFallbackResult(input, "provider-call-failed");
        }
    }

    private AiRoadmapResult callGemini(RoadmapGenerationInput input) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + geminiModel
                + ":generateContent?key="
                + apiKey;
        // System.out.println("1");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contents", List.of(Map.of("parts", List.of(Map.of("text", buildPrompt(input))))));
        body.put("generationConfig", Map.of(
                "temperature", 0.25,
                "responseMimeType", "application/json"
        ));

        JsonNode response = restClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        // System.out.println(response);

        String modelOutput = response == null
                ? ""
                : response.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");

        RoadmapDraft draft = parseDraftOrFallback(modelOutput, input);
        return new AiRoadmapResult("gemini", geminiModel, modelOutput, draft);
    }

    private AiRoadmapResult callOpenAi(RoadmapGenerationInput input) {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", openAiModel);
        body.put("temperature", 0.25);// it tells the AI to give a creative response    
        body.put("response_format", Map.of("type", "json_object"));
        body.put("messages", List.of(
                Map.of(
                        "role", "system",
                        "content", "You are a senior career mentor AI. Respond with valid JSON only."
                ),
                Map.of(
                        "role", "user",
                        "content", buildPrompt(input)
                )
        ));

        JsonNode response = restClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        String modelOutput = response == null
                ? ""
                : response.path("choices").path(0).path("message").path("content").asText("");

        RoadmapDraft draft = parseDraftOrFallback(modelOutput, input);
        return new AiRoadmapResult("openai", openAiModel, modelOutput, draft);
    }

    private String buildPrompt(RoadmapGenerationInput input) {
        String skills = String.join(", ", input.currentSkills());
        return """
                Generate a personalized learning roadmap for a student and return ONLY JSON with this schema:
                {
                  "summary": "string",
                  "estimatedWeeks": number,
                  "milestones": [
                    {
                      "weekStart": number,
                      "weekEnd": number,
                      "title": "string",
                      "goal": "string",
                      "deliverable": "string"
                    }
                  ]
                }

                Student context:
                - Target career: %s
                - Experience level: %s
                - Available hours per week: %d
                - Current skills: %s

                Rules:
                - estimatedWeeks should be between 6 and 24
                - Provide 4 to 6 milestones
                - week ranges must be continuous and increasing
                - Keep summary concise (max 60 words)
                - deliverable must be practical and portfolio-oriented
                """.formatted(
                input.careerGoal(),
                input.experienceLevel(),
                input.hoursPerWeek(),
                skills
        );
    }

    private RoadmapDraft parseDraftOrFallback(String modelOutput, RoadmapGenerationInput input) {
        if (modelOutput == null || modelOutput.isBlank()) {
            return buildFallbackDraft(input);
        }

        String cleaned = stripMarkdownCodeFence(modelOutput);
        try {
            JsonNode root = objectMapper.readTree(cleaned);
            String summary = normalize(root.path("summary").asText(""), defaultSummary(input.careerGoal()));
            int estimatedWeeks = clamp(root.path("estimatedWeeks").asInt(resolveEstimatedWeeks(input.hoursPerWeek())), 6, 24);

            List<RoadmapMilestoneDraft> milestones = new ArrayList<>();
            JsonNode milestonesNode = root.path("milestones");
            if (milestonesNode.isArray()) {
                for (JsonNode milestoneNode : milestonesNode) {
                    int weekStart = Math.max(1, milestoneNode.path("weekStart").asInt());
                    int weekEnd = milestoneNode.path("weekEnd").asInt();
                    if (weekEnd < weekStart) {
                        weekEnd = weekStart;
                    }

                    String title = normalize(milestoneNode.path("title").asText(""), "Milestone");
                    String goal = normalize(milestoneNode.path("goal").asText(""), "Build practical career skills");
                    String deliverable = normalize(
                            milestoneNode.path("deliverable").asText(""),
                            "Complete and document one portfolio-ready mini project"
                    );

                    milestones.add(new RoadmapMilestoneDraft(weekStart, weekEnd, title, goal, deliverable));
                }
            }

            if (milestones.isEmpty()) {
                return buildFallbackDraft(input);
            }

            return new RoadmapDraft(summary, estimatedWeeks, milestones);
        } catch (Exception exception) {
            LOGGER.debug("Could not parse AI JSON roadmap response. Using fallback roadmap.", exception);
            return buildFallbackDraft(input);
        }
    }

    private AiRoadmapResult buildFallbackResult(RoadmapGenerationInput input, String reason) {
        RoadmapDraft fallback = buildFallbackDraft(input);
        String rawResponse = "fallback-roadmap:" + reason;
        return new AiRoadmapResult("template", "phase4-template", rawResponse, fallback);
    }

    private RoadmapDraft buildFallbackDraft(RoadmapGenerationInput input) {
        int estimatedWeeks = resolveEstimatedWeeks(input.hoursPerWeek());
        int block = Math.max(2, estimatedWeeks / 4);

        List<RoadmapMilestoneDraft> milestones = List.of(
                new RoadmapMilestoneDraft(
                        1,
                        block,
                        "Foundation and core concepts",
                        "Strengthen computer science basics and close conceptual gaps for " + input.careerGoal(),
                        "Publish structured notes and complete 2 focused exercises per week"
                ),
                new RoadmapMilestoneDraft(
                        block + 1,
                        block * 2,
                        "Hands-on implementation",
                        "Apply the target stack with guided coding practice",
                        "Build one small feature-complete application module"
                ),
                new RoadmapMilestoneDraft(
                        (block * 2) + 1,
                        block * 3,
                        "Portfolio project development",
                        "Implement a practical project aligned with hiring expectations",
                        "Ship one end-to-end project with README and architecture notes"
                ),
                new RoadmapMilestoneDraft(
                        (block * 3) + 1,
                        estimatedWeeks,
                        "Interview and readiness sprint",
                        "Revise weak areas and prepare for role-specific interviews",
                        "Create final showcase, resume bullets, and weekly revision checklist"
                )
        );

        return new RoadmapDraft(defaultSummary(input.careerGoal()), estimatedWeeks, milestones);
    }

    private int resolveEstimatedWeeks(Integer hoursPerWeek) {
        if (hoursPerWeek == null) {
            return 12;
        }
        if (hoursPerWeek >= 18) {
            return 8;
        }
        if (hoursPerWeek >= 10) {
            return 12;
        }
        return 16;
    }

    private String defaultSummary(String careerGoal) {
        return "A practical week-by-week roadmap focused on building confidence and portfolio depth for " + careerGoal + ".";
    }

    private String stripMarkdownCodeFence(String text) {
        String cleaned = text.trim();
        if (cleaned.startsWith("```") && cleaned.endsWith("```")) {
            cleaned = cleaned.substring(3, cleaned.length() - 3).trim();
            if (cleaned.startsWith("json")) {
                cleaned = cleaned.substring(4).trim();
            }
        }
        return cleaned;
    }

    private String normalize(String value, String fallback) {
        String normalized = value == null ? "" : value.trim();
        return normalized.isBlank() ? fallback : normalized;
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }
}
