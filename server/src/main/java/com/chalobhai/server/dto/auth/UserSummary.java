package com.chalobhai.server.dto.auth;

import com.chalobhai.server.entity.User;

public record UserSummary(
        Long id,
        String name,
        String email
) {
    public static UserSummary from(User user) {
        return new UserSummary(user.getId(), user.getName(), user.getEmail());
    }
}
