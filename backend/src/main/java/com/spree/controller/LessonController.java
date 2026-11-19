package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.LessonRequest;
import com.spree.dto.LessonResponse;
import com.spree.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByCourse(courseId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLesson(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLesson(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lesson created successfully", lessonService.createLesson(request, authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", lessonService.updateLesson(id, request, authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long id, Authentication authentication) {
        lessonService.deleteLesson(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<LessonResponse>> publishLesson(
            @PathVariable Long id,
            @RequestParam boolean published,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lesson publication status updated", lessonService.publishLesson(id, published, authentication)));
    }
}
