-- Create lessons table for teachers
-- This table stores lessons (videos, audio, exercises) created by teachers
-- Lessons can be linked to assignments via the lesson_ids array in assignments table

-- Create the lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text NOT NULL,
    content jsonb NOT NULL,
    teacher_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    completion_count integer NOT NULL DEFAULT 0
);

-- Add check constraint for lesson type
ALTER TABLE public.lessons
ADD CONSTRAINT lessons_type_check 
CHECK (type IN ('video', 'audio', 'exercise'));

-- Add foreign key constraint to auth.users
ALTER TABLE public.lessons
ADD CONSTRAINT lessons_teacher_id_fkey 
FOREIGN KEY (teacher_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON public.lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON public.lessons(type);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.lessons IS 'Stores lessons (videos, audio, exercises) created by teachers for use in assignments';

-- Add comments to columns
COMMENT ON COLUMN public.lessons.id IS 'Primary key, unique identifier for the lesson';
COMMENT ON COLUMN public.lessons.title IS 'Lesson title';
COMMENT ON COLUMN public.lessons.description IS 'Optional lesson description';
COMMENT ON COLUMN public.lessons.type IS 'Lesson type: video, audio, or exercise';
COMMENT ON COLUMN public.lessons.content IS 'JSONB field storing lesson content (videoUrl, audioUrl, or exercise data)';
COMMENT ON COLUMN public.lessons.teacher_id IS 'Foreign key to auth.users table, identifies the teacher who created the lesson';
COMMENT ON COLUMN public.lessons.created_at IS 'Timestamp when the lesson was created';
COMMENT ON COLUMN public.lessons.updated_at IS 'Timestamp when the lesson was last updated (automatically updated by trigger)';
COMMENT ON COLUMN public.lessons.completion_count IS 'Number of times this lesson has been completed by students';
