package com.spree.controller;

import com.spree.dto.AdminStatsResponse;
import com.spree.dto.ApiResponse;
import com.spree.dto.CourseResponse;
import com.spree.entity.SubmissionStatus;
import com.spree.repository.*;
import com.spree.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AnnouncementRepository announcementRepository;
    private final SubmissionRepository submissionRepository;
    private final CourseService courseService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        List<CourseResponse> recentCourses = courseRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(courseService::mapToResponse)
                .toList();

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalStudents(userRepository.countByRoleName("STUDENT"))
                .totalTeachers(userRepository.countByRoleName("TEACHER"))
                .totalCourses(courseRepository.count())
                .activeCourses(courseRepository.countByIsPublishedTrue())
                .totalDepartments(departmentRepository.count())
                .totalEnrollments(enrollmentRepository.count())
                .pendingSubmissions(submissionRepository.countByStatus(SubmissionStatus.SUBMITTED))
                .recentCourses(recentCourses)
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
