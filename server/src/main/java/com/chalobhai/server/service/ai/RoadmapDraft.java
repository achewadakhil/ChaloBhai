package com.chalobhai.server.service.ai;

import java.util.List;

public record RoadmapDraft(
        String summary,
        Integer estimatedWeeks,
        List<RoadmapMilestoneDraft> milestones
) {
}
