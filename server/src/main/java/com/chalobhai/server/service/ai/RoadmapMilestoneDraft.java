package com.chalobhai.server.service.ai;

public record RoadmapMilestoneDraft(
        Integer weekStart,
        Integer weekEnd,
        String title,
        String goal,
        String deliverable
) {
}
