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
public class LessonResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private Long moduleId;
    private String moduleTitle;
    private String title;
    private String content;
    private int lessonOrder;
    private boolean isPublished;
    private Instant createdAt;
    private Instant updatedAt;
}
