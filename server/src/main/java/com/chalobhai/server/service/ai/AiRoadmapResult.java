package com.chalobhai.server.service.ai;

public record AiRoadmapResult(
        String provider,
        String model,
        String rawResponse,
        RoadmapDraft roadmap
) {
}
