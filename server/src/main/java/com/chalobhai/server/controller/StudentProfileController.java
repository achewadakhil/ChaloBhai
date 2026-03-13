package com.chalobhai.server.controller;

import com.chalobhai.server.dto.profile.StudentProfileRequest;
import com.chalobhai.server.dto.profile.StudentProfileResponse;
import com.chalobhai.server.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @PostMapping("/me")
    public ResponseEntity<StudentProfileResponse> upsertProfile(
            Authentication authentication,
            @Valid @RequestBody StudentProfileRequest request
    ) {
        String email = extractAuthenticatedEmail(authentication);
        return ResponseEntity.ok(studentProfileService.upsertProfile(email, request));
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileResponse> getCurrentProfile(Authentication authentication) {
        String email = extractAuthenticatedEmail(authentication);
        return ResponseEntity.ok(studentProfileService.getCurrentUserProfile(email));
    }

    private String extractAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required.");
        }
        return authentication.getName();
    }
}
