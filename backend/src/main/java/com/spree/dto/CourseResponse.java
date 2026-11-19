
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
public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;
    private Long teacherId;
    private String teacherName;
    private String thumbnailUrl;
    private boolean isPublished;
    private Instant createdAt;
    private Instant updatedAt;
}
