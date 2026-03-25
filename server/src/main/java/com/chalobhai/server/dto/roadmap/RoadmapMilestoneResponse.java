package com.chalobhai.server.dto.roadmap;

public record RoadmapMilestoneResponse(
        Integer weekStart,
        Integer weekEnd,
        String title,
        String goal,
        String deliverable
) {
}
