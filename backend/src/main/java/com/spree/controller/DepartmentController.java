package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.DepartmentRequest;
import com.spree.dto.DepartmentResponse;
import com.spree.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<DepartmentResponse>> getAllDepartments() {
        return ApiResponse.success(departmentService.getAllDepartments());
    }

    @GetMapping("/public")
    public ApiResponse<List<DepartmentResponse>> getPublicDepartments() {
        return ApiResponse.success(departmentService.getAllDepartments());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {
        return ApiResponse.success(
                "Department created successfully",
                departmentService.createDepartment(request)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        return ApiResponse.success(
                "Department updated successfully",
                departmentService.updateDepartment(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ApiResponse.success("Department deleted successfully", null);
    }
}