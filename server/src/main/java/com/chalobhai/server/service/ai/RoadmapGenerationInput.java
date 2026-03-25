package com.chalobhai.server.service.ai;

import java.util.List;

public record RoadmapGenerationInput(
        String careerGoal,
        Integer hoursPerWeek,
        String experienceLevel,
        List<String> currentSkills
) {
}
