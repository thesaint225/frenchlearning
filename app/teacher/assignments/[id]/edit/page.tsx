'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Assignment, AssignmentStatus, Lesson, TestQuestion } from '@/lib/types';
import { QuestionBuilder } from '@/components/teacher/QuestionBuilder';
import { ArrowLeft, Save, Search, Loader2 } from 'lucide-react';
import { SimplePageSkeleton } from '@/components/skeletons/SimplePageSkeleton';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getLessonsByTeacher } from '@/lib/services/lessons';
import {
  getAssignmentById,
  updateAssignment,
} from '@/lib/services/assignments';
import {
  getClassesByTeacher,
  getEnrollmentCountByClass,
} from '@/lib/services/classes';
import { useTeacherId } from '@/lib/hooks/useTeacherId';
import { Class } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [allowLate, setAllowLate] = useState(false);
  const [status, setStatus] = useState<AssignmentStatus>('draft');
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [enrollmentCountByClassId, setEnrollmentCountByClassId] = useState<
    Record<string, number>
  >({});
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { teacherId, loading: authLoading, error: authError } = useTeacherId();

  // Fetch assignment by ID
  useEffect(() => {
    if (!assignmentId) return;
    const fetchAssignment = async () => {
      setIsLoadingAssignment(true);
      setError(null);
      const { data, error: fetchError } = await getAssignmentById(assignmentId);
      if (fetchError || !data) {
        setError(fetchError?.message || 'Assignment not found');
        setAssignment(null);
      } else {
        setAssignment(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setSelectedLessons(data.lesson_ids ?? []);
        setQuestions(data.questions ?? []);
        setDueDate(
          data.due_date
            ? new Date(data.due_date).toISOString().slice(0, 16)
            : ''
        );
        setMaxPoints(data.max_points ?? 100);
        setAllowLate(data.allow_late_submissions ?? false);
        setStatus(data.status);
        setSelectedClassId(data.class_id ?? '');
      }
      setIsLoadingAssignment(false);
    };
    fetchAssignment();
  }, [assignmentId]);

  // Fetch lessons from database
  useEffect(() => {
    if (!teacherId) {
      setLessons([]);
      setIsLoadingLessons(false);
      return;
    }
    const fetchLessons = async () => {
      setIsLoadingLessons(true);
      const { data, error: fetchError } = await getLessonsByTeacher(teacherId);
      if (fetchError || !data) {
        setError(fetchError?.message || 'Failed to load lessons');
        setIsLoadingLessons(false);
        return;
      }
      setLessons(data);
      setIsLoadingLessons(false);
    };
    fetchLessons();
  }, [teacherId]);

  // Fetch classes and enrollment counts for teacher
  useEffect(() => {
    if (!teacherId) {
      setClasses([]);
      setEnrollmentCountByClassId({});
      setIsLoadingClasses(false);
      return;
    }
    const fetchClasses = async () => {
      setIsLoadingClasses(true);
      const { data: classList, error: fetchError } = await getClassesByTeacher(
        teacherId
      );
      if (fetchError) {
        setError(fetchError.message);
        setClasses([]);
        setIsLoadingClasses(false);
        return;
      }
      const list = classList ?? [];
      setClasses(list);
      if (list.length > 0) {
        const counts: Record<string, number> = {};
        await Promise.all(
          list.map(async (c) => {
            const { data: count } = await getEnrollmentCountByClass(c.id);
            counts[c.id] = count;
          })
        );
        setEnrollmentCountByClassId(counts);
      }
      setIsLoadingClasses(false);
    };
    fetchClasses();
  }, [teacherId]);

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    if (!teacherId) {
      setError('Please sign in as a teacher to edit this assignment');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      if (!title.trim()) {
        setError('Title is required');
        setIsLoading(false);
        return;
      }

      if (questions.length === 0 && selectedLessons.length === 0) {
        setError(
          'Please add at least one question or select at least one lesson'
        );
        setIsLoading(false);
        return;
      }

      if (questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question.trim()) {
            setError(`Question ${i + 1} text is required`);
            setIsLoading(false);
            return;
          }
          if (q.points < 1) {
            setError(`Question ${i + 1} must have at least 1 point`);
            setIsLoading(false);
            return;
          }
          if (
            q.type === 'multiple-choice' &&
            (!q.options || q.options.length < 2)
          ) {
            setError(`Question ${i + 1} must have at least 2 options`);
            setIsLoading(false);
            return;
          }
          if (q.type === 'multiple-choice' && !q.correctAnswer) {
            setError(`Question ${i + 1} must have a correct answer selected`);
            setIsLoading(false);
            return;
          }
          if (q.type === 'fill-blank' && !q.correctAnswer) {
            setError(`Question ${i + 1} must have a correct answer`);
            setIsLoading(false);
            return;
          }
          if (q.type === 'matching' && (!q.options || q.options.length === 0)) {
            setError(
              `Question ${i + 1} must have at least one matching pair`
            );
            setIsLoading(false);
            return;
          }
        }
      }

      if (!dueDate) {
        setError('Due date is required');
        setIsLoading(false);
        return;
      }

      if (status === 'published' && !selectedClassId) {
        setError('Please select a class before publishing the assignment');
        setIsLoading(false);
        return;
      }

      const dueDateISO = new Date(dueDate).toISOString();
      const calculatedMaxPoints =
        questions.length > 0
          ? questions.reduce((sum, q) => sum + q.points, 0)
          : maxPoints;

      const { data: updated, error: updateError } = await updateAssignment({
        id: assignment.id,
        title: title.trim(),
        description: description.trim() || undefined,
        class_id: selectedClassId || null,
        lesson_ids: selectedLessons,
        questions: questions.length > 0 ? questions : undefined,
        due_date: dueDateISO,
        status,
        max_points: calculatedMaxPoints,
        allow_late_submissions: allowLate,
      });

      if (updateError || !updated) {
        setError(updateError?.message || 'Failed to update assignment');
        setIsLoading(false);
        return;
      }

      router.push(`/teacher/assignments/${assignment.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsLoading(false);
    }
  };

  if (authLoading || isLoadingAssignment) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SimplePageSkeleton showBack />
      </div>
    );
  }

  if (authError || !teacherId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/teacher/assignments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {authError || 'Please sign in as a teacher to view this page.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/teacher/assignments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/teacher/assignments">
              <Button>Back to Assignments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/assignments/${assignment.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">
            Edit Assignment
          </h2>
          <p className="text-muted-foreground">
            Update assignment details and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter assignment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Week 1: Greetings and Basics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the assignment..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Questions</CardTitle>
            <CardDescription>
              Create or edit questions for this assignment (fill-in-the-blank,
              multiple choice, matching, translation, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionBuilder
              questions={questions}
              onQuestionsChange={setQuestions}
            />
            {questions.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}{' '}
                points
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Assignment</CardTitle>
            <CardDescription>
              Select the class for this assignment. Required when publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              {isLoadingClasses ? (
                <div className="p-3 border border-dashed rounded-md bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    Loading classes…
                  </p>
                </div>
              ) : classes.length === 0 ? (
                <div className="p-3 border border-dashed rounded-md bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    No classes available.{' '}
                    <Link
                      href="/teacher/classes"
                      className="text-primary underline"
                    >
                      Create a class first
                    </Link>
                  </p>
                </div>
              ) : (
                <>
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                  >
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name} (
                          {enrollmentCountByClassId[classItem.id] ?? 0}{' '}
                          students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {status === 'published' && !selectedClassId && (
                    <p className="text-xs text-amber-600">
                      A class must be selected to publish the assignment
                    </p>
                  )}
                  {selectedClassId && (
                    <p className="text-xs text-muted-foreground">
                      {enrollmentCountByClassId[selectedClassId] ?? 0}{' '}
                      student(s) will see this assignment when published
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Lessons (Optional)</CardTitle>
            <CardDescription>
              Optionally choose lessons to include in this assignment. You can
              create questions above or select lessons, or both.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {isLoadingLessons ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading lessons...
                  </span>
                </div>
              ) : filteredLessons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchQuery
                    ? 'No lessons found matching your search'
                    : 'No lessons available. Create a lesson first.'}
                </p>
              ) : (
                filteredLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      id={lesson.id}
                      checked={selectedLessons.includes(lesson.id)}
                      onCheckedChange={() => toggleLesson(lesson.id)}
                    />
                    <Label
                      htmlFor={lesson.id}
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      {lesson.title}
                    </Label>
                    <span className="text-xs text-muted-foreground capitalize">
                      {lesson.type}
                    </span>
                  </div>
                ))
              )}
            </div>
            {selectedLessons.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedLessons.length} lesson
                {selectedLessons.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure assignment settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPoints">
                Maximum Points{' '}
                {questions.length > 0
                  ? '(Auto-calculated from questions)'
                  : '*'}
              </Label>
              <Input
                id="maxPoints"
                type="number"
                value={
                  questions.length > 0
                    ? questions.reduce((sum, q) => sum + q.points, 0)
                    : maxPoints
                }
                onChange={(e) => setMaxPoints(Number(e.target.value))}
                min="1"
                disabled={questions.length > 0}
                required
              />
              {questions.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Points are automatically calculated from your questions
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowLate"
                checked={allowLate}
                onCheckedChange={(checked) => setAllowLate(checked as boolean)}
              />
              <Label htmlFor="allowLate" className="cursor-pointer">
                Allow late submissions
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Link href={`/teacher/assignments/${assignment.id}`}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {status === 'published'
                  ? 'Publish Assignment'
                  : 'Save as Draft'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
