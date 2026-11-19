import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import { enrollmentsApi } from '../../api/enrollments';
import { assignmentsApi } from '../../api/assignments';
import { submissionsApi } from '../../api/submissions';
import { announcementsApi } from '../../api/announcements';
import { lessonsApi } from '../../api/lessons';
import { materialsApi } from '../../api/materials';
import type { Enrollment, Assignment, Announcement, Lesson, Submission, Material } from '../../types';
import {
  RefreshCw,
  Send,
  X,
  FileText,
  BookOpen,
  Award,
  Download,
  Paperclip,
  Calendar,
  Layers,
} from 'lucide-react';

export const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<number, Submission>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Course view modal (Lessons & Materials)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<Material[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Submit Assignment Modal
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [enrollRes, assignRes, annRes, matRes] = await Promise.all([
        enrollmentsApi.getMyEnrollments(),
        assignmentsApi.getForStudent(),
        announcementsApi.getForStudent(),
        materialsApi.getForStudent(),
      ]);

      const myEnrollments = (enrollRes.data.data || []).filter((e) => e.isActive);
      const studentAssignments = assignRes.data.data || [];
      setEnrollments(myEnrollments);
      setAssignments(studentAssignments);
      setAnnouncements(annRes.data.data || []);
      setAllMaterials(matRes.data.data || []);

      // Fetch student submissions for these assignments so grades reflect immediately on cards
      if (studentAssignments.length > 0) {
        const subMap: Record<number, Submission> = {};
        await Promise.all(
          studentAssignments.map(async (a) => {
            try {
              const res = await submissionsApi.getMySubmission(a.id);
              if (res.data.data) {
                subMap[a.id] = res.data.data;
              }
            } catch {
              // ignore
            }
          })
        );
        setSubmissionsMap(subMap);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const viewLessonsAndMaterials = async (courseId: number, title: string) => {
    setSelectedCourseId(courseId);
    setSelectedCourseTitle(title);
    try {
      setLoadingLessons(true);
      const [lessRes, matRes] = await Promise.all([
        lessonsApi.getByCourse(courseId),
        materialsApi.getByCourse(courseId),
      ]);
      setCourseLessons(lessRes.data.data || []);
      setCourseMaterials(matRes.data.data || []);
    } catch (err: any) {
      setError('Failed to load course materials.');
    } finally {
      setLoadingLessons(false);
    }
  };

  const openSubmitModal = async (assign: Assignment) => {
    setSelectedAssignment(assign);
    setSubmissionContent('');
    setSubmissionFile(null);
    try {
      const res = await submissionsApi.getMySubmission(assign.id);
      if (res.data.data) {
        setExistingSubmission(res.data.data);
        setSubmissionContent(res.data.data.content || '');
      } else {
        setExistingSubmission(null);
      }
    } catch {
      setExistingSubmission(null);
    }
  };

  const handleSubmitAssignment = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!submissionContent.trim() && !submissionFile && !existingSubmission?.fileName) {
      setError('Please provide text or attach a document for your submission.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await submissionsApi.submitWithFile(
        selectedAssignment.id,
        submissionContent.trim() || undefined,
        submissionFile || undefined
      );

      setSuccess('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionFile(null);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadMaterial = (m: Material) => {
    materialsApi.downloadFile(m.id, m.fileName);
  };

  const handleDownloadSubmissionFile = (sub: Submission) => {
    if (sub.fileName) {
      submissionsApi.downloadSubmissionFile(sub.id, sub.fileName);
    }
  };

  return (
    <AppShell title="Student Dashboard">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Learning Portal</h2>
            <p className="text-slate-500 text-sm mt-1">Access coursework, download instructor materials, submit solutions, and track grades.</p>
          </div>
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {error && <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs font-semibold text-rose-700 animate-fade">{error}</div>}
        {success && <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs font-semibold text-emerald-700 animate-fade">{success}</div>}

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left 2 Cols: Enrolled Courses & Coursework with Scores */}
            <div className="xl:col-span-2 space-y-6">
              {/* My Enrolled Courses */}
              <div className="card-astrowind p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">My Enrolled Subjects</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Classes and subjects assigned to you</p>
                  </div>
                  <Badge variant="info">{enrollments.length} Enrolled</Badge>
                </div>

                {enrollments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    You are not enrolled in any subjects yet. Your teacher or administrator will add you to your courses.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {enrollments.map((enr) => (
                      <div key={enr.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{enr.courseTitle}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => viewLessonsAndMaterials(enr.courseId, enr.courseTitle)}
                          className="text-xs text-primary border-blue-200 hover:bg-blue-50"
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1" /> View Course & Materials
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Materials & Handouts (Dedicated Section) */}
              <div className="card-astrowind p-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-primary" />
                      Course Materials & Handouts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Lecture slides, syllabus, and reading materials uploaded by your professors
                    </p>
                  </div>
                  <Badge variant="info">{allMaterials.length} Materials</Badge>
                </div>

                {allMaterials.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    No course materials uploaded yet for your enrolled subjects.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allMaterials.map((mat) => (
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
                            {mat.uploadedByName && (
                              <span>Uploaded by: <strong className="text-slate-700 dark:text-slate-200">{mat.uploadedByName}</strong></span>
                            )}
                            {mat.createdAt && (
                              <span>{new Date(mat.createdAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleDownloadMaterial(mat)}
                            className="text-xs"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coursework & Assignments with Grade Reflection */}
              <div className="card-astrowind p-6">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900">My Coursework & Assignments</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Submit your solutions and track your scores and teacher feedback</p>
                </div>

                {assignments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No coursework assigned yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {assignments.map((assign) => {
                      const sub = submissionsMap[assign.id];
                      const isGraded = sub && sub.status === 'GRADED';
                      const isSubmitted = sub && sub.status === 'SUBMITTED';

                      return (
                        <div key={assign.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm">{assign.title}</p>
                              {isGraded ? (
                                <Badge variant="success">Graded</Badge>
                              ) : isSubmitted ? (
                                <Badge variant="info">Submitted</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              Subject: <strong className="text-slate-800">{assign.courseTitle}</strong> · Max Score: {assign.maxScore || 100}
                              {assign.dueDate && (
                                <span className="ml-2 text-slate-400 inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                            {assign.description && (
                              <p className="text-xs text-slate-600 line-clamp-2">{assign.description}</p>
                            )}

                            {/* Submitted document pill */}
                            {sub?.fileName && (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-200/60 rounded-xl w-fit">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold text-slate-800">{sub.fileName}</span>
                                {sub.fileSize && (
                                  <span className="text-[11px] text-slate-400">
                                    ({(sub.fileSize / 1024).toFixed(1)} KB)
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadSubmissionFile(sub)}
                                  className="text-primary hover:underline text-[11px] font-semibold ml-1 cursor-pointer"
                                >
                                  Download
                                </button>
                              </div>
                            )}

                            {/* Reflected Grade & Teacher Feedback Box */}
                            {isGraded && sub.grade && (
                              <div className="mt-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                                <Award className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-emerald-950">
                                  <span className="font-bold text-sm block">
                                    Grade: {sub.grade.score} / {assign.maxScore || 100}
                                  </span>
                                  {sub.grade.feedback && (
                                    <p className="mt-1 text-emerald-800">
                                      Teacher Feedback: <em>"{sub.grade.feedback}"</em>
                                    </p>
                                  )}
                                  <span className="text-[10px] text-emerald-700 block mt-1">
                                    Graded by {sub.grade.gradedByName || 'Teacher'} on {new Date(sub.grade.gradedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                            <Button variant="secondary" size="sm" onClick={() => openSubmitModal(assign)}>
                              <Send className="w-3.5 h-3.5" />
                              {sub ? 'View / Resubmit' : 'Submit Solution'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Course Announcements */}
            <div className="space-y-6">
              <div className="card-astrowind p-6">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Notices & Announcements</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Notices for your enrolled courses</p>
                </div>

                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No announcements posted for your subjects.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="py-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={ann.isGlobal ? 'purple' : 'info'}>
                            {ann.isGlobal ? 'Global' : ann.courseName || 'Class'}
                          </Badge>
                          <span className="text-[11px] text-slate-400">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{ann.title}</h4>
                        <p className="text-xs text-slate-600 whitespace-pre-wrap">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Course Lessons & Materials Modal */}
        {selectedCourseId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200/80">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{selectedCourseTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lessons, syllabus & downloadable course materials</p>
                </div>
                <button
                  onClick={() => setSelectedCourseId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {loadingLessons ? (
                  <div className="py-12 flex justify-center">
                    <LoadingSpinner size="md" />
                  </div>
                ) : (
                  <>
                    {/* Downloadable Materials Section */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                        <Paperclip className="w-3.5 h-3.5 text-primary" />
                        Downloadable Course Materials ({courseMaterials.length})
                      </h4>

                      {courseMaterials.length === 0 ? (
                        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-400">
                          No downloadable documents uploaded for this course yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {courseMaterials.map((m) => (
                            <div
                              key={m.id}
                              className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 hover:border-primary/40 transition-all"
                            >
                              <div className="flex items-start gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-slate-900 truncate">{m.title}</p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {m.fileName} • {(m.fileSize / 1024).toFixed(1)} KB
                                    {m.lessonTitle ? ` • ${m.lessonTitle}` : ' • General Material'}
                                  </p>
                                  {m.description && (
                                    <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDownloadMaterial(m)}
                                className="py-1 px-3 text-xs text-primary border-blue-200"
                              >
                                <Download className="w-3.5 h-3.5 mr-1" /> Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lessons Section */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        Course Lessons ({courseLessons.length})
                      </h4>

                      {courseLessons.length === 0 ? (
                        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-400">
                          No lessons published for this course yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {courseLessons.map((lesson, idx) => (
                            <div key={lesson.id} className="p-4 bg-slate-50/60 rounded-2xl border border-slate-200/80">
                              <h5 className="font-bold text-slate-900 text-xs">
                                {idx + 1}. {lesson.title}
                              </h5>
                              {lesson.content && (
                                <p className="text-xs text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">
                                  {lesson.content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Assignment Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/80">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Submit Assignment</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedAssignment.title} · {selectedAssignment.courseTitle}</p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
                {existingSubmission && (
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl text-xs text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">Current Status: {existingSubmission.status}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(existingSubmission.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    {existingSubmission.fileName && (
                      <div className="mt-2 flex items-center justify-between bg-white p-2 rounded-xl border border-blue-100">
                        <span className="font-medium text-slate-700 truncate max-w-[200px]">
                          Attached: {existingSubmission.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownloadSubmissionFile(existingSubmission)}
                          className="text-primary hover:underline text-[11px] font-semibold"
                        >
                          Download current file
                        </button>
                      </div>
                    )}

                    {existingSubmission.grade && (
                      <div className="mt-2 font-bold text-emerald-700">
                        Score: {existingSubmission.grade.score} / {selectedAssignment.maxScore || 100}
                        {existingSubmission.grade.feedback && ` — Feedback: "${existingSubmission.grade.feedback}"`}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Response / Notes (optional if attaching file)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter your answers, commentary, or summary..."
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <FileUploadZone
                  onFileSelect={setSubmissionFile}
                  selectedFile={submissionFile}
                  maxSizeBytes={1024 * 1024}
                  allowedExtensions={['.pdf', '.doc', '.docx']}
                  label="Attach Submission Document (Optional / Replace)"
                  helperText="Supported: PDF (.pdf), Word (.doc, .docx) · Max 1 MB"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedAssignment(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" loading={submitting}>
                    {existingSubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
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
