
package com.spree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 255, message = "Department name cannot exceed 255 characters")
    private String name;

    private String description;
}
