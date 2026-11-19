
package com.spree.service;

import com.spree.dto.CourseRequest;
import com.spree.dto.CourseResponse;
import com.spree.entity.Course;
import com.spree.entity.Department;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.CourseRepository;
import com.spree.repository.DepartmentRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "email", authentication.getName()));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean isTeacher(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"));
    }

    private void checkCourseAccess(Course course, Authentication authentication) {
        if (isAdmin(authentication)) {
            return;
        }

        if (isTeacher(authentication)
                && course.getTeacher() != null
                && course.getTeacher().getId().equals(getCurrentUser(authentication).getId())) {
            return;
        }

        if (course.isPublished()) {
            return;
        }

        throw new BadRequestException("You do not have permission to access this course");
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCourses(Authentication authentication) {
        List<Course> courses;

        if (isAdmin(authentication)) {
            courses = courseRepository.findAll();
        } else if (isTeacher(authentication)) {
            courses = courseRepository.findByTeacherId(
                    getCurrentUser(authentication).getId());
        } else {
            courses = courseRepository.findByIsPublishedTrue();
        }

        return courses.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPublicCourses() {
        return courseRepository.findByIsPublishedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourse(Long id, Authentication authentication) {
        Course course = findCourse(id);
        checkCourseAccess(course, authentication);
        return mapToResponse(course);
    }

    public CourseResponse createCourse(
            CourseRequest request, Authentication authentication) {

        if (!isAdmin(authentication) && !isTeacher(authentication)) {
            throw new BadRequestException("Only admins and teachers can create courses");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department", "id", request.getDepartmentId()));

        User teacher;

        if (isTeacher(authentication)) {
            teacher = getCurrentUser(authentication);
        } else {
            if (request.getTeacherId() == null) {
                throw new BadRequestException("Teacher ID is required when an admin creates a course");
            }

            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User", "id", request.getTeacherId()));

            if (teacher.getRole() == null
                    || !"TEACHER".equals(teacher.getRole().getName())) {
                throw new BadRequestException("Selected user is not a teacher");
            }
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(department)
                .teacher(teacher)
                .thumbnailUrl(request.getThumbnailUrl())
                .isPublished(false)
                .build();

        return mapToResponse(courseRepository.save(course));
    }

    public CourseResponse updateCourse(
            Long id, CourseRequest request, Authentication authentication) {

        Course course = findCourse(id);

        if (!isAdmin(authentication)
                && (!isTeacher(authentication)
                || course.getTeacher() == null
                || !course.getTeacher().getId()
                .equals(getCurrentUser(authentication).getId()))) {
            throw new BadRequestException("You can only update your own courses");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department", "id", request.getDepartmentId()));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setDepartment(department);
        course.setThumbnailUrl(request.getThumbnailUrl());

        if (isAdmin(authentication) && request.getTeacherId() != null) {
            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User", "id", request.getTeacherId()));

            if (teacher.getRole() == null
                    || !"TEACHER".equals(teacher.getRole().getName())) {
                throw new BadRequestException("Selected user is not a teacher");
            }

            course.setTeacher(teacher);
        }

        return mapToResponse(courseRepository.save(course));
    }

    public CourseResponse publishCourse(Long id, boolean published,
                                        Authentication authentication) {
        Course course = findCourse(id);

        if (!isAdmin(authentication)
                && (!isTeacher(authentication)
                || course.getTeacher() == null
                || !course.getTeacher().getId()
                .equals(getCurrentUser(authentication).getId()))) {
            throw new BadRequestException("You can only publish your own courses");
        }

        course.setPublished(published);
        return mapToResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id, Authentication authentication) {
        Course course = findCourse(id);

        if (!isAdmin(authentication)
                && (!isTeacher(authentication)
                || course.getTeacher() == null
                || !course.getTeacher().getId()
                .equals(getCurrentUser(authentication).getId()))) {
            throw new BadRequestException("You can only delete your own courses");
        }

        courseRepository.delete(course);
    }

    private Course findCourse(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    public CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .departmentId(course.getDepartment() != null
                        ? course.getDepartment().getId() : null)
                .departmentName(course.getDepartment() != null
                        ? course.getDepartment().getName() : null)
                .teacherId(course.getTeacher() != null
                        ? course.getTeacher().getId() : null)
                .teacherName(course.getTeacher() != null
                        ? course.getTeacher().getFirstName() + " "
                        + course.getTeacher().getLastName() : null)
                .thumbnailUrl(course.getThumbnailUrl())
                .isPublished(course.isPublished())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
