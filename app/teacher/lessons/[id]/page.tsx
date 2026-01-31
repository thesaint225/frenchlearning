'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLessonById } from '@/lib/services/lessons';
import { Lesson } from '@/lib/types';
import { ExerciseDisplay } from '@/components/teacher/ExerciseDisplay';
import { ArrowLeft, Edit, Video, Music, FileQuestion, Users, Calendar } from 'lucide-react';
import { DetailSkeleton } from '@/components/skeletons/DetailSkeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Extracts video ID from YouTube URL and converts to embed format.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 * 
 * @param url - YouTube URL in any format
 * @returns Embed URL or null if not a YouTube URL
 */
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's a YouTube URL
    if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
      return null;
    }
    
    let videoId: string | null = null;
    
    // Handle youtu.be/VIDEO_ID format
    if (hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1).split('?')[0];
    }
    // Handle youtube.com/watch?v=VIDEO_ID format
    else if (urlObj.pathname.includes('/watch')) {
      videoId = urlObj.searchParams.get('v');
    }
    // Handle youtube.com/embed/VIDEO_ID format (already embed)
    else if (urlObj.pathname.includes('/embed/')) {
      videoId = urlObj.pathname.split('/embed/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts video ID from Vimeo URL and converts to embed format.
 * 
 * @param url - Vimeo URL
 * @returns Embed URL or null if not a Vimeo URL
 */
function getVimeoEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (!hostname.includes('vimeo.com')) {
      return null;
    }
    
    // Extract video ID from pathname (e.g., /123456789)
    const videoId = urlObj.pathname.split('/').filter(Boolean)[0];
    
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Maps lesson types to their corresponding icon components.
 */
const typeIcons = {
  video: Video,
  audio: Music,
  exercise: FileQuestion,
} as const;

/**
 * Maps lesson types to their corresponding Tailwind CSS color classes.
 */
const typeColors = {
  video: 'bg-blue-100 text-blue-700',
  audio: 'bg-purple-100 text-purple-700',
  exercise: 'bg-orange-100 text-orange-700',
} as const;

/**
 * Lesson detail page displaying full lesson information and content.
 * 
 * @returns The lesson detail page component
 */
export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.id as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getLessonById(lessonId);
      
      if (fetchError || !data) {
        setError(fetchError?.message || 'Failed to load lesson');
        setIsLoading(false);
        return;
      }
      
      setLesson(data);
      setIsLoading(false);
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error || 'Lesson not found'}</p>
        <Link href="/teacher/lessons">
          <Button>Back to Lessons</Button>
        </Link>
      </div>
    );
  }

  const Icon = typeIcons[lesson.type];
  const typeColor = typeColors[lesson.type];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-[#1f1f1f]">{lesson.title}</h2>
            <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', typeColor)}>
              <Icon className="w-3 h-3" />
              {lesson.type}
            </div>
          </div>
          {lesson.description && (
            <p className="text-muted-foreground">{lesson.description}</p>
          )}
        </div>
        <Link href={`/teacher/lessons/${lesson.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{lesson.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(lesson.created_at), 'MMM d, yyyy')}
              </p>
            </div>
            {lesson.updated_at && (
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(lesson.updated_at), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Completions</p>
              <p className="text-2xl font-bold">{lesson.completion_count || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <CardDescription>View and interact with the lesson content</CardDescription>
        </CardHeader>
        <CardContent>
          {lesson.type === 'video' && lesson.content.videoUrl && (() => {
            const videoUrl = lesson.content.videoUrl;
            const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
            const vimeoEmbedUrl = getVimeoEmbedUrl(videoUrl);
            
            // Render YouTube embed
            if (youtubeEmbedUrl) {
              return (
                <div className="space-y-4">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={youtubeEmbedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                </div>
              );
            }
            
            // Render Vimeo embed
            if (vimeoEmbedUrl) {
              return (
                <div className="space-y-4">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={vimeoEmbedUrl}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                </div>
              );
            }
            
            // Render direct video file
            return (
              <div className="space-y-4">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            );
          })()}

          {lesson.type === 'audio' && lesson.content.audioUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <audio
                  src={lesson.content.audioUrl}
                  controls
                  className="w-full max-w-md"
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </div>
          )}

          {lesson.type === 'exercise' && lesson.content.exercise && (
            <ExerciseDisplay exercise={lesson.content.exercise} />
          )}

          {lesson.type === 'video' && !lesson.content.videoUrl && (
            <p className="text-muted-foreground text-center py-8">No video URL provided</p>
          )}

          {lesson.type === 'audio' && !lesson.content.audioUrl && (
            <p className="text-muted-foreground text-center py-8">No audio URL provided</p>
          )}

          {lesson.type === 'exercise' && !lesson.content.exercise && (
            <p className="text-muted-foreground text-center py-8">No exercise content provided</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

