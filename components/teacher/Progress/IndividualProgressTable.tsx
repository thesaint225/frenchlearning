'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, Eye } from 'lucide-react';
import { ClassAnalytics } from '@/lib/types';
import Link from 'next/link';

interface IndividualProgressTableProps {
  analytics: ClassAnalytics;
  classId: string;
}

type SortField = 'name' | 'lessons' | 'assignments' | 'score';
type SortDirection = 'asc' | 'desc';

export function IndividualProgressTable({
  analytics,
  classId,
}: IndividualProgressTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSorted = [...analytics.student_progress]
    .filter((student) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        student.student?.name.toLowerCase().includes(query) ||
        student.student?.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (a.student?.name || '').localeCompare(b.student?.name || '');
          break;
        case 'lessons':
          comparison = a.lessons_completed - b.lessons_completed;
          break;
        case 'assignments':
          comparison = a.assignment_completion_rate - b.assignment_completion_rate;
          break;
        case 'score':
          comparison = a.average_score - b.average_score;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2"
    >
      {children}
      <ArrowUpDown className="w-3 h-3 ml-2" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name">Student</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="lessons">Lessons</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="assignments">Assignments</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="score">Avg Score</SortButton>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">
                    {student.student?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {student.lessons_completed}/{student.total_lessons}
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(student.lessons_completed / student.total_lessons) * 100}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.assignment_completion_rate}%
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${student.assignment_completion_rate}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {student.average_score}%
                  </TableCell>
                  <TableCell>
                    <Link href={`/teacher/classes/${classId}/students/${student.student_id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
