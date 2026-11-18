package com.spree.repository;

import com.spree.entity.ProgressTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressTrackingRepository extends JpaRepository<ProgressTracking, Long> {
    List<ProgressTracking> findByStudentId(Long studentId);
    Optional<ProgressTracking> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    long countByStudentIdAndLesson_CourseId(Long studentId, Long courseId);
}
