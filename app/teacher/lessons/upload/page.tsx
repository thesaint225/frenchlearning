'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LessonType, ExerciseType } from '@/lib/types';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createLesson } from '@/lib/services/lessons';
import { uploadVideoFile, uploadAudioFile, isValidExternalUrl } from '@/lib/services/storage';

export default function UploadLessonPage() {
  const router = useRouter();
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple-choice');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [points, setPoints] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual teacher ID from auth context
  const teacherId = '00000000-0000-0000-0000-000000000000';

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(''); // Clear URL when file is selected
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form based on lesson type
      if (!title.trim()) {
        setError('Title is required');
        setIsLoading(false);
        return;
      }

      let content: { videoUrl?: string; audioUrl?: string; exercise?: any } = {};

      if (lessonType === 'video') {
        if (videoFile) {
          // Upload video file to Supabase Storage
          // We'll need to create the lesson first to get an ID, then upload
          // For now, we'll create a temporary ID
          const tempId = crypto.randomUUID();
          const { data: uploadedUrl, error: uploadError } = await uploadVideoFile(videoFile, tempId);
          
          if (uploadError || !uploadedUrl) {
            setError(uploadError?.message || 'Failed to upload video file');
            setIsLoading(false);
            return;
          }
          content.videoUrl = uploadedUrl;
        } else if (videoUrl.trim()) {
          // Validate external URL
          if (!isValidExternalUrl(videoUrl)) {
            setError('Please enter a valid video URL (YouTube, Vimeo, or direct video file)');
            setIsLoading(false);
            return;
          }
          content.videoUrl = videoUrl;
        } else {
          setError('Please provide either a video file or a video URL');
          setIsLoading(false);
          return;
        }
      } else if (lessonType === 'audio') {
        if (!audioFile) {
          setError('Please upload an audio file');
          setIsLoading(false);
          return;
        }
        // Upload audio file to Supabase Storage
        const tempId = crypto.randomUUID();
        const { data: uploadedUrl, error: uploadError } = await uploadAudioFile(audioFile, tempId);
        
        if (uploadError || !uploadedUrl) {
          setError(uploadError?.message || 'Failed to upload audio file');
          setIsLoading(false);
          return;
        }
        content.audioUrl = uploadedUrl;
      } else if (lessonType === 'exercise') {
        if (!question.trim()) {
          setError('Question is required');
          setIsLoading(false);
          return;
        }

        if (exerciseType === 'multiple-choice') {
          const validOptions = options.filter(opt => opt.trim());
          if (validOptions.length < 2) {
            setError('At least 2 answer options are required');
            setIsLoading(false);
            return;
          }
          if (!correctAnswer) {
            setError('Please select the correct answer');
            setIsLoading(false);
            return;
          }
          content.exercise = {
            type: exerciseType,
            question,
            options: validOptions,
            correctAnswer: validOptions[Number(correctAnswer)],
            points,
          };
        } else {
          if (!correctAnswer.trim()) {
            setError('Correct answer is required');
            setIsLoading(false);
            return;
          }
          content.exercise = {
            type: exerciseType,
            question,
            correctAnswer,
            points,
          };
        }
      }

      // Create lesson in database
      const { data: lesson, error: createError } = await createLesson({
        title: title.trim(),
        description: description.trim() || undefined,
        type: lessonType,
        content,
        teacher_id: teacherId,
      });

      if (createError || !lesson) {
        setError(createError?.message || 'Failed to create lesson');
        setIsLoading(false);
        return;
      }

      // If we uploaded files with a temp ID, we should re-upload with the actual lesson ID
      // For now, the temp ID approach works but could be improved
      
      alert('Lesson created successfully!');
      router.push('/teacher/lessons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Upload New Lesson</h2>
          <p className="text-muted-foreground">Create a new lesson for your students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the lesson title and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to French Greetings"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the lesson..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Lesson Type *</Label>
              <Select value={lessonType} onValueChange={(value) => setLessonType(value as LessonType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="exercise">Interactive Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Add your lesson content based on the selected type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={lessonType} onValueChange={(value) => setLessonType(value as LessonType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL or YouTube/Vimeo Link</Label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoFile(null); // Clear file when URL is entered
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    disabled={!!videoFile}
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Or upload a video file</p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                    id="video-file-input"
                    disabled={!!videoUrl}
                  />
                  <Label htmlFor="video-file-input">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                  </Label>
                  {videoFile && (
                    <p className="mt-2 text-sm text-primary">{videoFile.name}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload audio file (MP3, WAV, OGG)</p>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    id="audio-file-input"
                  />
                  <Label htmlFor="audio-file-input">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                  </Label>
                  {audioFile && (
                    <p className="mt-2 text-sm text-primary">{audioFile.name}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="exercise" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="exerciseType">Exercise Type</Label>
                  <Select value={exerciseType} onValueChange={(value) => setExerciseType(value as ExerciseType)}>
                    <SelectTrigger id="exerciseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="translation">Translation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question..."
                    rows={3}
                    required
                  />
                </div>
                {exerciseType === 'multiple-choice' && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant={correctAnswer === String(index) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCorrectAnswer(String(index))}
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {(exerciseType === 'fill-blank' || exerciseType === 'translation') && (
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Input
                      id="correctAnswer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Enter the correct answer..."
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/teacher/lessons">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Lesson
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
