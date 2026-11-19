package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.EnrollmentResponse;
import com.spree.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @PathVariable Long courseId,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enrolled successfully", enrollmentService.enrollStudent(courseId, authentication)));
    }

    @DeleteMapping("/courses/{courseId}/unenroll")
    public ResponseEntity<ApiResponse<Void>> unenroll(
            @PathVariable Long courseId,
            Authentication authentication) {
        enrollmentService.unenrollStudent(courseId, authentication);
        return ResponseEntity.ok(ApiResponse.success("Unenrolled successfully", null));
    }

    @PostMapping("/courses/{courseId}/students/{studentId}")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> manualEnroll(
            @PathVariable Long courseId,
            @PathVariable Long studentId,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student enrolled successfully", enrollmentService.manualEnrollStudent(courseId, studentId, authentication)));
    }

    @DeleteMapping("/courses/{courseId}/students/{studentId}")
    public ResponseEntity<ApiResponse<Void>> manualUnenroll(
            @PathVariable Long courseId,
            @PathVariable Long studentId,
            Authentication authentication) {
        enrollmentService.manualUnenrollStudent(courseId, studentId, authentication);
        return ResponseEntity.ok(ApiResponse.success("Student unenrolled successfully", null));
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsByCourse(courseId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getMyEnrollments(authentication)));
    }
}
