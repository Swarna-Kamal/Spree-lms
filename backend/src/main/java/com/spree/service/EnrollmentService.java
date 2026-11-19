package com.spree.service;

import com.spree.dto.EnrollmentResponse;
import com.spree.entity.Course;
import com.spree.entity.Enrollment;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.CourseRepository;
import com.spree.repository.EnrollmentRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authentication.getName()));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean isTeacher(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"));
    }

    public EnrollmentResponse enrollStudent(Long courseId, Authentication authentication) {
        User student = getCurrentUser(authentication);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.isPublished()) {
            throw new BadRequestException("Cannot enroll in an unpublished course");
        }

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            Enrollment existing = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).get();
            if (existing.isActive()) {
                throw new BadRequestException("You are already enrolled in this course");
            }
            existing.setActive(true);
            existing.setEnrolledAt(Instant.now());
            return mapToResponse(enrollmentRepository.save(existing));
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrolledAt(Instant.now())
                .isActive(true)
                .build();

        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    public void unenrollStudent(Long courseId, Authentication authentication) {
        User student = getCurrentUser(authentication);
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course"));
        enrollmentRepository.delete(enrollment);
    }

    public EnrollmentResponse manualEnrollStudent(Long courseId, Long studentId, Authentication authentication) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Security check: only admin or the teacher assigned to the course
        if (!isAdmin(authentication)) {
            User currentTeacher = getCurrentUser(authentication);
            if (!isTeacher(authentication) || course.getTeacher() == null || !course.getTeacher().getId().equals(currentTeacher.getId())) {
                throw new BadRequestException("You can only enroll students in courses you teach.");
            }
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            Enrollment existing = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).get();
            existing.setActive(true);
            return mapToResponse(enrollmentRepository.save(existing));
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrolledAt(Instant.now())
                .isActive(true)
                .build();

        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    public void manualUnenrollStudent(Long courseId, Long studentId, Authentication authentication) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!isAdmin(authentication)) {
            User currentTeacher = getCurrentUser(authentication);
            if (!isTeacher(authentication) || course.getTeacher() == null || !course.getTeacher().getId().equals(currentTeacher.getId())) {
                throw new BadRequestException("You can only unenroll students from courses you teach.");
            }
        }

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for student " + studentId + " in course " + courseId));
        enrollmentRepository.delete(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyEnrollments(Authentication authentication) {
        User student = getCurrentUser(authentication);
        return enrollmentRepository.findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName())
                .studentEmail(enrollment.getStudent().getEmail())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .enrolledAt(enrollment.getEnrolledAt())
                .isActive(enrollment.isActive())
                .build();
    }
}
