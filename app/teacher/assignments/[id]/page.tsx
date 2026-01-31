'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAssignmentById } from '@/lib/services/assignments';
import { getLessonById } from '@/lib/services/lessons';
import { Assignment, Lesson, Exercise, TestQuestion } from '@/lib/types';
import { ExerciseDisplay } from '@/components/teacher/ExerciseDisplay';
import { ArrowLeft, Edit, Calendar, Users, CheckCircle2, Clock, FileX, BookOpen, Loader2, FileQuestion, Eye, EyeOff } from 'lucide-react';
import { DetailSkeleton } from '@/components/skeletons/DetailSkeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  draft: { icon: FileX, label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  published: { icon: CheckCircle2, label: 'Published', color: 'bg-green-100 text-green-700' },
  closed: { icon: Clock, label: 'Closed', color: 'bg-red-100 text-red-700' },
};

/**
 * Assignment detail page displaying full assignment information and associated lessons.
 * 
 * @returns The assignment detail page component
 */
export default function AssignmentDetailPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract exercises from lessons
  const exercises = lessons
    .filter(lesson => lesson.type === 'exercise' && lesson.content.exercise)
    .map(lesson => ({
      lesson,
      exercise: lesson.content.exercise as Exercise,
    }));

  useEffect(() => {
    const fetchAssignment = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getAssignmentById(assignmentId);
      
      if (fetchError || !data) {
        setError(fetchError?.message || 'Failed to load assignment');
        setIsLoading(false);
        return;
      }
      
      setAssignment(data);
      setIsLoading(false);

      // Fetch associated lessons
      if (data.lesson_ids && data.lesson_ids.length > 0) {
        setIsLoadingLessons(true);
        const lessonPromises = data.lesson_ids.map(lessonId => getLessonById(lessonId));
        const lessonResults = await Promise.all(lessonPromises);
        
        const fetchedLessons = lessonResults
          .filter(result => result.data !== null)
          .map(result => result.data as Lesson);
        
        setLessons(fetchedLessons);
        setIsLoadingLessons(false);
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error || 'Assignment not found'}</p>
        <Link href="/teacher/assignments">
          <Button>Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[assignment.status].icon;
  const statusColor = statusConfig[assignment.status].color;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/assignments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-[#1f1f1f]">{assignment.title}</h2>
            <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', statusColor)}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig[assignment.status].label}
            </div>
          </div>
          {assignment.description && (
            <p className="text-muted-foreground">{assignment.description}</p>
          )}
        </div>
        <Link href={`/teacher/assignments/${assignment.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{assignment.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {format(new Date(assignment.due_date), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maximum Points</p>
              <p className="font-medium">{assignment.max_points} points</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(assignment.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Submissions</p>
              <p className="text-2xl font-bold">{assignment.submission_count || 0}</p>
            </div>
            {assignment.completion_rate !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{assignment.completion_rate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${assignment.completion_rate}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {assignment.questions && assignment.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5" />
              Assignment Questions
            </CardTitle>
            <CardDescription>
              {assignment.questions.length} question{assignment.questions.length !== 1 ? 's' : ''} •{' '}
              {assignment.questions.reduce((sum, q) => sum + q.points, 0)} total points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.questions.map((question, index) => (
              <QuestionPreview key={question.id} question={question} number={index + 1} showAnswers={false} />
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Associated Lessons</CardTitle>
          <CardDescription>Lessons included in this assignment</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLessons ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading lessons...</span>
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No lessons associated with this assignment</p>
          ) : (
            <div className="space-y-3">
              {lessons.map(lesson => (
                <Link key={lesson.id} href={`/teacher/lessons/${lesson.id}`}>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{lesson.title}</p>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Displays a question in read-only preview mode.
 * 
 * @param props - Component props
 * @param props.question - The question to display
 * @param props.number - The question number
 * @param props.showAnswers - Whether to show correct answers (default: false)
 * @returns Question preview component
 */
function QuestionPreview({ question, number, showAnswers = false }: { question: TestQuestion; number: number; showAnswers?: boolean }) {
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(showAnswers);

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Question {number}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
              {question.type.replace('-', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">{question.points} points</span>
          </div>
          <p className="text-sm">{question.question}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}
          className="ml-2"
        >
          {showCorrectAnswers ? (
            <>
              <EyeOff className="w-4 h-4 mr-1" />
              Hide Answers
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              Show Answers
            </>
          )}
        </Button>
      </div>
      {question.type === 'multiple-choice' && question.options && (
        <div className="ml-4 space-y-1">
          {question.options.map((option, idx) => {
            const isCorrect = Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(option)
              : question.correctAnswer === option;
            
            return (
              <div
                key={idx}
                className={cn(
                  'text-sm p-2 rounded',
                  showCorrectAnswers && isCorrect
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                )}
              >
                {String.fromCharCode(65 + idx)}. {option}
                {showCorrectAnswers && isCorrect && (
                  <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showCorrectAnswers && question.type === 'fill-blank' && (
        <div className="ml-4 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer:</p>
          <p className="text-sm font-medium">
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(', ')
              : question.correctAnswer}
          </p>
        </div>
      )}
      {showCorrectAnswers && question.type === 'matching' && question.options && (
        <div className="ml-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">Matching Pairs:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.options.map((leftItem, idx) => {
              const rightAnswer = Array.isArray(question.correctAnswer)
                ? question.correctAnswer[idx]
                : '';
              
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                >
                  <span className="font-medium text-gray-700">{leftItem}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium text-green-700">{rightAnswer}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showCorrectAnswers && question.type === 'translation' && (
        <div className="ml-4 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs font-medium text-muted-foreground mb-1">Correct Translation:</p>
          <p className="text-sm font-medium">
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(', ')
              : question.correctAnswer}
          </p>
        </div>
      )}
      {showCorrectAnswers && question.type === 'short-answer' && question.correctAnswer && (
        <div className="ml-4 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer:</p>
          <p className="text-sm font-medium">
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(', ')
              : question.correctAnswer}
          </p>
        </div>
      )}
      {question.explanation && (
        <div className="ml-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <p className="font-medium text-blue-900 mb-1">Explanation:</p>
          <p className="text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
