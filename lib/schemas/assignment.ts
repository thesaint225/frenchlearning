import { z } from 'zod';
import { AssignmentStatus } from '@/lib/types';

/**
 * Schema for assignment questions (reuses TestQuestion structure).
 */
export const assignmentQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'fill-blank', 'matching', 'translation', 'short-answer', 'essay']),
  question: z.string().min(1, 'Question text is required'),
  options: z.array(z.string().min(1)).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string()), z.null()]),
  points: z.number().int().positive('Points must be a positive integer'),
  explanation: z.string().optional(),
  order: z.number().int().positive('Order must be a positive integer'),
});

/**
 * Schema for creating a new assignment.
 */
export const createAssignmentSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    class_id: z.string().uuid('Class ID must be a valid UUID').nullable(),
    teacher_id: z.string().uuid('Teacher ID must be a valid UUID'),
    lesson_ids: z.array(z.string().uuid('Lesson ID must be a valid UUID')).default([]),
    questions: z.array(assignmentQuestionSchema).optional(),
    due_date: z.string().datetime('Due date must be a valid ISO datetime string'),
    status: z.enum(['draft', 'published', 'closed']),
    max_points: z.number().int().positive('Max points must be a positive integer').default(100),
    allow_late_submissions: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // At least one of questions or lesson_ids must be provided
      const hasQuestions = data.questions && data.questions.length > 0;
      const hasLessons = data.lesson_ids && data.lesson_ids.length > 0;
      return hasQuestions || hasLessons;
    },
    {
      message: 'At least one question or one lesson must be selected',
      path: ['lesson_ids'], // This will show error on lesson_ids field
    }
  );

/**
 * Schema for updating an existing assignment.
 * All fields are optional except the assignment ID.
 */
export const updateAssignmentSchema = z
  .object({
    id: z.string().uuid('Assignment ID must be a valid UUID'),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    class_id: z.string().uuid().nullable().optional(),
    lesson_ids: z.array(z.string().uuid()).optional(),
    questions: z.array(assignmentQuestionSchema).optional(),
    due_date: z.string().datetime().optional(),
    status: z.enum(['draft', 'published', 'closed']).optional(),
    max_points: z.number().int().positive().optional(),
    allow_late_submissions: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If both are provided, at least one must have content
      // If only one is being updated, the other should remain unchanged
      // This refinement only applies when both are explicitly provided
      if (data.lesson_ids !== undefined && data.questions !== undefined) {
        const hasQuestions = data.questions.length > 0;
        const hasLessons = data.lesson_ids.length > 0;
        return hasQuestions || hasLessons;
      }
      return true; // If only one is being updated, validation passes
    },
    {
      message: 'At least one question or one lesson must be selected',
      path: ['lesson_ids'],
    }
  );

/**
 * Schema for validating assignment status transitions.
 */
export const assignmentStatusSchema = z.enum(['draft', 'published', 'closed']);

/**
 * Type inference from schemas.
 */
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
