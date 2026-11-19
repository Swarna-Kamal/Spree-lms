package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.MaterialResponse;
import com.spree.entity.Material;
import com.spree.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
@Tag(name = "Course Materials", description = "Endpoints for uploading, viewing, and downloading course documents")
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Upload course material (PDF, DOC, DOCX up to 1MB)")
    public ResponseEntity<ApiResponse<MaterialResponse>> uploadMaterial(
            @RequestParam("courseId") Long courseId,
            @RequestParam(value = "lessonId", required = false) Long lessonId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        MaterialResponse response = materialService.uploadMaterial(courseId, lessonId, title, description, file, authentication);
        return ResponseEntity.ok(ApiResponse.success("Material uploaded successfully", response));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get all course materials for enrolled student")
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getMaterialsForStudent(Authentication authentication) {
        List<MaterialResponse> list = materialService.getMaterialsForEnrolledStudent(authentication);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get all course materials uploaded by/assigned to teacher")
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getMaterialsForTeacher(Authentication authentication) {
        List<MaterialResponse> list = materialService.getMaterialsForTeacher(authentication);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get materials for a course")
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getMaterialsForCourse(
            @PathVariable Long courseId,
            Authentication authentication
    ) {
        List<MaterialResponse> list = materialService.getMaterialsForCourse(courseId, authentication);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/lesson/{lessonId}")
    @Operation(summary = "Get materials for a lesson")
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getMaterialsForLesson(
            @PathVariable Long lessonId,
            Authentication authentication
    ) {
        List<MaterialResponse> list = materialService.getMaterialsForLesson(lessonId, authentication);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Securely download material file")
    public ResponseEntity<Resource> downloadMaterial(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Material material = materialService.getMaterial(id, authentication);
        Resource resource = materialService.getMaterialFile(id, authentication);

        String originalFilename = material.getFileName() != null ? material.getFileName() : "document";
        String encodedFilename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        String contentType = material.getFileType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Delete uploaded material")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @PathVariable Long id,
            Authentication authentication
    ) {
        materialService.deleteMaterial(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Material deleted successfully", null));
    }
}
