package com.chalobhai.server.controller;

import com.chalobhai.server.dto.roadmap.RoadmapResponse;
import com.chalobhai.server.service.RoadmapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/me/generate")
    public ResponseEntity<RoadmapResponse> generateCurrentUserRoadmap(Authentication authentication) {
        String email = extractAuthenticatedEmail(authentication);
        return ResponseEntity.ok(roadmapService.generateCurrentUserRoadmap(email));
    }

    @GetMapping("/me")
    public ResponseEntity<RoadmapResponse> getCurrentUserRoadmap(Authentication authentication) {
        String email = extractAuthenticatedEmail(authentication);
        return ResponseEntity.ok(roadmapService.getCurrentUserRoadmap(email));
    }

    private String extractAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required.");
        }
        return authentication.getName();
    }
}
