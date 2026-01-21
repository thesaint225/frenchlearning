export type LessonType = 'video' | 'audio' | 'exercise';

export type ExerciseType = 'multiple-choice' | 'fill-blank' | 'matching' | 'translation';

export type AssignmentStatus = 'draft' | 'published' | 'closed';

export type SubmissionStatus = 'pending' | 'graded';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  content: {
    videoUrl?: string;
    audioUrl?: string;
    exercise?: Exercise;
  };
  created_at: string;
  updated_at?: string;
  completion_count?: number;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  progress?: {
    lessons_completed: number;
    total_lessons: number;
    average_score: number;
  };
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  lesson_ids: string[];
  due_date: string;
  status: AssignmentStatus;
  max_points: number;
  created_at: string;
  submission_count?: number;
  completion_rate?: number;
}

export interface Submission {
  id: string;
  student_id: string;
  student?: Student;
  assignment_id: string;
  assignment?: Assignment;
  answers: Record<string, any>;
  score?: number;
  max_score: number;
  feedback?: string;
  status: SubmissionStatus;
  submitted_at: string;
  graded_at?: string;
}

export interface DashboardStats {
  total_students: number;
  active_assignments: number;
  pending_grades: number;
  lessons_uploaded: number;
}
