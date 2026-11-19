package com.spree.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmissionRequest {
    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;

    private String content;

    private String fileUrl;
}
