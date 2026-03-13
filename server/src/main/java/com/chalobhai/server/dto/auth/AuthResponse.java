package com.chalobhai.server.dto.auth;

public record AuthResponse(
        String token,
        UserSummary user
) {
}
