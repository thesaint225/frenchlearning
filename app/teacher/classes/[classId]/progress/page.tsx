'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassProgressOverview } from '@/components/teacher/Progress/ClassProgressOverview';
import { IndividualProgressTable } from '@/components/teacher/Progress/IndividualProgressTable';
import { ArrowLeft } from 'lucide-react';
import { getClassById, getClassAnalyticsByClass } from '@/lib/mock-data';

export default function ProgressTrackingPage() {
  const params = useParams();
  const classId = params.classId as string;
  const classData = getClassById(classId);
  const analytics = getClassAnalyticsByClass(classId);

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Class not found</p>
        <Link href="/teacher/classes">
          <Button variant="outline" className="mt-4">
            Back to Classes
          </Button>
        </Link>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
        <Link href={`/teacher/classes/${classId}`}>
          <Button variant="outline" className="mt-4">
            Back to Class
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/classes/${classId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Progress Tracking</h2>
          <p className="text-muted-foreground">{classData.name}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Class Overview</h3>
        <ClassProgressOverview analytics={analytics} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Individual Student Progress</h3>
        <IndividualProgressTable analytics={analytics} classId={classId} />
      </div>
    </div>
  );
}
