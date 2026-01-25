'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSubmissionById } from '@/lib/services/submissions';
import { getAssignmentById } from '@/lib/services/assignments';
import { gradeSubmission } from '@/lib/services/submissions';
import { Submission, Assignment, TestQuestion } from '@/lib/types';
import { calculateTestScore, autoGradeQuestion } from '@/lib/utils/grading-utils';
import { ArrowLeft, Save, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function GradingPanelPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isGraded, setIsGraded] = useState(false);
  const [autoGradeMessage, setAutoGradeMessage] = useState<string | null>(null);

  // Fetch submission and assignment
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const submissionResult = await getSubmissionById(submissionId);

        if (submissionResult.error || !submissionResult.data) {
          setError(submissionResult.error?.message || 'Submission not found');
          setIsLoading(false);
          return;
        }

        const fetchedSubmission = submissionResult.data;
        setSubmission(fetchedSubmission);
        setScore(fetchedSubmission.score?.toString() || '');
        setFeedback(fetchedSubmission.feedback || '');
        setIsGraded(fetchedSubmission.status === 'graded');

        // Fetch assignment
        const assignmentResult = await getAssignmentById(fetchedSubmission.assignment_id);
        if (assignmentResult.data) {
          setAssignment(assignmentResult.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (submissionId) {
      fetchData();
    }
  }, [submissionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submission) return;

    try {
      setIsSaving(true);
      setError(null);

      const scoreNum = Number(score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > submission.max_score) {
        setError(`Score must be between 0 and ${submission.max_score}`);
        setIsSaving(false);
        return;
      }

      const result = await gradeSubmission(submissionId, scoreNum, feedback.trim() || undefined);

      if (result.error || !result.data) {
        setError(result.error?.message || 'Failed to save grade');
        setIsSaving(false);
        return;
      }

      setSubmission(result.data);
      setIsGraded(true);
      router.push('/teacher/grading');
    } catch (err) {
      console.error('Error grading submission:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsSaving(false);
    }
  };

  const autoGradeAnswers = () => {
    if (!submission || !assignment) {
      setAutoGradeMessage('Assignment data not available');
      return;
    }

    if (!assignment.questions || assignment.questions.length === 0) {
      setAutoGradeMessage('No questions found in assignment. Cannot auto-grade.');
      return;
    }

    try {
      const { score: calculatedScore, maxScore, autoGraded } = calculateTestScore(
        assignment.questions,
        submission.answers
      );

      setScore(calculatedScore.toString());

      // Count auto-gradable vs manual questions
      let autoGradableCount = 0;
      let manualCount = 0;

      assignment.questions.forEach((question) => {
        if (question.correctAnswer && ['multiple-choice', 'fill-blank', 'matching'].includes(question.type)) {
          autoGradableCount++;
        } else {
          manualCount++;
        }
      });

      if (autoGraded) {
        setAutoGradeMessage(`Auto-graded all ${autoGradableCount} questions. Score: ${calculatedScore} / ${maxScore}`);
      } else {
        setAutoGradeMessage(
          `Auto-graded ${autoGradableCount} questions. ${manualCount} questions require manual grading. Score: ${calculatedScore} / ${maxScore}`
        );
      }
    } catch (err) {
      console.error('Error auto-grading:', err);
      setAutoGradeMessage('Error calculating score. Please grade manually.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading submission...</span>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link href="/teacher/grading">
          <Button className="mt-4">Back to Grading</Button>
        </Link>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Submission not found</p>
        <Link href="/teacher/grading">
          <Button className="mt-4">Back to Grading</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/grading">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Grade Submission</h2>
          <p className="text-muted-foreground">
            Review and grade student submission
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Student Submission</CardTitle>
            <CardDescription>
              {assignment?.title || 'Unknown Assignment'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student ID:</span>
                <span className="font-medium">{submission.student_id.substring(0, 8)}...</span>
              </div>
              {submission.submitted_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium">
                    {format(new Date(submission.submitted_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Answers</h3>
              {Object.keys(submission.answers).length === 0 ? (
                <p className="text-sm text-muted-foreground">No answers submitted</p>
              ) : !assignment?.questions || assignment.questions.length === 0 ? (
                <div className="space-y-3">
                  {Object.entries(submission.answers).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-md">
                      <div className="text-sm font-medium mb-1">Question {key}</div>
                      <div className="text-sm text-muted-foreground">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(submission.answers).map(([answerKey, studentAnswer]) => {
                    const question = assignment.questions?.find((q) => q.id === answerKey);
                    
                    if (!question) {
                      return (
                        <div key={answerKey} className="p-3 bg-gray-50 rounded-md">
                          <div className="text-sm font-medium mb-1">Question {answerKey}</div>
                          <div className="text-sm text-muted-foreground">
                            {typeof studentAnswer === 'object' ? JSON.stringify(studentAnswer, null, 2) : String(studentAnswer)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Question not found in assignment</p>
                        </div>
                      );
                    }

                    const gradeResult = question.correctAnswer
                      ? autoGradeQuestion(question, studentAnswer)
                      : { correct: false, points: 0 };

                    const isCorrect = gradeResult.correct;
                    const pointsEarned = gradeResult.points;
                    const requiresManual = !question.correctAnswer || ['translation', 'short-answer', 'essay'].includes(question.type);

                    return (
                      <div
                        key={answerKey}
                        className={cn(
                          'p-4 rounded-md border',
                          isCorrect && !requiresManual
                            ? 'bg-green-50 border-green-200'
                            : !isCorrect && !requiresManual
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">Question {answerKey}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded capitalize">
                                {question.type.replace('-', ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">{question.points} points</span>
                            </div>
                            <p className="text-sm font-medium mb-2">{question.question}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {isCorrect && !requiresManual ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Correct</span>
                              </>
                            ) : !isCorrect && !requiresManual ? (
                              <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium text-red-700">Incorrect</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">Manual</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Student Answer:</span>
                            <div className="mt-1 p-2 bg-white rounded border">
                              {question.type === 'multiple-choice' && question.options ? (
                                <div className="text-sm">
                                  {question.options.find((opt) => opt === studentAnswer) || String(studentAnswer)}
                                </div>
                              ) : question.type === 'matching' && typeof studentAnswer === 'object' ? (
                                <div className="space-y-1">
                                  {Object.entries(studentAnswer as Record<string, string>).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                      {key} → {value}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm">
                                  {typeof studentAnswer === 'object' ? JSON.stringify(studentAnswer, null, 2) : String(studentAnswer)}
                                </div>
                              )}
                            </div>
                          </div>

                          {question.correctAnswer && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Correct Answer:</span>
                              <div className="mt-1 p-2 bg-green-100 rounded border border-green-200">
                                {question.type === 'multiple-choice' ? (
                                  <div className="text-sm font-medium text-green-800">
                                    {Array.isArray(question.correctAnswer)
                                      ? question.correctAnswer.join(', ')
                                      : question.correctAnswer}
                                  </div>
                                ) : question.type === 'matching' && question.options && Array.isArray(question.correctAnswer) ? (
                                  <div className="space-y-1">
                                    {question.options.map((option, idx) => (
                                      <div key={idx} className="text-sm font-medium text-green-800">
                                        {option} → {question.correctAnswer[idx]}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm font-medium text-green-800">
                                    {Array.isArray(question.correctAnswer)
                                      ? question.correctAnswer.join(', ')
                                      : String(question.correctAnswer)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-muted-foreground">
                              Points: {pointsEarned} / {question.points}
                            </span>
                            {question.explanation && (
                              <div className="text-xs text-blue-600">{question.explanation}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grading Form */}
        <Card>
          <CardHeader>
            <CardTitle>Grading</CardTitle>
            <CardDescription>
              Enter score and feedback for this submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGraded ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Submission Graded</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    {submission.score} / {submission.max_score}
                  </div>
                  {submission.feedback && (
                    <p className="text-sm text-green-800">{submission.feedback}</p>
                  )}
                </div>
                <Button
                  onClick={() => setIsGraded(false)}
                  variant="outline"
                  className="w-full"
                >
                  Edit Grade
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="score">Score</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={autoGradeAnswers}
                      disabled={!assignment?.questions || assignment.questions.length === 0}
                    >
                      Auto-Grade
                    </Button>
                  </div>
                  {autoGradeMessage && (
                    <p className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                      {autoGradeMessage}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="score"
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      min="0"
                      max={submission.max_score}
                      required
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">/ {submission.max_score}</span>
                  </div>
                  {score && (
                    <p className="text-xs text-muted-foreground">
                      Percentage: {Math.round((Number(score) / submission.max_score) * 100)}%
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Link href="/teacher/grading" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Grade
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
