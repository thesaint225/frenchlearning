/**
 * Script to insert dummy assignment data into Supabase
 * Run with: npx tsx scripts/insert-dummy-assignments.ts
 * Or: npx ts-node scripts/insert-dummy-assignments.ts
 *
 * Make sure .env.local is in the project root with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local manually
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};

    envFile.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          envVars[key.trim()] = value.trim();
        }
      }
    });

    Object.assign(process.env, envVars);
  } catch (error) {
    console.warn('Could not load .env.local, using process.env directly');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TEACHER_ID = '5be95487-e1e3-4857-a260-a21b3ef0960a';
const STUDENT_ID = '00000000-0000-0000-0000-000000000001';

// Helper to generate dates
const getDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Helper to generate class code
const generateClassCode = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FR101-${year}-${random}`;
};

// Sample assignments data (class_id will be set after class creation)
const createAssignments = (classId: string | null) => [
  {
    title: 'Week 1: French Greetings Quiz',
    description:
      'Test your knowledge of basic French greetings and common phrases',
    teacher_id: TEACHER_ID,
    class_id: classId,
    lesson_ids: [],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: "What is 'hello' in French?",
        options: ['Bonjour', 'Au revoir', 'Merci', "S'il vous plaît"],
        correctAnswer: 'Bonjour',
        points: 10,
        explanation: 'Bonjour is the standard greeting used throughout the day',
        order: 1,
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: "How do you say 'goodbye' in French?",
        options: ['Bonjour', 'Au revoir', 'Bonsoir', 'Bonne nuit'],
        correctAnswer: 'Au revoir',
        points: 10,
        explanation: 'Au revoir means goodbye or see you later',
        order: 2,
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: "What does 'Comment allez-vous?' mean?",
        options: [
          'How are you?',
          'What is your name?',
          'Where are you?',
          'Thank you',
        ],
        correctAnswer: 'How are you?',
        points: 10,
        explanation:
          'Comment allez-vous? is the formal way to ask how someone is doing',
        order: 3,
      },
    ],
    due_date: getDate(7),
    status: 'published',
    max_points: 30,
    allow_late_submissions: false,
    submission_count: 5,
    completion_rate: 75.5,
  },
  {
    title: 'Vocabulary Practice: Numbers',
    description: 'Practice writing French numbers from 1 to 100',
    teacher_id: TEACHER_ID,
    class_id: null, // Draft assignments can have null class_id
    lesson_ids: [],
    questions: [
      {
        id: 'q1',
        type: 'fill-blank',
        question: 'The number 5 in French is _____',
        correctAnswer: 'cinq',
        points: 5,
        explanation: 'Cinq is the French word for five',
        order: 1,
      },
      {
        id: 'q2',
        type: 'fill-blank',
        question: 'The number 10 in French is _____',
        correctAnswer: 'dix',
        points: 5,
        explanation: 'Dix is the French word for ten',
        order: 2,
      },
      {
        id: 'q3',
        type: 'fill-blank',
        question: 'The number 20 in French is _____',
        correctAnswer: 'vingt',
        points: 5,
        explanation: 'Vingt is the French word for twenty',
        order: 3,
      },
      {
        id: 'q4',
        type: 'fill-blank',
        question: 'The number 50 in French is _____',
        correctAnswer: 'cinquante',
        points: 5,
        explanation: 'Cinquante is the French word for fifty',
        order: 4,
      },
      {
        id: 'q5',
        type: 'fill-blank',
        question: 'The number 100 in French is _____',
        correctAnswer: 'cent',
        points: 5,
        explanation: 'Cent is the French word for one hundred',
        order: 5,
      },
    ],
    due_date: getDate(14),
    status: 'draft',
    max_points: 25,
    allow_late_submissions: true,
    submission_count: 0,
    completion_rate: null,
  },
  {
    title: 'French Grammar Review',
    description:
      'Comprehensive review of French grammar rules including articles, verb conjugations, and sentence structure',
    teacher_id: TEACHER_ID,
    class_id: classId,
    lesson_ids: [],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: "Which article is used with 'livre' (book)?",
        options: ['le', 'la', 'les', 'un'],
        correctAnswer: 'le',
        points: 10,
        explanation: 'Le is used with masculine nouns like livre',
        order: 1,
      },
      {
        id: 'q2',
        type: 'fill-blank',
        question: 'Complete: Je _____ français. (I speak French)',
        correctAnswer: 'parle',
        points: 15,
        explanation: 'Parle is the first person singular form of parler',
        order: 2,
      },
      {
        id: 'q3',
        type: 'translation',
        question: 'Translate to French: "I am a student"',
        correctAnswer: 'Je suis étudiant',
        points: 15,
        explanation: 'Je suis étudiant means I am a student',
        order: 3,
      },
    ],
    due_date: getDate(3),
    status: 'published',
    max_points: 40,
    allow_late_submissions: false,
    submission_count: 8,
    completion_rate: 62.3,
  },
  {
    title: 'Introduction to French Culture',
    description:
      'Learn about French customs, traditions, and cultural practices',
    teacher_id: TEACHER_ID,
    class_id: classId,
    lesson_ids: [],
    questions: [
      {
        id: 'q1',
        type: 'short-answer',
        question:
          'What is the traditional French greeting when meeting someone?',
        correctAnswer: 'La bise',
        points: 10,
        explanation: 'La bise refers to the cheek-kissing greeting',
        order: 1,
      },
      {
        id: 'q2',
        type: 'short-answer',
        question: 'Name one famous French holiday celebrated in July',
        correctAnswer: 'Bastille Day',
        points: 10,
        explanation: "Bastille Day (July 14) is France's national holiday",
        order: 2,
      },
      {
        id: 'q3',
        type: 'short-answer',
        question: 'What is the traditional French breakfast?',
        correctAnswer: 'Croissant and coffee',
        points: 10,
        explanation: 'A typical French breakfast includes pastries and coffee',
        order: 3,
      },
      {
        id: 'q4',
        type: 'short-answer',
        question: 'What is the French word for "cheese"?',
        correctAnswer: 'Fromage',
        points: 10,
        explanation: 'Fromage is the French word for cheese',
        order: 4,
      },
    ],
    due_date: getDate(-5), // 5 days ago
    status: 'closed',
    max_points: 40,
    allow_late_submissions: false,
    submission_count: 12,
    completion_rate: 90.0,
  },
  {
    title: 'French-English Vocabulary Matching',
    description: 'Match French words with their English translations',
    teacher_id: TEACHER_ID,
    class_id: classId,
    lesson_ids: [],
    questions: [
      {
        id: 'q1',
        type: 'matching',
        question: 'Match the French words with their English translations',
        options: [
          'Chat - Cat',
          'Chien - Dog',
          'Maison - House',
          'Voiture - Car',
          'Livre - Book',
        ],
        correctAnswer: [
          'Chat - Cat',
          'Chien - Dog',
          'Maison - House',
          'Voiture - Car',
          'Livre - Book',
        ],
        points: 25,
        explanation: 'These are basic French vocabulary words',
        order: 1,
      },
    ],
    due_date: getDate(10),
    status: 'published',
    max_points: 25,
    allow_late_submissions: true,
    submission_count: 3,
    completion_rate: 45.0,
  },
  {
    title: 'Watch Video: French Pronunciation',
    description:
      'Watch the video lesson on French pronunciation and complete the reflection',
    teacher_id: TEACHER_ID,
    class_id: null, // Draft assignments can have null class_id
    lesson_ids: [], // Would normally contain lesson UUIDs
    questions: null,
    due_date: getDate(21),
    status: 'draft',
    max_points: 100,
    allow_late_submissions: false,
    submission_count: 0,
    completion_rate: null,
  },
];

async function createOrGetClass() {
  console.log('Creating or finding class...\n');

  // Check if class already exists for this teacher
  const { data: existingClasses, error: fetchError } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', TEACHER_ID)
    .limit(1);

  if (fetchError) {
    console.error('Error checking for existing class:', fetchError.message);
    return null;
  }

  if (existingClasses && existingClasses.length > 0) {
    console.log(
      `✓ Using existing class: "${existingClasses[0].name}" (ID: ${existingClasses[0].id})\n`,
    );
    return existingClasses[0].id;
  }

  // Create new class
  const classData = {
    teacher_id: TEACHER_ID,
    name: 'French 101 - Beginner',
    description: 'Introduction to French language and culture',
    class_code: generateClassCode(),
    settings: {
      invitation_method: 'both',
      allow_self_enrollment: true,
    },
  };

  const { data: newClass, error: createError } = await supabase
    .from('classes')
    .insert(classData)
    .select()
    .single();

  if (createError || !newClass) {
    console.error('Error creating class:', createError?.message);
    return null;
  }

  console.log(
    `✓ Created class: "${newClass.name}" (ID: ${newClass.id}, Code: ${newClass.class_code})\n`,
  );
  return newClass.id;
}

async function createOrGetEnrollment(classId: string) {
  console.log('Creating or finding student enrollment...\n');

  // Check if enrollment already exists
  const { data: existingEnrollment, error: fetchError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('class_id', classId)
    .eq('student_id', STUDENT_ID)
    .eq('status', 'active')
    .limit(1);

  if (fetchError) {
    console.error(
      'Error checking for existing enrollment:',
      fetchError.message,
    );
    return false;
  }

  if (existingEnrollment && existingEnrollment.length > 0) {
    console.log(
      `✓ Student already enrolled in class (Enrollment ID: ${existingEnrollment[0].id})\n`,
    );
    return true;
  }

  // Create new enrollment
  const enrollmentData = {
    class_id: classId,
    student_id: STUDENT_ID,
    status: 'active',
    enrollment_method: 'manual',
  };

  const { data: newEnrollment, error: createError } = await supabase
    .from('enrollments')
    .insert(enrollmentData)
    .select()
    .single();

  if (createError || !newEnrollment) {
    console.error('Error creating enrollment:', createError?.message);
    return false;
  }

  console.log(
    `✓ Created enrollment for student (Enrollment ID: ${newEnrollment.id})\n`,
  );
  return true;
}

async function insertAssignments(classId: string | null) {
  console.log('Starting to insert dummy assignments...\n');

  const assignments = createAssignments(classId);

  for (let i = 0; i < assignments.length; i++) {
    const assignment = assignments[i];
    console.log(
      `Inserting assignment ${i + 1}/${assignments.length}: "${assignment.title}"`,
    );

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignment)
        .select();

      if (error) {
        console.error(
          `Error inserting assignment "${assignment.title}":`,
          error.message,
        );
        continue;
      }

      console.log(
        `✓ Successfully inserted: "${assignment.title}" (ID: ${data[0]?.id})\n`,
      );
    } catch (err) {
      console.error(
        `Unexpected error inserting assignment "${assignment.title}":`,
        err,
      );
    }
  }

  console.log('Finished inserting assignments!');

  // Verify by fetching assignments
  console.log('\nVerifying inserted assignments...');
  const { data: fetchedAssignments, error: fetchError } = await supabase
    .from('assignments')
    .select('*')
    .eq('teacher_id', TEACHER_ID)
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching assignments:', fetchError.message);
  } else {
    console.log(
      `\n✓ Successfully verified ${fetchedAssignments?.length || 0} assignments in database`,
    );
    console.log('\nAssignments by status:');
    const statusCounts = fetchedAssignments?.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    console.log(statusCounts);

    // Show assignments with class_id
    const withClass =
      fetchedAssignments?.filter((a) => a.class_id !== null).length || 0;
    const withoutClass =
      fetchedAssignments?.filter((a) => a.class_id === null).length || 0;
    console.log(`\nAssignments with class_id: ${withClass}`);
    console.log(`Assignments without class_id (drafts): ${withoutClass}`);
  }
}

async function verifyStudentCanSeeAssignments(classId: string) {
  console.log('\nVerifying student can see assignments...');

  const { data: studentAssignments, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('class_id', classId)
    .eq('status', 'published')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error verifying student assignments:', error.message);
    return;
  }

  const now = new Date().toISOString();
  const visibleAssignments =
    studentAssignments?.filter((a) => {
      const dueDate = new Date(a.due_date).toISOString();
      return dueDate >= now || a.allow_late_submissions;
    }) || [];

  console.log(
    `✓ Student can see ${visibleAssignments.length} published assignments`,
  );
  if (visibleAssignments.length > 0) {
    console.log('Visible assignments:');
    visibleAssignments.forEach((a) => {
      console.log(
        `  - ${a.title} (Due: ${new Date(a.due_date).toLocaleDateString()})`,
      );
    });
  }
}

async function main() {
  // Step 1: Create or get class
  const classId = await createOrGetClass();
  if (!classId) {
    console.error('Failed to create or get class. Exiting.');
    process.exit(1);
  }

  // Step 2: Create or get enrollment
  const enrollmentSuccess = await createOrGetEnrollment(classId);
  if (!enrollmentSuccess) {
    console.warn(
      'Warning: Failed to create enrollment. Students may not see assignments.',
    );
  }

  // Step 3: Insert assignments
  await insertAssignments(classId);

  // Step 4: Verify student visibility
  await verifyStudentCanSeeAssignments(classId);
}

// Run the script
main()
  .then(() => {
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
