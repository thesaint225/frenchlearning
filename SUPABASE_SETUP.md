# Supabase Setup Guide

This guide will help you set up Supabase for the Learn French application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Name: `learnfrench` (or your preferred name)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (this is safe to expose in client-side code)
   - **service_role key**: Copy this value (KEEP SECRET - only use server-side)

## Step 3: Set Up Environment Variables

1. In your project root, create a file named `.env.local` (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note:** The `SUPABASE_SERVICE_ROLE_KEY` is optional and only needed for admin operations. Add it only if you need server-side operations that bypass Row Level Security.

## Step 4: Create Database Tables

Use the Supabase Table Editor to create the following tables:

### Lessons Table

1. Go to **Table Editor** in your Supabase dashboard
2. Click **New Table**
3. Name it `lessons`
4. Add the following columns:

| Column Name | Type | Default Value | Nullable | Description |
|------------|------|---------------|----------|-------------|
| id | uuid | `gen_random_uuid()` | No | Primary key |
| title | text | - | No | Lesson title |
| description | text | - | Yes | Lesson description |
| type | text | - | No | Lesson type: 'video', 'audio', or 'exercise' |
| content | jsonb | - | No | Lesson content (videoUrl, audioUrl, or exercise) |
| teacher_id | uuid | - | No | Foreign key to users table |
| created_at | timestamptz | `now()` | No | Creation timestamp |
| updated_at | timestamptz | - | Yes | Update timestamp |
| completion_count | integer | `0` | No | Number of completions |

5. Set `id` as the primary key
6. Click **Save**

**Indexes to create:**
- Index on `teacher_id` for faster queries
- Index on `type` for filtering
- Index on `created_at` for sorting

### Assignments Table

1. Click **New Table**
2. Name it `assignments`
3. Add the following columns:

| Column Name | Type | Default Value | Nullable | Description |
|------------|------|---------------|----------|-------------|
| id | uuid | `gen_random_uuid()` | No | Primary key |
| title | text | - | No | Assignment title |
| description | text | - | Yes | Assignment description |
| class_id | uuid | - | Yes | Foreign key to classes table |
| teacher_id | uuid | - | No | Foreign key to users table |
| lesson_ids | uuid[] | - | No | Array of lesson IDs |
| questions | jsonb | - | Yes | Array of assignment questions (fill-blank, multiple-choice, matching, translation, etc.) |
| due_date | timestamptz | - | No | Due date and time |
| status | text | - | No | Status: 'draft', 'published', or 'closed' |
| max_points | integer | `100` | No | Maximum points |
| allow_late_submissions | boolean | `false` | No | Allow late submissions |
| created_at | timestamptz | `now()` | No | Creation timestamp |
| updated_at | timestamptz | - | Yes | Update timestamp |
| submission_count | integer | `0` | No | Number of submissions |
| completion_rate | numeric | - | Yes | Completion rate percentage |

4. Set `id` as the primary key
5. Click **Save**

**Note:** The `questions` column stores assignment questions as JSONB. Each question object contains:
- `id`: string (unique question identifier)
- `type`: 'multiple-choice' | 'fill-blank' | 'matching' | 'translation' | 'short-answer' | 'essay'
- `question`: string (question text)
- `options`: string[] (optional, for multiple-choice and matching)
- `correctAnswer`: string | string[] | null (correct answer(s))
- `points`: number (point value)
- `explanation`: string (optional explanation)
- `order`: number (question order)

**Indexes to create:**
- Index on `teacher_id` for faster queries
- Index on `class_id` for filtering by class
- Index on `status` for filtering by status
- Index on `due_date` for sorting

## Step 5: Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `lessons`
4. Set it as **Public** (so uploaded files can be accessed)
5. Click **Create bucket**

### Storage Policies (Optional but Recommended)

For better security, you can set up storage policies:

1. Go to **Storage** → **Policies** → `lessons` bucket
2. Create a policy that allows:
   - **INSERT**: Authenticated users can upload files
   - **SELECT**: Public read access (or authenticated users only)
   - **DELETE**: Only the file owner or admin can delete

## Step 6: Verify Setup

1. Make sure your `.env.local` file has the correct values
2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
3. Try creating a lesson in the application
4. Check your Supabase dashboard to verify the data was saved

## Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL" Error

- Make sure `.env.local` exists in your project root
- Verify the variable names are exactly as shown (case-sensitive)
- Restart your development server after adding environment variables

### "Failed to create lesson" Error

- Check that the `lessons` table exists in your Supabase project
- Verify the table structure matches the schema above
- Check the browser console for detailed error messages

### File Upload Issues

- Ensure the `lessons` storage bucket exists
- Verify the bucket is set to **Public** if you want public access
- Check file size limits (default is 100MB in the code)

### Database Connection Issues

- Verify your Supabase project URL is correct
- Check that your project is not paused (free tier projects pause after inactivity)
- Ensure your API keys are correct

## Next Steps

- Set up authentication (if not already done)
- Configure Row Level Security (RLS) policies for data protection
- Set up database backups
- Configure environment-specific settings for production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
