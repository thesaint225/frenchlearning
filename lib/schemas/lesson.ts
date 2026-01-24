import { z } from 'zod';
import { LessonType, ExerciseType } from '@/lib/types';

/**
 * Schema for exercise content within a lesson.
 */
export const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['multiple-choice', 'fill-blank', 'matching', 'translation']),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1)).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  points: z.number().int().positive('Points must be a positive integer'),
  explanation: z.string().optional(),
});

/**
 * Schema for lesson content based on lesson type.
 */
export const lessonContentSchema = z.object({
  videoUrl: z.string().url('Must be a valid URL').optional(),
  audioUrl: z.string().url('Must be a valid URL').optional(),
  exercise: exerciseSchema.optional(),
}).refine(
  (data) => {
    // At least one content type must be provided
    return data.videoUrl || data.audioUrl || data.exercise;
  },
  {
    message: 'At least one content type (videoUrl, audioUrl, or exercise) must be provided',
  }
);

/**
 * Schema for creating a new lesson.
 */
export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  type: z.enum(['video', 'audio', 'exercise']),
  content: lessonContentSchema,
  teacher_id: z.string().uuid('Teacher ID must be a valid UUID'),
}).refine(
  (data) => {
    // Validate content matches lesson type
    if (data.type === 'video' && !data.content.videoUrl) {
      return false;
    }
    if (data.type === 'audio' && !data.content.audioUrl) {
      return false;
    }
    if (data.type === 'exercise' && !data.content.exercise) {
      return false;
    }
    return true;
  },
  {
    message: 'Content must match the selected lesson type',
  }
);

/**
 * Schema for updating an existing lesson.
 * All fields are optional except the lesson ID.
 */
export const updateLessonSchema = z.object({
  id: z.string().uuid('Lesson ID must be a valid UUID'),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  type: z.enum(['video', 'audio', 'exercise']).optional(),
  content: lessonContentSchema.optional(),
}).refine(
  (data) => {
    // If type is provided, validate content matches
    if (data.type && data.content) {
      if (data.type === 'video' && !data.content.videoUrl) {
        return false;
      }
      if (data.type === 'audio' && !data.content.audioUrl) {
        return false;
      }
      if (data.type === 'exercise' && !data.content.exercise) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Content must match the selected lesson type',
  }
);

/**
 * Type inference from schemas.
 */
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type LessonContentInput = z.infer<typeof lessonContentSchema>;
