package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.AssignmentRequest;
import com.spree.dto.AssignmentResponse;
import com.spree.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByCourse(courseId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignment(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", assignmentService.createAssignment(request, authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", assignmentService.updateAssignment(id, request, authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id, Authentication authentication) {
        assignmentService.deleteAssignment(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully", null));
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsForStudent(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsForStudent(authentication)));
    }
}
