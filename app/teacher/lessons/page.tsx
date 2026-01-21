'use client';

import { useState, useMemo } from 'react';
import { LessonCard } from '@/components/teacher/LessonCard';
import { mockLessons } from '@/lib/mock-data';
import { LessonType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<LessonType | 'all'>('all');

  const filteredLessons = useMemo(() => {
    return mockLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || lesson.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Lessons Library</h2>
          <p className="text-muted-foreground">Manage and organize your lesson content</p>
        </div>
        <Link href="/teacher/lessons/upload">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Upload New Lesson
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterType === 'video' ? 'default' : 'outline'}
            onClick={() => setFilterType('video')}
            size="sm"
          >
            Video
          </Button>
          <Button
            variant={filterType === 'audio' ? 'default' : 'outline'}
            onClick={() => setFilterType('audio')}
            size="sm"
          >
            Audio
          </Button>
          <Button
            variant={filterType === 'exercise' ? 'default' : 'outline'}
            onClick={() => setFilterType('exercise')}
            size="sm"
          >
            Exercise
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lessons found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
