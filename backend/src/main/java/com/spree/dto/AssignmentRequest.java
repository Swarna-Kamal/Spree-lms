package com.spree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class AssignmentRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Assignment title is required")
    private String title;

    private String description;

    private Instant dueDate;

    private BigDecimal maxScore;
}
