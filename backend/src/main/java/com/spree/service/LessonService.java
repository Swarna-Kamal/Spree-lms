package com.spree.service;

import com.spree.dto.LessonRequest;
import com.spree.dto.LessonResponse;
import com.spree.entity.Course;
import com.spree.entity.Lesson;
import com.spree.entity.Module;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.CourseRepository;
import com.spree.repository.LessonRepository;
import com.spree.repository.ModuleRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
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
        throw new BadRequestException("You do not have permission to manage lessons for this course");
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonResponse getLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
        return mapToResponse(lesson);
    }

    public LessonResponse createLesson(LessonRequest request, Authentication authentication) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        checkCourseManageAccess(course, authentication);

        Module module = null;
        if (request.getModuleId() != null) {
            module = moduleRepository.findById(request.getModuleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Module", "id", request.getModuleId()));
        }

        Lesson lesson = Lesson.builder()
                .course(course)
                .module(module)
                .title(request.getTitle())
                .content(request.getContent())
                .lessonOrder(request.getLessonOrder())
                .isPublished(true)
                .build();

        return mapToResponse(lessonRepository.save(lesson));
    }

    public LessonResponse updateLesson(Long id, LessonRequest request, Authentication authentication) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
        checkCourseManageAccess(lesson.getCourse(), authentication);

        Module module = null;
        if (request.getModuleId() != null) {
            module = moduleRepository.findById(request.getModuleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Module", "id", request.getModuleId()));
        }

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(request.getLessonOrder());
        lesson.setModule(module);

        return mapToResponse(lessonRepository.save(lesson));
    }

    public void deleteLesson(Long id, Authentication authentication) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
        checkCourseManageAccess(lesson.getCourse(), authentication);
        lessonRepository.delete(lesson);
    }

    public LessonResponse publishLesson(Long id, boolean published, Authentication authentication) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
        checkCourseManageAccess(lesson.getCourse(), authentication);
        lesson.setPublished(published);
        return mapToResponse(lessonRepository.save(lesson));
    }

    private LessonResponse mapToResponse(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .courseTitle(lesson.getCourse().getTitle())
                .moduleId(lesson.getModule() != null ? lesson.getModule().getId() : null)
                .moduleTitle(lesson.getModule() != null ? lesson.getModule().getTitle() : null)
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .lessonOrder(lesson.getLessonOrder())
                .isPublished(lesson.isPublished())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
