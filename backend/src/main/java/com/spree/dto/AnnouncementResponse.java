package com.spree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private Long authorId;
    private String authorName;
    private String title;
    private String content;
    private boolean isGlobal;
    private Instant createdAt;
    private Instant updatedAt;
}
