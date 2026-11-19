package com.spree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long activeCourses;
    private long totalDepartments;
    private long totalEnrollments;
    private long pendingSubmissions;
    private List<CourseResponse> recentCourses;
}
