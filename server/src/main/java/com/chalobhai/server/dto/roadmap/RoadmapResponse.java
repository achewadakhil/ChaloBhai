package com.chalobhai.server.dto.roadmap;

import java.time.LocalDateTime;
import java.util.List;

public record RoadmapResponse(
        Long id,
        Long profileId,
        String provider,
        String model,
        String summary,
        Integer estimatedWeeks,
        List<RoadmapMilestoneResponse> milestones,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
