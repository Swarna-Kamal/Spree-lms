package com.spree.service;

import com.spree.dto.AnnouncementRequest;
import com.spree.dto.AnnouncementResponse;
import com.spree.entity.Announcement;
import com.spree.entity.Course;
import com.spree.entity.Enrollment;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.AnnouncementRepository;
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
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
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

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncementsForUser(Authentication authentication) {
        if (isAdmin(authentication)) {
            return announcementRepository.findAll()
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        User user = getCurrentUser(authentication);
        List<Announcement> announcements = new ArrayList<>(announcementRepository.findByIsGlobalTrue());

        if (isTeacher(authentication)) {
            // Teacher sees global + announcements from courses they teach
            List<Course> taughtCourses = courseRepository.findByTeacherId(user.getId());
            for (Course course : taughtCourses) {
                announcements.addAll(announcementRepository.findByCourseId(course.getId()));
            }
        } else {
            // Student sees global + announcements from courses they are actively enrolled in
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
            for (Enrollment enrollment : enrollments) {
                if (enrollment.isActive()) {
                    announcements.addAll(announcementRepository.findByCourseId(enrollment.getCourse().getId()));
                }
            }
        }

        return announcements.stream()
                .distinct()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getGlobalAnnouncements() {
        return announcementRepository.findByIsGlobalTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getCourseAnnouncements(Long courseId) {
        return announcementRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncementsForStudent(Authentication authentication) {
        return getAnnouncementsForUser(authentication);
    }

    public AnnouncementResponse createAnnouncement(AnnouncementRequest request, Authentication authentication) {
        User author = getCurrentUser(authentication);
        Course course = null;

        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

            if (!isAdmin(authentication)) {
                if (!isTeacher(authentication) || course.getTeacher() == null
                        || !course.getTeacher().getId().equals(author.getId())) {
                    throw new BadRequestException("You can only post announcements to your own courses");
                }
            }
        } else {
            if (!isAdmin(authentication)) {
                throw new BadRequestException("Only administrators can create global announcements");
            }
        }

        Announcement announcement = Announcement.builder()
                .course(course)
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .isGlobal(request.isGlobal() || course == null)
                .build();

        return mapToResponse(announcementRepository.save(announcement));
    }

    public AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest request, Authentication authentication) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        User currentUser = getCurrentUser(authentication);

        if (!isAdmin(authentication) && !announcement.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You do not have permission to edit this announcement");
        }

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setGlobal(request.isGlobal());

        return mapToResponse(announcementRepository.save(announcement));
    }

    public void deleteAnnouncement(Long id, Authentication authentication) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        User currentUser = getCurrentUser(authentication);

        if (!isAdmin(authentication) && !announcement.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You do not have permission to delete this announcement");
        }

        announcementRepository.delete(announcement);
    }

    private AnnouncementResponse mapToResponse(Announcement announcement) {
        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .courseId(announcement.getCourse() != null ? announcement.getCourse().getId() : null)
                .courseName(announcement.getCourse() != null ? announcement.getCourse().getTitle() : null)
                .authorId(announcement.getAuthor().getId())
                .authorName(announcement.getAuthor().getFirstName() + " " + announcement.getAuthor().getLastName())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .isGlobal(announcement.isGlobal())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .build();
    }
}
