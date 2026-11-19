package com.spree.repository;

import com.spree.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseId(Long courseId);
    List<Material> findByLessonId(Long lessonId);
    List<Material> findByCourseIdAndLessonIsNull(Long courseId);

    @Query("SELECT m FROM Material m WHERE m.course.id IN " +
           "(SELECT e.course.id FROM Enrollment e WHERE e.student.id = :studentId AND e.isActive = true) " +
           "ORDER BY m.createdAt DESC")
    List<Material> findMaterialsForEnrolledStudent(@Param("studentId") Long studentId);

    @Query("SELECT m FROM Material m WHERE m.course.teacher.id = :teacherId ORDER BY m.createdAt DESC")
    List<Material> findMaterialsForTeacher(@Param("teacherId") Long teacherId);
}
