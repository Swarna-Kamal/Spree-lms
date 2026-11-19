package com.spree.repository;

import com.spree.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByDepartmentId(Long departmentId);
    List<Course> findByIsPublishedTrue();
    long countByIsPublishedTrue();
    List<Course> findTop5ByOrderByCreatedAtDesc();
}
