package com.spree.service;

import com.spree.dto.GradeRequest;
import com.spree.dto.SubmissionRequest;
import com.spree.dto.SubmissionResponse;
import com.spree.entity.*;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.AssignmentRepository;
import com.spree.repository.EnrollmentRepository;
import com.spree.repository.GradeRepository;
import com.spree.repository.SubmissionRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
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

    private void checkStudentEnrollment(Assignment assignment, User student) {
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseIdAndIsActiveTrue(student.getId(), assignment.getCourse().getId());
        if (!enrolled) {
            throw new BadRequestException("You are not enrolled in the course for this assignment");
        }
    }

    public SubmissionResponse submitAssignmentWithFile(
            Long assignmentId,
            String content,
            MultipartFile file,
            Authentication authentication
    ) {
        User student = getCurrentUser(authentication);
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        if (!isAdmin(authentication)) {
            checkStudentEnrollment(assignment, student);
        }

        // Deadline check
        if (assignment.getDueDate() != null && Instant.now().isAfter(assignment.getDueDate())) {
            throw new BadRequestException("The submission deadline for this assignment has passed.");
        }

        String storedPath = null;
        String fileName = null;
        Long fileSize = null;

        if (file != null && !file.isEmpty()) {
            storedPath = fileStorageService.storeFile(file, "submissions");
            fileName = file.getOriginalFilename();
            fileSize = file.getSize();
        }

        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId());
        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            if (content != null) {
                submission.setContent(content);
            }
            if (storedPath != null) {
                // Delete previous file if replacing
                if (submission.getFileUrl() != null) {
                    fileStorageService.deleteFile(submission.getFileUrl());
                }
                submission.setFileUrl(storedPath);
                submission.setFileName(fileName);
                submission.setFileSize(fileSize);
            }
            submission.setStatus(SubmissionStatus.SUBMITTED);
            submission.setSubmittedAt(Instant.now());
        } else {
            submission = Submission.builder()
                    .assignment(assignment)
                    .student(student)
                    .content(content)
                    .fileUrl(storedPath)
                    .fileName(fileName)
                    .fileSize(fileSize)
                    .status(SubmissionStatus.SUBMITTED)
                    .submittedAt(Instant.now())
                    .build();
        }

        return mapToResponse(submissionRepository.save(submission));
    }

    public SubmissionResponse submitAssignment(SubmissionRequest request, Authentication authentication) {
        User student = getCurrentUser(authentication);
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", request.getAssignmentId()));

        if (!isAdmin(authentication)) {
            checkStudentEnrollment(assignment, student);
        }

        if (assignment.getDueDate() != null && Instant.now().isAfter(assignment.getDueDate())) {
            throw new BadRequestException("The submission deadline for this assignment has passed.");
        }

        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId());
        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setContent(request.getContent());
            if (request.getFileUrl() != null) {
                submission.setFileUrl(request.getFileUrl());
            }
            submission.setStatus(SubmissionStatus.SUBMITTED);
            submission.setSubmittedAt(Instant.now());
        } else {
            submission = Submission.builder()
                    .assignment(assignment)
                    .student(student)
                    .content(request.getContent())
                    .fileUrl(request.getFileUrl())
                    .status(SubmissionStatus.SUBMITTED)
                    .submittedAt(Instant.now())
                    .build();
        }

        return mapToResponse(submissionRepository.save(submission));
    }

    public SubmissionResponse saveDraft(SubmissionRequest request, Authentication authentication) {
        User student = getCurrentUser(authentication);
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", request.getAssignmentId()));

        if (!isAdmin(authentication)) {
            checkStudentEnrollment(assignment, student);
        }

        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId());
        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setContent(request.getContent());
            if (request.getFileUrl() != null) {
                submission.setFileUrl(request.getFileUrl());
            }
            submission.setStatus(SubmissionStatus.DRAFT);
        } else {
            submission = Submission.builder()
                    .assignment(assignment)
                    .student(student)
                    .content(request.getContent())
                    .fileUrl(request.getFileUrl())
                    .status(SubmissionStatus.DRAFT)
                    .build();
        }

        return mapToResponse(submissionRepository.save(submission));
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId, Authentication authentication) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        if (!isAdmin(authentication)) {
            Course course = assignment.getCourse();
            User teacher = getCurrentUser(authentication);
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(teacher.getId())) {
                throw new BadRequestException("Access denied: You can only view submissions for your own courses");
            }
        }

        return submissionRepository.findByAssignmentId(assignmentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(Long id, Authentication authentication) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));

        User currentUser = getCurrentUser(authentication);
        if (!isAdmin(authentication)) {
            if (isTeacher(authentication)) {
                Course course = submission.getAssignment().getCourse();
                if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                    throw new BadRequestException("Access denied: You can only view submissions for your courses");
                }
            } else {
                if (!submission.getStudent().getId().equals(currentUser.getId())) {
                    throw new BadRequestException("Access denied: You can only view your own submission");
                }
            }
        }

        return mapToResponse(submission);
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getStudentSubmissionForAssignment(Long assignmentId, Authentication authentication) {
        User student = getCurrentUser(authentication);
        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(null);
        return submission != null ? mapToResponse(submission) : null;
    }

    @Transactional(readOnly = true)
    public Resource getSubmissionFile(Long submissionId, Authentication authentication) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        User currentUser = getCurrentUser(authentication);
        if (!isAdmin(authentication)) {
            if (isTeacher(authentication)) {
                Course course = submission.getAssignment().getCourse();
                if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                    throw new BadRequestException("Access denied: You can only download submissions for your own courses");
                }
            } else {
                if (!submission.getStudent().getId().equals(currentUser.getId())) {
                    throw new BadRequestException("Access denied: You can only download your own submission file");
                }
            }
        }

        if (submission.getFileUrl() == null || submission.getFileUrl().isBlank()) {
            throw new BadRequestException("No file attached to this submission");
        }

        return fileStorageService.loadFileAsResource(submission.getFileUrl());
    }

    @Transactional(readOnly = true)
    public Submission getSubmissionEntity(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));
    }

    public SubmissionResponse gradeSubmission(Long submissionId, GradeRequest gradeRequest, Authentication authentication) {
        User teacher = getCurrentUser(authentication);
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        if (!isAdmin(authentication)) {
            Course course = submission.getAssignment().getCourse();
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(teacher.getId())) {
                throw new BadRequestException("You can only grade submissions for your own courses");
            }
        }

        Optional<Grade> existingGrade = gradeRepository.findBySubmissionId(submissionId);
        Grade grade;
        if (existingGrade.isPresent()) {
            grade = existingGrade.get();
            grade.setScore(gradeRequest.getScore());
            grade.setFeedback(gradeRequest.getFeedback());
            grade.setGradedBy(teacher);
            grade.setGradedAt(Instant.now());
        } else {
            grade = Grade.builder()
                    .submission(submission)
                    .gradedBy(teacher)
                    .score(gradeRequest.getScore())
                    .feedback(gradeRequest.getFeedback())
                    .gradedAt(Instant.now())
                    .build();
        }
        gradeRepository.save(grade);

        submission.setStatus(SubmissionStatus.GRADED);
        submissionRepository.save(submission);

        return mapToResponse(submission);
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        Optional<Grade> gradeOpt = gradeRepository.findBySubmissionId(submission.getId());
        SubmissionResponse.GradeInfo gradeInfo = null;

        if (gradeOpt.isPresent()) {
            Grade g = gradeOpt.get();
            gradeInfo = SubmissionResponse.GradeInfo.builder()
                    .score(g.getScore())
                    .feedback(g.getFeedback())
                    .gradedAt(g.getGradedAt())
                    .gradedByName(g.getGradedBy().getFirstName() + " " + g.getGradedBy().getLastName())
                    .build();
        }

        String downloadUrl = (submission.getFileUrl() != null && !submission.getFileUrl().isBlank())
                ? "/api/submissions/" + submission.getId() + "/download"
                : null;

        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getFirstName() + " " + submission.getStudent().getLastName())
                .content(submission.getContent())
                .fileUrl(submission.getFileUrl())
                .fileName(submission.getFileName())
                .fileSize(submission.getFileSize())
                .downloadUrl(downloadUrl)
                .submittedAt(submission.getSubmittedAt())
                .status(submission.getStatus().name())
                .grade(gradeInfo)
                .build();
    }
}
