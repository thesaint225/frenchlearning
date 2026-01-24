'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { QuestionBuilder } from '@/components/teacher/QuestionBuilder';
import { getTestById } from '@/lib/mock-data';
import { Test, TestQuestion, TestStatus } from '@/lib/types';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { validateTestDates } from '@/lib/utils/test-utils';

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  // In a real app, fetch test from API
  const existingTest = getTestById(testId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [passingScore, setPassingScore] = useState<number | undefined>(70);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [status, setStatus] = useState<TestStatus>('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingTest) {
      setTitle(existingTest.title);
      setDescription(existingTest.description || '');
      setQuestions(existingTest.questions);
      setTimeLimitMinutes(existingTest.time_limit_minutes);
      setStartDate(new Date(existingTest.start_date).toISOString().slice(0, 16));
      setEndDate(new Date(existingTest.end_date).toISOString().slice(0, 16));
      setPassingScore(existingTest.passing_score);
      setRandomizeQuestions(existingTest.randomize_questions);
      setStatus(existingTest.status);
    }
  }, [existingTest]);

  if (!existingTest) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Test not found</p>
        <Link href="/teacher/tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    if (timeLimitMinutes < 1) {
      newErrors.timeLimit = 'Time limit must be at least 1 minute';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    const dateError = validateTestDates(startDate, endDate);
    if (dateError) {
      newErrors.dates = dateError;
    }

    if (passingScore !== undefined && (passingScore < 0 || passingScore > 100)) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const updatedTest: Test = {
      ...existingTest,
      title,
      description: description || undefined,
      questions,
      time_limit_minutes: timeLimitMinutes,
      start_date: startDate,
      end_date: endDate,
      passing_score: passingScore,
      randomize_questions: randomizeQuestions,
      status,
      max_points: maxPoints,
      updated_at: new Date().toISOString(),
    };

    // In a real app, this would update the database
    console.log('Test updated:', updatedTest);
    router.push(`/teacher/tests/${testId}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/tests/${testId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Edit Test</h2>
          <p className="text-muted-foreground">Update test details and questions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter test details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Test Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Midterm Exam: French Basics"
                required
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the test..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className={errors.questions ? 'border-2 border-red-500 rounded-lg p-1' : ''}>
          <QuestionBuilder questions={questions} onQuestionsChange={setQuestions} />
          {errors.questions && (
            <p className="text-sm text-red-500 mt-2 px-4">{errors.questions}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Settings</CardTitle>
            <CardDescription>Configure test parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes) *</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  required
                  className={errors.timeLimit ? 'border-red-500' : ''}
                />
                {errors.timeLimit && <p className="text-sm text-red-500">{errors.timeLimit}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore || ''}
                  onChange={(e) => setPassingScore(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                  className={errors.passingScore ? 'border-red-500' : ''}
                />
                {errors.passingScore && <p className="text-sm text-red-500">{errors.passingScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className={errors.startDate || errors.dates ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className={errors.endDate || errors.dates ? 'border-red-500' : ''}
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                {errors.dates && <p className="text-sm text-red-500">{errors.dates}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="randomize"
                checked={randomizeQuestions}
                onCheckedChange={(checked) => setRandomizeQuestions(checked as boolean)}
              />
              <Label htmlFor="randomize" className="cursor-pointer">
                Randomize question order for each student
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TestStatus)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href={`/teacher/tests/${testId}`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
