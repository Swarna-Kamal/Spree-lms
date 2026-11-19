package com.spree.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GradeRequest {
    @NotNull(message = "Score is required")
    private BigDecimal score;

    private String feedback;
}
