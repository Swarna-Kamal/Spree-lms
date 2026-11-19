package com.spree.service;

import com.spree.dto.MaterialResponse;
import com.spree.entity.Course;
import com.spree.entity.Lesson;
import com.spree.entity.Material;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.CourseRepository;
import com.spree.repository.EnrollmentRepository;
import com.spree.repository.LessonRepository;
import com.spree.repository.MaterialRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

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
                && course.getTeacher().getEmail().equals(authentication.getName())) {
            return;
        }
        throw new BadRequestException("You do not have permission to manage materials for this course");
    }

    private void checkCourseReadAccess(Course course, Authentication authentication) {
        if (isAdmin(authentication)) return;
        if (isTeacher(authentication) && course.getTeacher() != null
                && course.getTeacher().getEmail().equals(authentication.getName())) {
            return;
        }
        User student = getCurrentUser(authentication);
        boolean isEnrolled = enrollmentRepository.existsByStudentIdAndCourseIdAndIsActiveTrue(student.getId(), course.getId());
        if (!isEnrolled) {
            throw new BadRequestException("Access denied: You are not enrolled in this course");
        }
    }

    public MaterialResponse uploadMaterial(
            Long courseId,
            Long lessonId,
            String title,
            String description,
            MultipartFile file,
            Authentication authentication
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        checkCourseManageAccess(course, authentication);

        Lesson lesson = null;
        if (lessonId != null) {
            lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
            if (!lesson.getCourse().getId().equals(course.getId())) {
                throw new BadRequestException("Lesson does not belong to the specified course");
            }
        }

        if (title == null || title.isBlank()) {
            title = file.getOriginalFilename();
        }

        String storedPath = fileStorageService.storeFile(file, "materials");
        User teacher = getCurrentUser(authentication);

        Material material = Material.builder()
                .course(course)
                .lesson(lesson)
                .title(title)
                .description(description)
                .fileUrl(storedPath)
                .fileName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .uploadedBy(teacher)
                .build();

        return mapToResponse(materialRepository.save(material));
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> getMaterialsForEnrolledStudent(Authentication authentication) {
        User student = getCurrentUser(authentication);
        return materialRepository.findMaterialsForEnrolledStudent(student.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> getMaterialsForTeacher(Authentication authentication) {
        User teacher = getCurrentUser(authentication);
        return materialRepository.findMaterialsForTeacher(teacher.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> getMaterialsForCourse(Long courseId, Authentication authentication) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        checkCourseReadAccess(course, authentication);

        return materialRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> getMaterialsForLesson(Long lessonId, Authentication authentication) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        checkCourseReadAccess(lesson.getCourse(), authentication);

        return materialRepository.findByLessonId(lessonId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Resource getMaterialFile(Long materialId, Authentication authentication) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));

        checkCourseReadAccess(material.getCourse(), authentication);

        return fileStorageService.loadFileAsResource(material.getFileUrl());
    }

    @Transactional(readOnly = true)
    public Material getMaterial(Long materialId, Authentication authentication) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));

        checkCourseReadAccess(material.getCourse(), authentication);
        return material;
    }

    public void deleteMaterial(Long materialId, Authentication authentication) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));

        checkCourseManageAccess(material.getCourse(), authentication);

        fileStorageService.deleteFile(material.getFileUrl());
        materialRepository.delete(material);
    }

    private MaterialResponse mapToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .courseId(material.getCourse().getId())
                .courseTitle(material.getCourse().getTitle())
                .lessonId(material.getLesson() != null ? material.getLesson().getId() : null)
                .lessonTitle(material.getLesson() != null ? material.getLesson().getTitle() : null)
                .title(material.getTitle())
                .description(material.getDescription())
                .fileName(material.getFileName())
                .fileSize(material.getFileSize())
                .fileType(material.getFileType())
                .downloadUrl("/api/materials/" + material.getId() + "/download")
                .uploadedByName(material.getUploadedBy() != null ?
                        material.getUploadedBy().getFirstName() + " " + material.getUploadedBy().getLastName() : null)
                .createdAt(material.getCreatedAt())
                .build();
    }
}
