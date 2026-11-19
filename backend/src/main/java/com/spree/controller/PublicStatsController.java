package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.repository.CourseRepository;
import com.spree.repository.DepartmentRepository;
import com.spree.repository.EnrollmentRepository;
import com.spree.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class PublicStatsController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Data
    @Builder
    public static class PublicStatsResponse {
        private long totalStudents;
        private long totalTeachers;
        private long totalCourses;
        private long totalDepartments;
        private long totalEnrollments;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<PublicStatsResponse>> getPublicStats() {
        long students = userRepository.countByRoleName("STUDENT");
        long teachers = userRepository.countByRoleName("TEACHER");
        long courses = courseRepository.findByIsPublishedTrue().size();
        long departments = departmentRepository.count();
        long enrollments = enrollmentRepository.count();

        PublicStatsResponse response = PublicStatsResponse.builder()
                .totalStudents(students)
                .totalTeachers(teachers)
                .totalCourses(courses)
                .totalDepartments(departments)
                .totalEnrollments(enrollments)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
