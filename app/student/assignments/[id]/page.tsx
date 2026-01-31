'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOptimistic } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getAssignmentById } from '@/lib/services/assignments';
import { getLessonById } from '@/lib/services/lessons';
import {
  getSubmissionByStudentAndAssignment,
  createSubmission,
  updateSubmission,
  submitSubmission,
} from '@/lib/services/submissions';
import { useStudentLayout } from '@/lib/contexts/StudentLayoutContext';
import { Assignment, Lesson, TestQuestion, Submission } from '@/lib/types';
import { autoGradeQuestion } from '@/lib/utils/grading-utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  Send,
  CheckCircle2,
  Loader2,
  BookOpen,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { DetailSkeleton } from '@/components/skeletons/DetailSkeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function StudentAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const { studentId, studentLoading, refetchSubmissionsOnly } = useStudentLayout();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [optimisticSubmission, addOptimisticSubmission] = useOptimistic(
    submission,
    (current, optimistic: Submission | null) => optimistic ?? current
  );
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!assignmentId || !studentId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [assignmentResult, submissionResult] = await Promise.all([
          getAssignmentById(assignmentId),
          getSubmissionByStudentAndAssignment(studentId, assignmentId),
        ]);

        if (assignmentResult.error || !assignmentResult.data) {
          setError(assignmentResult.error?.message || 'Failed to load assignment');
          setIsLoading(false);
          return;
        }

        setAssignment(assignmentResult.data);

        if (submissionResult.data) {
          setSubmission(submissionResult.data);
          setAnswers(submissionResult.data.answers || {});
        } else {
          // Initialize empty answers for new submission
          const initialAnswers: Record<string, any> = {};
          if (assignmentResult.data.questions) {
            assignmentResult.data.questions.forEach((q) => {
              initialAnswers[q.id] = q.type === 'multiple-choice' ? '' : q.type === 'matching' ? {} : '';
            });
          }
          setAnswers(initialAnswers);
        }

        // Fetch associated lessons
        if (assignmentResult.data.lesson_ids && assignmentResult.data.lesson_ids.length > 0) {
          const lessonPromises = assignmentResult.data.lesson_ids.map((lessonId) => getLessonById(lessonId));
          const lessonResults = await Promise.all(lessonPromises);
          const fetchedLessons = lessonResults
            .filter((result) => result.data !== null)
            .map((result) => result.data as Lesson);
          setLessons(fetchedLessons);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, studentId]);

  const handleSaveDraft = async () => {
    if (!assignment || !studentId) return;

    setIsSaving(true);
    setError(null);

    try {
      let result;
      if (submission) {
        result = await updateSubmission(submission.id, answers);
      } else {
        result = await createSubmission(studentId, assignmentId, answers, assignment.max_points);
      }

      if (result.error) {
        setError(result.error.message);
        setIsSaving(false);
        return;
      }

      setSubmission(result.data);
      setIsSaving(false);
      // Show success message briefly
      setTimeout(() => {}, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!assignment || !studentId) return;

    // Validate that all questions are answered
    if (assignment.questions) {
      for (const question of assignment.questions) {
        if (!answers[question.id] || (typeof answers[question.id] === 'string' && !answers[question.id].trim())) {
          setError(`Please answer question ${assignment.questions.indexOf(question) + 1} before submitting`);
          return;
        }
      }
    }

    if (!confirm('Are you sure you want to submit this assignment? You will not be able to make changes after submitting.')) {
      return;
    }

    setError(null);

    const optimisticSubmitted: Submission = {
      id: submission?.id ?? '',
      student_id: studentId,
      assignment_id: assignmentId,
      answers,
      max_score: assignment.max_points,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    startTransition(() => {
      addOptimisticSubmission(optimisticSubmitted);
    });

    try {
      let currentSubmission = submission;
      if (!currentSubmission) {
        const createResult = await createSubmission(studentId, assignmentId, answers, assignment.max_points);
        if (createResult.error || !createResult.data) {
          addOptimisticSubmission(null);
          setError(createResult.error?.message || 'Failed to create submission');
          return;
        }
        currentSubmission = createResult.data;
      } else {
        const updateResult = await updateSubmission(currentSubmission.id, answers);
        if (updateResult.error) {
          addOptimisticSubmission(null);
          setError(updateResult.error.message);
          return;
        }
        currentSubmission = updateResult.data;
      }

      const submitResult = await submitSubmission(currentSubmission!.id);
      if (submitResult.error) {
        addOptimisticSubmission(null);
        setError(submitResult.error.message);
        return;
      }

      setSubmission(submitResult.data);
      refetchSubmissionsOnly();
      router.push('/student/assignments');
    } catch (err) {
      addOptimisticSubmission(null);
      setError(err instanceof Error ? err.message : 'Failed to submit assignment');
    }
  };

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (studentLoading || !studentId) {
    return <DetailSkeleton />;
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error && !assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link href="/student/assignments">
          <Button>Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const dueDate = new Date(assignment.due_date);
  const now = new Date();
  const isOverdue = now > dueDate;
  const isSubmitted = optimisticSubmission?.submitted_at !== undefined;
  const isGraded = optimisticSubmission?.status === 'graded';
  const isClosed = assignment.status === 'closed';
  const canSubmit = !isSubmitted && !isClosed && (isOverdue ? assignment.allow_late_submissions : true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/student/assignments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">{assignment.title}</h2>
          <p className="text-muted-foreground">{assignment.description}</p>
        </div>
      </div>

      {/* Assignment Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className={cn(isOverdue && !isSubmitted && 'text-red-600 font-medium')}>
                Due: {format(dueDate, 'MMM d, yyyy HH:mm')}
                {isOverdue && !isSubmitted && ' (Overdue)'}
              </span>
            </div>
            {!isOverdue && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDistanceToNow(dueDate, { addSuffix: true })}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Points:</span>
              <span className="font-medium">{assignment.max_points}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Closed Notice */}
      {isClosed && !isSubmitted && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Assignment Closed</p>
                <p className="text-sm text-amber-700">
                  This assignment is closed. You can view it but cannot submit new answers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Status */}
      {isSubmitted && (
        <Card className={cn(isGraded ? 'border-purple-200 bg-purple-50' : 'border-green-200 bg-green-50')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {isGraded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">
                      Graded: {optimisticSubmission?.score} / {optimisticSubmission?.max_score} points
                    </p>
                    {optimisticSubmission?.feedback && (
                      <p className="text-sm text-purple-700 mt-1">{optimisticSubmission.feedback}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Submitted</p>
                    <p className="text-sm text-green-700">
                      Submitted on {optimisticSubmission?.submitted_at && format(new Date(optimisticSubmission.submitted_at), 'MMM d, yyyy HH:mm')} - Awaiting grade
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Associated Lessons */}
      {lessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Associated Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="p-3 border rounded-md">
                  <p className="font-medium">{lesson.title}</p>
                  {lesson.description && <p className="text-sm text-muted-foreground">{lesson.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      {assignment.questions && assignment.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              {assignment.questions.length} question{assignment.questions.length !== 1 ? 's' : ''} •{' '}
              {assignment.max_points} total points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assignment.questions.map((question, index) => (
              <QuestionInput
                key={question.id}
                question={question}
                number={index + 1}
                value={answers[question.id]}
                onChange={(value) => updateAnswer(question.id, value)}
                disabled={isSubmitted || isClosed}
                showCorrections={isGraded}
                submission={submission}
                assignment={assignment}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!isSubmitted && canSubmit && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || isSubmitting}
            className="bg-primary hover:bg-primary-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Assignment
              </>
            )}
          </Button>
        </div>
      )}

      {!isSubmitted && !canSubmit && !isClosed && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Submission Not Allowed</p>
                <p className="text-sm text-red-700">
                  This assignment is overdue and late submissions are not allowed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isSubmitted && (
        <div className="flex justify-end">
          <Link href="/student/assignments">
            <Button variant="outline">Back to Assignments</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

interface QuestionInputProps {
  question: TestQuestion;
  number: number;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  showCorrections?: boolean;
  submission?: Submission | null;
  assignment?: Assignment | null;
}

function QuestionInput({ question, number, value, onChange, disabled, showCorrections, submission, assignment }: QuestionInputProps) {
  const shouldShowCorrections = showCorrections && assignment && submission?.status === 'graded';
  const gradeResult = shouldShowCorrections && question.correctAnswer
    ? autoGradeQuestion(question, value)
    : null;
  const isCorrect = gradeResult?.correct ?? false;
  const pointsEarned = gradeResult?.points ?? 0;
  const requiresManual = !question.correctAnswer || ['translation', 'short-answer', 'essay'].includes(question.type);

  return (
    <div className={cn(
      'border rounded-lg p-4 space-y-3',
      shouldShowCorrections && !requiresManual && (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Question {number}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
              {question.type.replace('-', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">{question.points} points</span>
            {shouldShowCorrections && (
              <div className="flex items-center gap-1 ml-auto">
                {!requiresManual && (
                  <>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-700">Incorrect</span>
                      </>
                    )}
                  </>
                )}
                {requiresManual && (
                  <span className="text-xs text-muted-foreground">Manual grading</span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm mb-3">{question.question}</p>
        </div>
      </div>

      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isSelected = value === option;
            const isCorrectAnswer = Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(option)
              : question.correctAnswer === option;
            
            return (
              <div
                key={idx}
                className={cn(
                  'flex items-center space-x-2 p-2 rounded',
                  shouldShowCorrections && isCorrectAnswer && 'bg-green-100',
                  shouldShowCorrections && isSelected && !isCorrectAnswer && 'bg-red-100'
                )}
              >
                <Checkbox
                  id={`${question.id}-${idx}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) onChange(option);
                  }}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`${question.id}-${idx}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {String.fromCharCode(65 + idx)}. {option}
                  {shouldShowCorrections && isCorrectAnswer && (
                    <span className="ml-2 text-xs font-medium text-green-700">(Correct Answer)</span>
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      )}

      {question.type === 'fill-blank' && (
        <div className="space-y-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your answer"
            disabled={disabled}
          />
          {shouldShowCorrections && question.correctAnswer && (
            <div className="p-2 bg-green-100 border border-green-200 rounded">
              <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer:</p>
              <p className="text-sm font-medium text-green-800">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(', ')
                  : question.correctAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      {question.type === 'short-answer' && (
        <div className="space-y-2">
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your answer"
            rows={3}
            disabled={disabled}
          />
          {shouldShowCorrections && question.correctAnswer && (
            <div className="p-2 bg-green-100 border border-green-200 rounded">
              <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer:</p>
              <p className="text-sm font-medium text-green-800">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(', ')
                  : question.correctAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      {question.type === 'essay' && (
        <div className="space-y-2">
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your essay"
            rows={8}
            disabled={disabled}
          />
          {shouldShowCorrections && !question.correctAnswer && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">This question was manually graded by your teacher.</p>
            </div>
          )}
        </div>
      )}

      {question.type === 'translation' && (
        <div className="space-y-2">
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your translation"
            rows={4}
            disabled={disabled}
          />
          {shouldShowCorrections && question.correctAnswer && (
            <div className="p-2 bg-green-100 border border-green-200 rounded">
              <p className="text-xs font-medium text-muted-foreground mb-1">Correct Translation:</p>
              <p className="text-sm font-medium text-green-800">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(', ')
                  : question.correctAnswer}
              </p>
            </div>
          )}
          {shouldShowCorrections && !question.correctAnswer && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">This question was manually graded by your teacher.</p>
            </div>
          )}
        </div>
      )}

      {question.type === 'matching' && question.options && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">
            Match each item on the left with the correct option on the right
          </p>
          {question.options.map((option, idx) => {
            const studentMatch = value?.[option] || '';
            const correctMatch = Array.isArray(question.correctAnswer) && question.correctAnswer[idx]
              ? question.correctAnswer[idx]
              : '';
            const isMatchCorrect = shouldShowCorrections && correctMatch
              ? String(studentMatch).trim().toLowerCase() === String(correctMatch).trim().toLowerCase()
              : false;

            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm font-medium w-32">{option}</span>
                <Input
                  value={studentMatch}
                  onChange={(e) => onChange({ ...value, [option]: e.target.value })}
                  placeholder="Enter match"
                  className="flex-1"
                  disabled={disabled}
                />
                {shouldShowCorrections && correctMatch && (
                  <span className={cn(
                    'text-xs font-medium w-32',
                    isMatchCorrect ? 'text-green-700' : 'text-red-700'
                  )}>
                    → {correctMatch}
                  </span>
                )}
              </div>
            );
          })}
          {shouldShowCorrections && Array.isArray(question.correctAnswer) && (
            <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded">
              <p className="text-xs font-medium text-muted-foreground mb-1">Correct Matches:</p>
              <div className="space-y-1">
                {question.options.map((option, idx) => (
                  <div key={idx} className="text-sm font-medium text-green-800">
                    {option} → {question.correctAnswer?.[idx] ?? ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Points Display */}
      {shouldShowCorrections && (
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Points: {pointsEarned} / {question.points}
          </span>
          {question.explanation && (
            <div className="text-xs text-blue-600">{question.explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}
