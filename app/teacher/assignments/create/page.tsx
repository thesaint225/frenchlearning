'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { mockLessons } from '@/lib/mock-data';
import { AssignmentStatus } from '@/lib/types';
import { ArrowLeft, Save, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [allowLate, setAllowLate] = useState(false);
  const [status, setStatus] = useState<AssignmentStatus>('draft');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = mockLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    console.log('Assignment created:', {
      title,
      description,
      lesson_ids: selectedLessons,
      due_date: dueDate,
      max_points: maxPoints,
      status,
    });
    router.push('/teacher/assignments');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/assignments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Create Assignment</h2>
          <p className="text-muted-foreground">Create a new homework assignment for your students</p>
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
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Detailed instructions for students..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Lessons</CardTitle>
            <CardDescription>Choose which lessons to include in this assignment</CardDescription>
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
              {filteredLessons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No lessons found</p>
              ) : (
                filteredLessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
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
                    <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                  </div>
                ))
              )}
            </div>
            {selectedLessons.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedLessons.length} lesson{selectedLessons.length !== 1 ? 's' : ''} selected
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
              <Label htmlFor="maxPoints">Maximum Points *</Label>
              <Input
                id="maxPoints"
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
                min="1"
                required
              />
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

        <div className="flex justify-end gap-4">
          <Link href="/teacher/assignments">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">
            <Save className="mr-2 h-4 w-4" />
            {status === 'published' ? 'Publish Assignment' : 'Save as Draft'}
          </Button>
        </div>
      </form>
    </div>
  );
}
