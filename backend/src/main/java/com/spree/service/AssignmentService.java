package com.spree.service;

import com.spree.dto.AssignmentRequest;
import com.spree.dto.AssignmentResponse;
import com.spree.entity.Assignment;
import com.spree.entity.Course;
import com.spree.entity.Enrollment;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.AssignmentRepository;
import com.spree.repository.CourseRepository;
import com.spree.repository.EnrollmentRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
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

    private void checkCourseManageAccess(Course course, Authentication authentication) {
        if (isAdmin(authentication)) return;
        if (isTeacher(authentication) && course.getTeacher() != null
                && course.getTeacher().getId().equals(getCurrentUser(authentication).getId())) {
            return;
        }
        throw new BadRequestException("You do not have permission to manage assignments for this course");
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignment(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
        return mapToResponse(assignment);
    }

    public AssignmentResponse createAssignment(AssignmentRequest request, Authentication authentication) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        checkCourseManageAccess(course, authentication);

        Assignment assignment = Assignment.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .maxScore(request.getMaxScore())
                .build();

        return mapToResponse(assignmentRepository.save(assignment));
    }

    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request, Authentication authentication) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
        checkCourseManageAccess(assignment.getCourse(), authentication);

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setMaxScore(request.getMaxScore());

        return mapToResponse(assignmentRepository.save(assignment));
    }

    public void deleteAssignment(Long id, Authentication authentication) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
        checkCourseManageAccess(assignment.getCourse(), authentication);
        assignmentRepository.delete(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsForStudent(Authentication authentication) {
        User student = getCurrentUser(authentication);
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        List<AssignmentResponse> results = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            if (enrollment.isActive()) {
                results.addAll(assignmentRepository.findByCourseId(enrollment.getCourse().getId())
                        .stream().map(this::mapToResponse).toList());
            }
        }
        return results;
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .courseId(assignment.getCourse().getId())
                .courseTitle(assignment.getCourse().getTitle())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .maxScore(assignment.getMaxScore())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .build();
    }
}
