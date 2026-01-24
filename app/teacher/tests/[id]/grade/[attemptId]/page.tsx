'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTestById, getTestAttemptById } from '@/lib/mock-data';
import { ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { calculateTestScore, autoGradeQuestion } from '@/lib/utils/grading-utils';
import { TestQuestion } from '@/lib/types';

export default function GradeTestAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;
  const attemptId = params.attemptId as string;

  // In a real app, fetch test and attempt from API
  const test = getTestById(testId);
  const attempt = getTestAttemptById(attemptId);

  const [score, setScore] = useState(attempt?.score?.toString() || '');
  const [feedback, setFeedback] = useState(attempt?.feedback || '');
  const [isGraded, setIsGraded] = useState(attempt?.status === 'graded');
  const [questionScores, setQuestionScores] = useState<Record<string, number>>(() => {
    // Initialize question scores from auto-grading
    if (!test || !attempt) return {};
    const scores: Record<string, number> = {};
    test.questions.forEach((q) => {
      const studentAnswer = attempt.answers[q.id];
      if (studentAnswer !== undefined) {
        const result = autoGradeQuestion(q, studentAnswer);
        scores[q.id] = result.points;
      }
    });
    return scores;
  });

  if (!test || !attempt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Test or attempt not found</p>
        <Link href={`/teacher/tests/${testId}/monitor`}>
          <Button className="mt-4">Back to Monitor</Button>
        </Link>
      </div>
    );
  }

  const handleAutoGrade = () => {
    const result = calculateTestScore(test.questions, attempt.answers);
    setScore(result.score.toString());
    
    // Update question scores
    const scores: Record<string, number> = {};
    test.questions.forEach((q) => {
      const studentAnswer = attempt.answers[q.id];
      if (studentAnswer !== undefined) {
        const gradeResult = autoGradeQuestion(q, studentAnswer);
        scores[q.id] = gradeResult.points;
      } else {
        scores[q.id] = 0;
      }
    });
    setQuestionScores(scores);
  };

  const updateQuestionScore = (questionId: string, points: number) => {
    const newScores = { ...questionScores, [questionId]: points };
    setQuestionScores(newScores);
    
    // Recalculate total score
    const total = Object.values(newScores).reduce((sum, p) => sum + p, 0);
    setScore(total.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the grade
    console.log('Grade submitted:', { score, feedback, questionScores });
    setIsGraded(true);
    router.push(`/teacher/tests/${testId}/monitor`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/tests/${testId}/monitor`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Grade Test Attempt</h2>
          <p className="text-muted-foreground">
            {attempt.student?.name} - {test.title}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Attempt */}
        <Card>
          <CardHeader>
            <CardTitle>Student Attempt</CardTitle>
            <CardDescription>
              {attempt.student?.name} - Submitted{' '}
              {attempt.submitted_at
                ? format(new Date(attempt.submitted_at), 'MMM d, yyyy HH:mm')
                : 'Not submitted'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium">{attempt.student?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{attempt.student?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium">
                  {format(new Date(attempt.started_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Answers</h3>
              <div className="space-y-4">
                {test.questions.map((question, index) => (
                  <QuestionGradingView
                    key={question.id}
                    question={question}
                    studentAnswer={attempt.answers[question.id]}
                    questionNumber={index + 1}
                    score={questionScores[question.id] ?? 0}
                    onScoreChange={(points) => updateQuestionScore(question.id, points)}
                    maxPoints={question.points}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grading Form */}
        <Card>
          <CardHeader>
            <CardTitle>Grading</CardTitle>
            <CardDescription>Enter score and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {isGraded ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Attempt Graded</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    {score} / {attempt.max_score}
                  </div>
                  {feedback && <p className="text-sm text-green-800">{feedback}</p>}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="score">Score</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAutoGrade}
                    >
                      Auto-Grade
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="score"
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      min="0"
                      max={attempt.max_score}
                      required
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">/ {attempt.max_score}</span>
                  </div>
                  {score && (
                    <p className="text-xs text-muted-foreground">
                      Percentage: {Math.round((Number(score) / attempt.max_score) * 100)}%
                      {test.passing_score && (
                        <span
                          className={cn(
                            'ml-2',
                            (Number(score) / attempt.max_score) * 100 >= test.passing_score
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          ({test.passing_score}% required to pass)
                        </span>
                      )}
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
                  <Link href={`/teacher/tests/${testId}/monitor`} className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark">
                    <Save className="mr-2 h-4 w-4" />
                    Save Grade
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

interface QuestionGradingViewProps {
  question: TestQuestion;
  studentAnswer: any;
  questionNumber: number;
  score: number;
  onScoreChange: (points: number) => void;
  maxPoints: number;
}

function QuestionGradingView({
  question,
  studentAnswer,
  questionNumber,
  score,
  onScoreChange,
  maxPoints,
}: QuestionGradingViewProps) {
  const isAutoGradable = question.correctAnswer !== null;
  const autoGradeResult = isAutoGradable && studentAnswer !== undefined
    ? autoGradeQuestion(question, studentAnswer)
    : null;

  const isCorrect = autoGradeResult?.correct ?? false;
  const needsManualGrading = !isAutoGradable;

  return (
    <div className="p-3 border rounded-md space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Question {questionNumber}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded capitalize">
              {question.type.replace('-', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">{maxPoints} points</span>
          </div>
          <p className="text-sm mb-2">{question.question}</p>
        </div>
        <div className="flex items-center gap-1">
          {isAutoGradable && (
            <>
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </>
          )}
          {needsManualGrading && (
            <span className="text-xs text-yellow-600">Manual</span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {question.type === 'multiple-choice' && question.options && (
          <div className="ml-4 space-y-1">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className={cn(
                  'text-sm p-1 rounded',
                  option === studentAnswer
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50',
                  option === question.correctAnswer && 'bg-green-50 border border-green-200'
                )}
              >
                {String.fromCharCode(65 + idx)}. {option}
                {option === question.correctAnswer && (
                  <span className="ml-2 text-green-600 text-xs">✓ Correct</span>
                )}
                {option === studentAnswer && option !== question.correctAnswer && (
                  <span className="ml-2 text-red-600 text-xs">✗ Selected</span>
                )}
              </div>
            ))}
          </div>
        )}

        {question.type !== 'multiple-choice' && (
          <div className="ml-4">
            <div className="text-sm">
              <p className="font-medium text-muted-foreground mb-1">Student Answer:</p>
              <p className="p-2 bg-blue-50 border border-blue-200 rounded">
                {typeof studentAnswer === 'object'
                  ? JSON.stringify(studentAnswer, null, 2)
                  : String(studentAnswer || 'No answer provided')}
              </p>
            </div>
            {question.correctAnswer && (
              <div className="text-sm mt-2">
                <p className="font-medium text-muted-foreground mb-1">Correct Answer:</p>
                <p className="p-2 bg-green-50 border border-green-200 rounded">
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.join(', ')
                    : String(question.correctAnswer)}
                </p>
              </div>
            )}
          </div>
        )}

        {needsManualGrading && (
          <div className="ml-4 mt-2">
            <Label className="text-xs">Manual Score</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max={maxPoints}
                value={score}
                onChange={(e) => onScoreChange(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">/ {maxPoints}</span>
            </div>
          </div>
        )}

        {question.explanation && (
          <div className="ml-4 mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <p className="font-medium text-blue-900">Explanation:</p>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
