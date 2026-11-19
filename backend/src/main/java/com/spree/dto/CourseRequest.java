
package com.spree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank(message = "Course title is required")
    @Size(max = 255, message = "Course title cannot exceed 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Long teacherId;

    private String thumbnailUrl;
}
