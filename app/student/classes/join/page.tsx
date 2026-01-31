'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudentId } from '@/lib/hooks/useStudentId';
import { useStudentLayout } from '@/lib/contexts/StudentLayoutContext';
import { enrollStudentByCode } from '@/lib/services/classes';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SimplePageSkeleton } from '@/components/skeletons/SimplePageSkeleton';

export default function StudentJoinClassPage() {
  const { studentId, loading: authLoading } = useStudentId();
  const { refetchClassesOnly } = useStudentLayout();
  const [classCode, setClassCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ className: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !classCode.trim()) return;
    setError(null);
    setIsSubmitting(true);
    const result = await enrollStudentByCode(studentId, classCode.trim());
    setIsSubmitting(false);
    if (result.success) {
      setSuccess({ className: result.className });
      setClassCode('');
      refetchClassesOnly(); // fire-and-forget: update classes in background
    } else {
      setError(result.error);
    }
  };

  if (authLoading) {
    return <SimplePageSkeleton showBack />;
  }

  if (!studentId) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/student">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f]">Join a class</h2>
          <p className="text-muted-foreground">
            Enter the class code your teacher gave you
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class code</CardTitle>
          <CardDescription>
            Ask your teacher for the class code and enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>You&apos;ve joined {success.className}.</span>
              </div>
              <div className="flex gap-2">
                <Link href="/student">
                  <Button>Go to Dashboard</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(null)}
                >
                  Join another class
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classCode">Class code</Label>
                <Input
                  id="classCode"
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="e.g. FR101-2026-XLIU"
                  className="font-mono"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={isSubmitting || !classCode.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join class'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
