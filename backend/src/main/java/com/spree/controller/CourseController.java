
package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.CourseRequest;
import com.spree.dto.CourseResponse;
import com.spree.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getCourses(
            Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.success(courseService.getCourses(authentication)));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublicCourses() {
        return ResponseEntity.ok(
                ApiResponse.success(courseService.getPublicCourses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(
            @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.success(courseService.getCourse(id, authentication)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Course created successfully",
                        courseService.createCourse(request, authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Course updated successfully",
                        courseService.updateCourse(id, request, authentication)));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            @PathVariable Long id,
            @RequestParam boolean published,
            Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Course publication status updated",
                        courseService.publishCourse(id, published, authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id, Authentication authentication) {
        courseService.deleteCourse(id, authentication);
        return ResponseEntity.ok(
                ApiResponse.success("Course deleted successfully", null));
    }
}
