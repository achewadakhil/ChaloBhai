package com.chalobhai.server.dto.profile;

import java.time.LocalDateTime;
import java.util.List;

public record StudentProfileResponse(
        Long id,
        Long userId,
        String userName,
        String userEmail,
        List<String> currentSkills,
        String careerGoal,
        Integer hoursPerWeek,
        String experienceLevel,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
