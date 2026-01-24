'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { StudentCard } from '@/components/teacher/StudentRoster/StudentCard';
import { AddStudentDialog } from '@/components/teacher/StudentRoster/AddStudentDialog';
import { InviteStudentDialog } from '@/components/teacher/StudentRoster/InviteStudentDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Mail, Search, Copy, RefreshCw, Users } from 'lucide-react';
import {
  getClassById,
  getEnrollmentsByClass,
  getStudentById,
  generateClassCode,
} from '@/lib/mock-data';
import { Enrollment, Student } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StudentRosterPage() {
  const params = useParams();
  const classId = params.classId as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(
    getEnrollmentsByClass(classId)
  );

  const classData = getClassById(classId);
  const classCode = classData?.class_code || '';

  const filteredEnrollments = useMemo(() => {
    if (!searchQuery.trim()) return enrollments;
    const query = searchQuery.toLowerCase();
    return enrollments.filter(
      (enrollment) =>
        enrollment.student?.name.toLowerCase().includes(query) ||
        enrollment.student?.email.toLowerCase().includes(query)
    );
  }, [enrollments, searchQuery]);

  const handleAddStudent = (email: string) => {
    // In a real app, this would be an API call
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: email.split('@')[0],
      email,
      progress: {
        lessons_completed: 0,
        total_lessons: 20,
        average_score: 0,
      },
    };
    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      class_id: classId,
      student_id: newStudent.id,
      student: newStudent,
      enrolled_at: new Date().toISOString(),
      status: 'active',
      enrollment_method: 'manual',
    };
    setEnrollments([...enrollments, newEnrollment]);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (confirm('Are you sure you want to remove this student from the class?')) {
      setEnrollments(enrollments.filter((e) => e.student_id !== studentId));
    }
  };

  const handleInviteStudents = (emails: string[], message?: string) => {
    // In a real app, this would send email invitations
    console.log('Inviting students:', emails, message);
    alert(`Invitations sent to ${emails.length} student(s)!`);
  };

  const handleCopyClassCode = () => {
    navigator.clipboard.writeText(classCode);
    alert('Class code copied to clipboard!');
  };

  const handleRegenerateClassCode = () => {
    if (confirm('Are you sure you want to generate a new class code? The old code will no longer work.')) {
      // In a real app, this would update the class code
      alert('New class code generated!');
    }
  };

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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Student Roster</h2>
          <p className="text-muted-foreground">{classData.name}</p>
        </div>
      </div>

      {/* Class Code Card */}
      <Card>
        <CardHeader>
          <CardTitle>Class Code</CardTitle>
          <CardDescription>
            Share this code with students so they can join your class
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md border">
              <span className="font-mono font-semibold text-lg">{classCode}</span>
            </div>
            <Button variant="outline" onClick={handleCopyClassCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleRegenerateClassCode}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Invite Students
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Student Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>
          {filteredEnrollments.length} student{filteredEnrollments.length !== 1 ? 's' : ''}
          {searchQuery && ` found`}
        </span>
      </div>

      {/* Student List */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No students found matching your search.' : 'No students enrolled yet.'}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Student
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map((enrollment) => (
            <StudentCard
              key={enrollment.id}
              student={enrollment.student || { id: enrollment.student_id, name: 'Unknown', email: '' }}
              enrollmentDate={enrollment.enrolled_at}
              onRemove={handleRemoveStudent}
            />
          ))}
        </div>
      )}

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStudent={handleAddStudent}
      />

      <InviteStudentDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInviteStudents={handleInviteStudents}
        classCode={classCode}
      />
    </div>
  );
}
