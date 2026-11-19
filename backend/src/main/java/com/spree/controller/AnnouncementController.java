package com.spree.controller;

import com.spree.dto.AnnouncementRequest;
import com.spree.dto.AnnouncementResponse;
import com.spree.dto.ApiResponse;
import com.spree.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getAllAnnouncements(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getAnnouncementsForUser(authentication)));
    }

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getGlobalAnnouncements() {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getGlobalAnnouncements()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getCourseAnnouncements(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getCourseAnnouncements(courseId)));
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getStudentAnnouncements(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getAnnouncementsForStudent(authentication)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AnnouncementResponse>> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement created successfully", announcementService.createAnnouncement(request, authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Announcement updated successfully", announcementService.updateAnnouncement(id, request, authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id, Authentication authentication) {
        announcementService.deleteAnnouncement(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully", null));
    }
}
