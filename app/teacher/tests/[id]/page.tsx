'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTestById } from '@/lib/mock-data';
import { ArrowLeft, Edit, Monitor, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { formatTimeLimit, calculateTestStatus } from '@/lib/utils/test-utils';
import { TestQuestion } from '@/lib/types';

export default function TestDetailsPage() {
  const params = useParams();
  const testId = params.id as string;
  
  // In a real app, fetch test by ID
  const test = getTestById(testId);

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Test not found</p>
        <Link href="/teacher/tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = calculateTestStatus(test);
  const isActive = currentStatus === 'active';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/tests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">{test.title}</h2>
          <p className="text-muted-foreground">{test.description}</p>
        </div>
        <div className="flex gap-2">
          {isActive && (
            <Link href={`/teacher/tests/${test.id}/monitor`}>
              <Button className="bg-primary hover:bg-primary-dark">
                <Monitor className="mr-2 h-4 w-4" />
                Monitor
              </Button>
            </Link>
          )}
          <Link href={`/teacher/tests/${test.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{currentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Limit</p>
              <p className="font-medium">{formatTimeLimit(test.time_limit_minutes)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="font-medium">{test.max_points} points</p>
            </div>
            {test.passing_score && (
              <div>
                <p className="text-sm text-muted-foreground">Passing Score</p>
                <p className="font-medium">{test.passing_score}%</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Question Randomization</p>
              <p className="font-medium">{test.randomize_questions ? 'Enabled' : 'Disabled'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {format(new Date(test.start_date), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">
                {format(new Date(test.end_date), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(test.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions ({test.questions.length})</CardTitle>
          <CardDescription>Review all test questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <QuestionPreview key={question.id} question={question} number={index + 1} />
            ))}
          </div>
        </CardContent>
      </Card>

      {test.attempt_count !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold">{test.attempt_count}</p>
              </div>
              {test.average_score !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{test.average_score}%</p>
                </div>
              )}
              {test.completion_rate !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{test.completion_rate}%</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href={`/teacher/tests/${test.id}/results`}>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Results
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuestionPreview({ question, number }: { question: TestQuestion; number: number }) {
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
      </div>
      {question.type === 'multiple-choice' && question.options && (
        <div className="ml-4 space-y-1">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded ${
                option === question.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50'
              }`}
            >
              {String.fromCharCode(65 + idx)}. {option}
              {option === question.correctAnswer && (
                <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
              )}
            </div>
          ))}
        </div>
      )}
      {question.explanation && (
        <div className="ml-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <p className="font-medium text-blue-900">Explanation:</p>
          <p className="text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
