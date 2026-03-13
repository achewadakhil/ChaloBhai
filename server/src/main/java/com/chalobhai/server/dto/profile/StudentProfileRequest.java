package com.chalobhai.server.dto.profile;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StudentProfileRequest(
        @NotEmpty(message = "At least one current skill is required")
        @Size(max = 20, message = "A maximum of 20 skills is allowed")
        List<
            @NotBlank(message = "Skill entries must not be empty") @Size(max = 80, message = "Each skill must be 80 characters or fewer") 
        String> currentSkills,

        @NotBlank(message = "Career goal is required")
        @Size(max = 120, message = "Career goal must be 120 characters or fewer")
        String careerGoal,

        @NotNull(message = "Hours per week is required")
        @Min(value = 1, message = "Hours per week must be at least 1")
        @Max(value = 80, message = "Hours per week must be at most 80")
        Integer hoursPerWeek,

        @NotBlank(message = "Experience level is required")
        @Size(max = 40, message = "Experience level must be 40 characters or fewer")
        String experienceLevel
) {
}
