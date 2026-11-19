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
public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private String content;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String downloadUrl;
    private Instant submittedAt;
    private String status;
    private GradeInfo grade;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeInfo {
        private BigDecimal score;
        private String feedback;
        private Instant gradedAt;
        private String gradedByName;
    }
}
