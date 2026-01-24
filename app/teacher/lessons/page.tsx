'use client';

import { useState, useMemo, useEffect } from 'react';
import { LessonCard } from '@/components/teacher/LessonCard';
import { Lesson, LessonType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getLessonsByTeacher } from '@/lib/services/lessons';

type FilterType = LessonType | 'all';

interface FilterButtonConfig {
  value: FilterType;
  label: string;
}

/**
 * Filter button configurations for lesson type filtering.
 */
const filterTypes: FilterButtonConfig[] = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'exercise', label: 'Exercise' },
];

/**
 * Filters lessons based on search query and type filter.
 * 
 * @param lessons - Array of lessons to filter
 * @param searchQuery - Search text to match against title and description
 * @param filterType - Lesson type to filter by, or 'all' for no type filter
 * @returns Filtered array of lessons
 */
const filterLessons = (lessons: Lesson[], searchQuery: string, filterType: FilterType): Lesson[] => {
  return lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || lesson.type === filterType;
    return matchesSearch && matchesType;
  });
};

/**
 * Lessons library page displaying all lessons with search and filter functionality.
 * 
 * @returns The lessons library page component
 */
export const LessonsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual teacher ID from auth context
  const teacherId = '00000000-0000-0000-0000-000000000000';

  // Fetch lessons from database
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getLessonsByTeacher(teacherId);
      
      if (fetchError || !data) {
        setError(fetchError?.message || 'Failed to load lessons');
        setIsLoading(false);
        return;
      }
      
      setLessons(data);
      setIsLoading(false);
    };

    fetchLessons();
  }, [teacherId]);

  const filteredLessons = useMemo(() => {
    return filterLessons(lessons, searchQuery, filterType);
  }, [lessons, searchQuery, filterType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

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
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {filterTypes.map(({ value, label }) => (
            <Button
              key={value}
              variant={filterType === value ? 'default' : 'outline'}
              onClick={() => handleFilterChange(value)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading lessons...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {lessons.length === 0
                  ? 'No lessons yet. Create your first lesson to get started!'
                  : 'No lessons found. Try adjusting your search or filters.'}
              </p>
              {lessons.length === 0 && (
                <Link href="/teacher/lessons/upload" className="mt-4 inline-block">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Lesson
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Default export for Next.js page routing
export default LessonsPage;
