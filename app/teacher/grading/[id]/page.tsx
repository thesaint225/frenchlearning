'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockSubmissions } from '@/lib/mock-data';
import { ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function GradingPanelPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;
  
  // In a real app, fetch submission by ID
  const submission = mockSubmissions.find(s => s.id === submissionId);
  
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

  const [score, setScore] = useState(submission.score?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isGraded, setIsGraded] = useState(submission.status === 'graded');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the grade
    console.log('Grade submitted:', { score, feedback });
    setIsGraded(true);
    router.push('/teacher/grading');
  };

  const autoGradeAnswers = () => {
    // Simple auto-grading logic for demonstration
    // In a real app, this would check against correct answers
    const estimatedScore = Math.floor(submission.max_score * 0.85);
    setScore(estimatedScore.toString());
  };

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
            Review and grade {submission.student?.name}'s submission
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Student Submission</CardTitle>
            <CardDescription>
              {submission.student?.name} - {submission.assignment?.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium">{submission.student?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{submission.student?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">
                  {format(new Date(submission.submitted_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Answers</h3>
              <div className="space-y-3">
                {Object.entries(submission.answers).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm font-medium mb-1">Question {key}</div>
                    <div className="text-sm text-muted-foreground">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                    {/* In a real app, show correct/incorrect based on answer key */}
                    <div className="mt-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Correct</span>
                    </div>
                  </div>
                ))}
              </div>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="score">Score</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={autoGradeAnswers}
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
