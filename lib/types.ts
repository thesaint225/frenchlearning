export type LessonType = 'video' | 'audio' | 'exercise';

export type ExerciseType = 'multiple-choice' | 'fill-blank' | 'matching' | 'translation';

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'matching' | 'translation' | 'short-answer' | 'essay';

export type AssignmentStatus = 'draft' | 'published' | 'closed';

export type SubmissionStatus = 'pending' | 'graded';

export type TestStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'closed';

export type TestAttemptStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded';

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
  class_id?: string | null;
  lesson_ids: string[];
  questions?: TestQuestion[];
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

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string | string[] | null; // null for manual grading
  points: number;
  explanation?: string;
  order: number;
}

export interface Test {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  questions: TestQuestion[];
  time_limit_minutes: number;
  start_date: string;
  end_date: string;
  passing_score?: number; // Percentage
  randomize_questions: boolean;
  status: TestStatus;
  max_points: number;
  created_at: string;
  updated_at?: string;
  attempt_count?: number;
  average_score?: number;
  completion_rate?: number;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  test?: Test;
  student_id: string;
  student?: Student;
  started_at: string;
  submitted_at?: string;
  answers: Record<string, any>; // question_id -> answer
  score?: number;
  max_score: number;
  status: TestAttemptStatus;
  graded_at?: string;
  feedback?: string;
}

export interface DashboardStats {
  total_students: number;
  active_assignments: number;
  pending_grades: number;
  lessons_uploaded: number;
  active_tests?: number;
}

export type EnrollmentStatus = 'active' | 'inactive';

export type EnrollmentMethod = 'code' | 'email_invite' | 'manual';

export interface Class {
  id: string;
  teacher_id: string;
  name: string;
  description?: string;
  class_code: string;
  settings?: {
    invitation_method?: 'code' | 'email' | 'both';
    allow_self_enrollment?: boolean;
  };
  created_at: string;
  updated_at?: string;
  student_count?: number;
  active_assignments_count?: number;
}

export interface Enrollment {
  id: string;
  class_id: string;
  student_id: string;
  student?: Student;
  enrolled_at: string;
  status: EnrollmentStatus;
  enrollment_method: EnrollmentMethod;
}

export interface Announcement {
  id: string;
  class_id: string;
  title: string;
  content: string;
  created_by: string;
  is_pinned: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ClassAnalytics {
  class_id: string;
  completion_rates: {
    lessons: number;
    assignments: number;
    tests: number;
    on_time_submissions: number;
  };
  average_scores: {
    overall: number;
    assignments: number;
    tests: number;
  };
  engagement_metrics: {
    daily_active_users: number;
    weekly_active_users: number;
    average_session_length: number;
    login_frequency: number;
  };
  student_progress: Array<{
    student_id: string;
    student?: Student;
    lessons_completed: number;
    total_lessons: number;
    assignment_completion_rate: number;
    average_score: number;
  }>;
  content_performance: Array<{
    lesson_id: string;
    lesson_title: string;
    completion_count: number;
    average_score: number;
  }>;
}
