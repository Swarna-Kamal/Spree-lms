package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.GradeRequest;
import com.spree.dto.SubmissionRequest;
import com.spree.dto.SubmissionResponse;
import com.spree.entity.Submission;
import com.spree.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Endpoints for student submissions and grading")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Submit assignment with file attachment (PDF, DOC, DOCX up to 1MB)")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitWithFile(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.submitAssignmentWithFile(assignmentId, content, file, authentication);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Submit assignment (text / URL)")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitAssignment(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.submitAssignment(request, authentication);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", response));
    }

    @PostMapping("/draft")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Save assignment draft")
    public ResponseEntity<ApiResponse<SubmissionResponse>> saveDraft(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.saveDraft(request, authentication);
        return ResponseEntity.ok(ApiResponse.success("Draft saved", response));
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Get all submissions for an assignment (Teacher/Admin)")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getSubmissionsForAssignment(
            @PathVariable Long assignmentId,
            Authentication authentication
    ) {
        List<SubmissionResponse> responses = submissionService.getSubmissionsForAssignment(assignmentId, authentication);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/assignment/{assignmentId}/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Get current student's submission for an assignment")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getMySubmission(
            @PathVariable Long assignmentId,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.getStudentSubmissionForAssignment(assignmentId, authentication);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get submission by ID")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(
            @PathVariable Long id,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.getSubmission(id, authentication);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Securely download submitted document")
    public ResponseEntity<Resource> downloadSubmissionFile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Submission submission = submissionService.getSubmissionEntity(id);
        Resource resource = submissionService.getSubmissionFile(id, authentication);

        String originalFilename = submission.getFileName() != null ? submission.getFileName() : "submission";
        String encodedFilename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .body(resource);
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Grade a submission (Teacher/Admin)")
    public ResponseEntity<ApiResponse<SubmissionResponse>> gradeSubmission(
            @PathVariable Long id,
            @Valid @RequestBody GradeRequest gradeRequest,
            Authentication authentication
    ) {
        SubmissionResponse response = submissionService.gradeSubmission(id, gradeRequest, authentication);
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", response));
    }
}
