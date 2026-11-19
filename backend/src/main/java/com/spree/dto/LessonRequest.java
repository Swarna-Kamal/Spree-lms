package com.spree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LessonRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Long moduleId;

    @NotBlank(message = "Lesson title is required")
    private String title;

    private String content;

    private int lessonOrder;
}
