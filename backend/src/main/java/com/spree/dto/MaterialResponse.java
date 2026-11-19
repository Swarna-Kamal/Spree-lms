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
public class MaterialResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private Long lessonId;
    private String lessonTitle;
    private String title;
    private String description;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String downloadUrl;
    private String uploadedByName;
    private Instant createdAt;
}
