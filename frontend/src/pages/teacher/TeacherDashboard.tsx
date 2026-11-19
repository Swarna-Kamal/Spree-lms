import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatCard } from '../../components/ui/StatCard';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import { coursesApi } from '../../api/courses';
import { assignmentsApi, type AssignmentRequest } from '../../api/assignments';
import { submissionsApi, type GradeRequest } from '../../api/submissions';
import { announcementsApi, type AnnouncementRequest } from '../../api/announcements';
import { lessonsApi, type LessonRequest } from '../../api/lessons';
import { enrollmentsApi } from '../../api/enrollments';
import { usersApi } from '../../api/users';
import { materialsApi } from '../../api/materials';
import type { Course, Assignment, Submission, Enrollment, User, Material, Lesson } from '../../types';
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Plus,
  RefreshCw,
  X,
  Megaphone,
  FileText,
  UserPlus,
  Trash2,
  Upload,
  Download,
  Paperclip,
  Layers,
} from 'lucide-react';

export const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Course Roster & Student Enrollment Modal
  const [selectedRosterCourse, setSelectedRosterCourse] = useState<Course | null>(null);
  const [courseEnrollments, setCourseEnrollments] = useState<Enrollment[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [studentToEnrollId, setStudentToEnrollId] = useState<number | ''>('');
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Course Materials Modal & State
  const [allTeacherMaterials, setAllTeacherMaterials] = useState<Material[]>([]);
  const [selectedMaterialsCourse, setSelectedMaterialsCourse] = useState<Course | null>(null);
  const [courseMaterials, setCourseMaterials] = useState<Material[]>([]);
  const [courseLessonsForMaterials, setCourseLessonsForMaterials] = useState<Lesson[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialLessonId, setMaterialLessonId] = useState<number | ''>('');
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  // Modals
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [formCourseId, setFormCourseId] = useState<number | ''>('');
  const [formAssignTitle, setFormAssignTitle] = useState('');
  const [formAssignDesc, setFormAssignDesc] = useState('');
  const [formMaxScore, setFormMaxScore] = useState<number>(100);

  // Lesson modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState<number | ''>('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  // Announcement modal
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announceCourseId, setAnnounceCourseId] = useState<number | ''>('');
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');

  // Grade Modal
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(100);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const coursesRes = await coursesApi.getAll();
      const myCourses = coursesRes.data.data || [];
      setCourses(myCourses);

      if (myCourses.length > 0) {
        setFormCourseId(myCourses[0].id);
        setLessonCourseId(myCourses[0].id);
        setAnnounceCourseId(myCourses[0].id);

        // Load all teacher materials
        try {
          const matRes = await materialsApi.getForTeacher();
          setAllTeacherMaterials(matRes.data.data || []);
        } catch {
          // ignore
        }

        // Load assignments for all courses
        const assignPromises = myCourses.map((c) => assignmentsApi.getByCourse(c.id));
        const assignResponses = await Promise.all(assignPromises);
        const allAssignments = assignResponses.flatMap((r) => r.data.data || []);
        setAssignments(allAssignments);

        // Load submissions for first assignment if available
        if (allAssignments.length > 0) {
          setSelectedAssignment(allAssignments[0]);
          const subRes = await submissionsApi.getByAssignment(allAssignments[0].id);
          setSubmissions(subRes.data.data || []);
        } else {
          setSelectedAssignment(null);
          setSubmissions([]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load teacher dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openRosterModal = async (course: Course) => {
    setSelectedRosterCourse(course);
    setLoadingRoster(true);
    try {
      const [enrRes, studentsRes] = await Promise.all([
        enrollmentsApi.getCourseEnrollments(course.id),
        usersApi.getByRole('STUDENT'),
      ]);
      setCourseEnrollments(enrRes.data.data || []);
      setAllStudents(studentsRes.data.data || []);
      setStudentToEnrollId('');
    } catch (err: any) {
      setError('Failed to load course enrollments.');
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleEnrollStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRosterCourse || !studentToEnrollId) return;

    try {
      setError('');
      setSuccess('');
      await enrollmentsApi.manualEnroll(selectedRosterCourse.id, Number(studentToEnrollId));
      setSuccess('Student enrolled in course successfully!');
      const enrRes = await enrollmentsApi.getCourseEnrollments(selectedRosterCourse.id);
      setCourseEnrollments(enrRes.data.data || []);
      setStudentToEnrollId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enroll student.');
    }
  };

  const handleUnenrollStudent = async (studentId: number) => {
    if (!selectedRosterCourse) return;
    if (!window.confirm('Are you sure you want to remove this student from the course?')) return;

    try {
      setError('');
      setSuccess('');
      await enrollmentsApi.manualUnenroll(selectedRosterCourse.id, studentId);
      setSuccess('Student removed from course.');
      const enrRes = await enrollmentsApi.getCourseEnrollments(selectedRosterCourse.id);
      setCourseEnrollments(enrRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove student.');
    }
  };

  // Materials Modal Handlers
  const openMaterialsModal = async (course: Course) => {
    setSelectedMaterialsCourse(course);
    setLoadingMaterials(true);
    setMaterialTitle('');
    setMaterialDescription('');
    setMaterialLessonId('');
    setMaterialFile(null);
    try {
      const [matRes, lessRes] = await Promise.all([
        materialsApi.getByCourse(course.id),
        lessonsApi.getByCourse(course.id),
      ]);
      setCourseMaterials(matRes.data.data || []);
      setCourseLessonsForMaterials(lessRes.data.data || []);
    } catch (err: any) {
      setError('Failed to load course materials.');
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleUploadMaterial = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialsCourse || !materialFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setUploadingMaterial(true);
      setError('');
      setSuccess('');

      await materialsApi.upload({
        courseId: selectedMaterialsCourse.id,
        lessonId: materialLessonId ? Number(materialLessonId) : undefined,
        title: materialTitle.trim() || materialFile.name,
        description: materialDescription.trim() || undefined,
        file: materialFile,
      });

      setSuccess('Course document uploaded successfully!');
      setMaterialTitle('');
      setMaterialDescription('');
      setMaterialLessonId('');
      setMaterialFile(null);

      // Refresh list
      const matRes = await materialsApi.getByCourse(selectedMaterialsCourse.id);
      setCourseMaterials(matRes.data.data || []);
      const allMatRes = await materialsApi.getForTeacher();
      setAllTeacherMaterials(allMatRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload material.');
    } finally {
      setUploadingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this course material?')) return;
    try {
      setError('');
      setSuccess('');
      await materialsApi.delete(materialId);
      setSuccess('Course material deleted.');
      if (selectedMaterialsCourse) {
        const matRes = await materialsApi.getByCourse(selectedMaterialsCourse.id);
        setCourseMaterials(matRes.data.data || []);
      }
      const allMatRes = await materialsApi.getForTeacher();
      setAllTeacherMaterials(allMatRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete material.');
    }
  };

  const handleDownloadMaterial = (m: Material) => {
    materialsApi.downloadFile(m.id, m.fileName);
  };

  const handleDownloadSubmission = (sub: Submission) => {
    if (sub.fileName) {
      submissionsApi.downloadSubmissionFile(sub.id, sub.fileName);
    }
  };

  const handleSelectAssignment = async (assign: Assignment) => {
    setSelectedAssignment(assign);
    try {
      const res = await submissionsApi.getByAssignment(assign.id);
      setSubmissions(res.data.data || []);
    } catch (err: any) {
      setError('Failed to load submissions for assignment.');
    }
  };

  const handleCreateAssignment = async (e: FormEvent) => {
    e.preventDefault();
    if (!formCourseId || !formAssignTitle) return;

    try {
      setError('');
      setSuccess('');
      const payload: AssignmentRequest = {
        courseId: Number(formCourseId),
        title: formAssignTitle.trim(),
        description: formAssignDesc.trim(),
        maxScore: Number(formMaxScore),
      };
      await assignmentsApi.create(payload);
      setSuccess('Assignment created successfully.');
      setIsAssignmentModalOpen(false);
      setFormAssignTitle('');
      setFormAssignDesc('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create assignment.');
    }
  };

  const handleCreateLesson = async (e: FormEvent) => {
    e.preventDefault();
    if (!lessonCourseId || !lessonTitle) return;

    try {
      setError('');
      setSuccess('');
      const payload: LessonRequest = {
        courseId: Number(lessonCourseId),
        title: lessonTitle.trim(),
        content: lessonContent.trim(),
        lessonOrder: 1,
      };
      await lessonsApi.create(payload);
      setSuccess('Lesson added successfully.');
      setIsLessonModalOpen(false);
      setLessonTitle('');
      setLessonContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add lesson.');
    }
  };

  const handleCreateAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!announceCourseId) return;

    try {
      setError('');
      setSuccess('');
      const payload: AnnouncementRequest = {
        courseId: Number(announceCourseId),
        title: announceTitle.trim(),
        content: announceContent.trim(),
        isGlobal: false,
      };
      await announcementsApi.create(payload);
      setSuccess('Course announcement posted.');
      setIsAnnounceModalOpen(false);
      setAnnounceTitle('');
      setAnnounceContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post announcement.');
    }
  };

  const handleGrade = async (e: FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      setError('');
      setSuccess('');
      const payload: GradeRequest = {
        score: Number(gradeScore),
        feedback: gradeFeedback.trim(),
      };
      await submissionsApi.grade(gradingSubmission.id, payload);
      setSuccess('Submission graded successfully.');
      setGradingSubmission(null);
      if (selectedAssignment) {
        handleSelectAssignment(selectedAssignment);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to grade submission.');
    }
  };

  const alreadyEnrolledStudentIds = new Set(courseEnrollments.map((e) => e.studentId));
  const availableStudentsToEnroll = allStudents.filter((s) => !alreadyEnrolledStudentIds.has(s.id));

  return (
    <AppShell title="Teacher Dashboard">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Faculty Workspace</h2>
            <p className="text-slate-500 text-sm mt-1">Manage assigned courses, materials, student rosters, assignments, and verified submissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadData} disabled={loading}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Button variant="primary" onClick={() => setIsAssignmentModalOpen(true)} disabled={courses.length === 0}>
              <Plus className="w-4 h-4" /> Create Assignment
            </Button>
          </div>
        </div>

        {error && <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs font-semibold text-rose-700 animate-fade">{error}</div>}
        {success && <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs font-semibold text-emerald-700 animate-fade">{success}</div>}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Assigned Courses"
            value={courses.length}
            icon={<BookOpen className="w-6 h-6 text-primary" />}
            iconBg="bg-blue-50 border border-blue-100"
          />
          <StatCard
            label="Total Assignments"
            value={assignments.length}
            icon={<ClipboardList className="w-6 h-6 text-accent" />}
            iconBg="bg-purple-50 border border-purple-100"
          />
          <StatCard
            label="Submissions Received"
            value={submissions.length}
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-50 border border-emerald-100"
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : courses.length === 0 ? (
          <div className="card-astrowind p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-semibold text-slate-700">No courses assigned yet.</p>
            <p className="text-xs text-slate-400 mt-1">Contact your LMS Administrator to assign courses to your faculty account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Course List & Assignment Submissions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Courses Card */}
              <div className="card-astrowind p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">My Assigned Courses</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Courses you are teaching and managing</p>
                  </div>
                  <Badge variant="info">{courses.length} Courses</Badge>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                          <Badge variant={course.isPublished ? 'success' : 'default'}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Department: {course.departmentName || 'General'}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openMaterialsModal(course)}
                          className="text-xs text-primary border-blue-200 hover:bg-blue-50"
                        >
                          <Paperclip className="w-3.5 h-3.5 mr-1" />
                          Materials
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openRosterModal(course)}
                          className="text-xs text-slate-700"
                        >
                          <UserPlus className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          Manage Students
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions Review Card */}
              <div className="card-astrowind p-6">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Assignment Submissions Review</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedAssignment
                      ? `Viewing submissions for "${selectedAssignment.title}"`
                      : assignments.length > 0
                      ? 'Select an assignment below to review submissions'
                      : 'No assignments created yet'}
                  </p>
                </div>

                {assignments.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                    {assignments.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelectAssignment(a)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedAssignment?.id === a.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {a.title}
                      </button>
                    ))}
                  </div>
                )}

                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No student submissions found for this assignment.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-sm">{sub.studentName}</p>
                            <Badge variant={sub.status === 'GRADED' ? 'success' : 'warning'}>
                              {sub.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Submitted: {new Date(sub.submittedAt).toLocaleString()}
                          </p>

                          {sub.content && (
                            <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                              {sub.content}
                            </div>
                          )}

                          {/* Submitted Attachment */}
                          {sub.fileName && (
                            <div className="mt-2.5 flex items-center gap-2 p-2.5 bg-blue-50/50 border border-blue-200/70 rounded-xl w-fit">
                              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="text-xs">
                                <span className="font-semibold text-slate-800">{sub.fileName}</span>
                                {sub.fileSize && (
                                  <span className="text-slate-400 ml-1.5">
                                    ({(sub.fileSize / 1024).toFixed(1)} KB)
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDownloadSubmission(sub)}
                                className="ml-2 py-1 px-2.5 text-xs text-primary border-blue-200"
                              >
                                <Download className="w-3 h-3 mr-1" /> Download
                              </Button>
                            </div>
                          )}

                          {sub.grade && (
                            <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 w-fit">
                              Score: {sub.grade.score} / {selectedAssignment?.maxScore || 100}
                              {sub.grade.feedback && ` — Feedback: "${sub.grade.feedback}"`}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeScore(sub.grade?.score || 100);
                            setGradeFeedback(sub.grade?.feedback || '');
                          }}
                          className="sm:self-center"
                        >
                          {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Materials & Documents Box (Dedicated Section) */}
              <div className="card-astrowind p-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-primary" />
                      Uploaded Materials & Documents
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Lecture slides, syllabus, and study files available to your enrolled students
                    </p>
                  </div>
                  <Badge variant="info">{allTeacherMaterials.length} Uploaded</Badge>
                </div>

                {allTeacherMaterials.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    No course materials uploaded yet. Click "Materials" on any course card above or use quick actions to upload PDFs and Word documents.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allTeacherMaterials.map((mat) => (
                      <div key={mat.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {mat.title || mat.fileName}
                            </span>
                            <Badge variant="purple">{mat.courseTitle}</Badge>
                            {mat.lessonTitle && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Layers className="w-3 h-3" /> {mat.lessonTitle}
                              </span>
                            )}
                          </div>
                          {mat.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                              {mat.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                              <FileText className="w-3.5 h-3.5 text-blue-500" /> {mat.fileName}
                            </span>
                            {mat.fileSize && (
                              <span>{(mat.fileSize / 1024).toFixed(1)} KB</span>
                            )}
                            {mat.createdAt && (
                              <span>Uploaded: {new Date(mat.createdAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadMaterial(mat)}
                            className="text-xs text-primary border-blue-200 hover:bg-blue-50"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Quick Actions */}
            <div className="space-y-4">
              <div className="card-astrowind p-6">
                <h3 className="text-base font-bold text-slate-900 mb-3">Faculty Actions</h3>
                <div className="space-y-2.5">
                  <Button
                    variant="secondary"
                    className="w-full justify-start text-xs font-semibold py-3 rounded-xl"
                    onClick={() => setIsLessonModalOpen(true)}
                    disabled={courses.length === 0}
                  >
                    <FileText className="w-4 h-4 text-primary mr-2" /> Add Course Lesson
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start text-xs font-semibold py-3 rounded-xl"
                    onClick={() => setIsAnnounceModalOpen(true)}
                    disabled={courses.length === 0}
                  >
                    <Megaphone className="w-4 h-4 text-amber-600 mr-2" /> Post Course Announcement
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start text-xs font-semibold py-3 rounded-xl"
                    onClick={() => setIsAssignmentModalOpen(true)}
                    disabled={courses.length === 0}
                  >
                    <ClipboardList className="w-4 h-4 text-emerald-600 mr-2" /> Create Assignment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Course Materials Manager */}
        {selectedMaterialsCourse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Course Materials</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Course: <span className="font-semibold text-slate-800">{selectedMaterialsCourse.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMaterialsCourse(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload New Material Section */}
              <form onSubmit={handleUploadMaterial} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-primary" /> Upload New Material (Max 1 MB)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Title (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Week 1 Lecture Slides"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Associate with Lesson (optional)</label>
                    <select
                      value={materialLessonId}
                      onChange={(e) => setMaterialLessonId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="">Course Level (General)</option>
                      {courseLessonsForMaterials.map((l) => (
                        <option key={l.id} value={l.id}>
                          Lesson: {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Brief description or instructions for students..."
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <FileUploadZone
                  onFileSelect={setMaterialFile}
                  selectedFile={materialFile}
                  maxSizeBytes={1024 * 1024}
                  allowedExtensions={['.pdf', '.doc', '.docx']}
                  label="Select Course Document"
                  helperText="Supported: PDF (.pdf), Word (.doc, .docx) · Max 1 MB"
                />

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={uploadingMaterial}
                    disabled={!materialFile}
                  >
                    Upload Document
                  </Button>
                </div>
              </form>

              {/* Uploaded Materials List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Uploaded Documents ({courseMaterials.length})
                </h4>

                {loadingMaterials ? (
                  <div className="flex justify-center p-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : courseMaterials.length === 0 ? (
                  <p className="text-center p-8 text-xs text-slate-400">
                    No materials uploaded for this course yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {courseMaterials.map((m) => (
                      <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{m.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {m.fileName} • {(m.fileSize / 1024).toFixed(1)} KB
                              {m.lessonTitle ? ` • Attached to: ${m.lessonTitle}` : ' • Course Level'}
                            </p>
                            {m.description && (
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{m.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadMaterial(m)}
                            className="py-1 px-2.5 text-xs text-primary border-blue-200"
                          >
                            <Download className="w-3 h-3 mr-1" /> Download
                          </Button>
                          <button
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Course Roster & Student Enrollment */}
        {selectedRosterCourse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Course Roster</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Course: <span className="font-semibold text-slate-800">{selectedRosterCourse.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRosterCourse(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enroll Form */}
              <form onSubmit={handleEnrollStudent} className="flex gap-2 mb-6">
                <select
                  value={studentToEnrollId}
                  onChange={(e) => setStudentToEnrollId(e.target.value ? Number(e.target.value) : '')}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20"
                >
                  <option value="">Select a student to enroll...</option>
                  {availableStudentsToEnroll.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.email})
                    </option>
                  ))}
                </select>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!studentToEnrollId}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Enroll Student
                </Button>
              </form>

              {/* Roster Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Enrolled Students ({courseEnrollments.length})
                </h4>

                {loadingRoster ? (
                  <div className="flex justify-center p-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : courseEnrollments.length === 0 ? (
                  <p className="text-center p-6 text-xs text-slate-400">
                    No students currently enrolled in this course.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {courseEnrollments.map((enr) => (
                      <div key={enr.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{enr.studentName}</p>
                          <p className="text-[11px] text-slate-400">{enr.studentEmail}</p>
                        </div>
                        <button
                          onClick={() => handleUnenrollStudent(enr.studentId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Assignment */}
        {isAssignmentModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Create Assignment</h3>
                <button
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Course</label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essay on Machine Learning"
                    value={formAssignTitle}
                    onChange={(e) => setFormAssignTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide assignment guidelines and submission format requirements..."
                    value={formAssignDesc}
                    onChange={(e) => setFormAssignDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Score</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsAssignmentModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Publish Assignment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Lesson */}
        {isLessonModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Add Course Lesson</h3>
                <button
                  onClick={() => setIsLessonModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={lessonCourseId}
                    onChange={(e) => setLessonCourseId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction & Syntax"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Content / Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Enter the lesson text, notes, and references..."
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsLessonModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Lesson
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Post Announcement */}
        {isAnnounceModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Post Course Announcement</h3>
                <button
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={announceCourseId}
                    onChange={(e) => setAnnounceCourseId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm date announcement"
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Write your announcement..."
                    value={announceContent}
                    onChange={(e) => setAnnounceContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsAnnounceModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Post to Enrolled Students
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Grade Submission */}
        {gradingSubmission && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Grade Student Submission</h3>
                <button
                  onClick={() => setGradingSubmission(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                <p className="font-semibold text-slate-900">Student: {gradingSubmission.studentName}</p>
                <p className="text-slate-500 mt-0.5">Assignment: {gradingSubmission.assignmentTitle}</p>
                {gradingSubmission.fileName && (
                  <div className="mt-2 flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                    <span className="truncate max-w-[200px] text-slate-700 font-medium">
                      {gradingSubmission.fileName}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadSubmission(gradingSubmission)}
                      className="py-0.5 px-2 text-[11px]"
                    >
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={handleGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Score (out of {selectedAssignment?.maxScore || 100})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={selectedAssignment?.maxScore || 100}
                    required
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback for the student..."
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setGradingSubmission(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Grade
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
