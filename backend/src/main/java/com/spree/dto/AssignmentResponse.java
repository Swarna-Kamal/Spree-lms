package com.spree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String description;
    private Instant dueDate;
    private BigDecimal maxScore;
    private Instant createdAt;
    private Instant updatedAt;
}
