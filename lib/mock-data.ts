import { Lesson, Assignment, Submission, Student, DashboardStats, Test, TestAttempt, TestQuestion, Class, Enrollment, Announcement, ClassAnalytics } from './types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Emma Dubois', email: 'emma@example.com', progress: { lessons_completed: 12, total_lessons: 20, average_score: 85 } },
  { id: '2', name: 'Lucas Martin', email: 'lucas@example.com', progress: { lessons_completed: 15, total_lessons: 20, average_score: 92 } },
  { id: '3', name: 'Sophie Bernard', email: 'sophie@example.com', progress: { lessons_completed: 8, total_lessons: 20, average_score: 78 } },
  { id: '4', name: 'Thomas Leroy', email: 'thomas@example.com', progress: { lessons_completed: 18, total_lessons: 20, average_score: 88 } },
  { id: '5', name: 'Léa Moreau', email: 'lea@example.com', progress: { lessons_completed: 10, total_lessons: 20, average_score: 80 } },
  { id: '6', name: 'Hugo Petit', email: 'hugo@example.com', progress: { lessons_completed: 14, total_lessons: 20, average_score: 90 } },
  { id: '7', name: 'Chloé Roux', email: 'chloe@example.com', progress: { lessons_completed: 11, total_lessons: 20, average_score: 82 } },
  { id: '8', name: 'Maxime Simon', email: 'maxime@example.com', progress: { lessons_completed: 16, total_lessons: 20, average_score: 87 } },
  { id: '9', name: 'Camille Michel', email: 'camille@example.com', progress: { lessons_completed: 9, total_lessons: 20, average_score: 75 } },
  { id: '10', name: 'Antoine Garcia', email: 'antoine@example.com', progress: { lessons_completed: 13, total_lessons: 20, average_score: 83 } },
  { id: '11', name: 'Julie David', email: 'julie@example.com', progress: { lessons_completed: 17, total_lessons: 20, average_score: 91 } },
  { id: '12', name: 'Pierre Blanc', email: 'pierre@example.com', progress: { lessons_completed: 7, total_lessons: 20, average_score: 70 } },
  { id: '13', name: 'Marie Laurent', email: 'marie@example.com', progress: { lessons_completed: 19, total_lessons: 20, average_score: 95 } },
  { id: '14', name: 'Nicolas Girard', email: 'nicolas@example.com', progress: { lessons_completed: 6, total_lessons: 20, average_score: 68 } },
  { id: '15', name: 'Isabelle Bonnet', email: 'isabelle@example.com', progress: { lessons_completed: 20, total_lessons: 20, average_score: 93 } },
];

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to French Greetings',
    description: 'Learn basic greetings and introductions',
    type: 'video',
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    created_at: '2024-01-15T10:00:00Z',
    completion_count: 12,
  },
  {
    id: '2',
    title: 'Pronunciation: Vowels',
    description: 'Master French vowel sounds',
    type: 'audio',
    content: {
      audioUrl: '/audio/vowels.mp3',
    },
    created_at: '2024-01-16T10:00:00Z',
    completion_count: 10,
  },
  {
    id: '3',
    title: 'Basic Vocabulary Quiz',
    description: 'Test your knowledge of common words',
    type: 'exercise',
    content: {
      exercise: {
        id: 'ex1',
        type: 'multiple-choice',
        question: 'What does "Bonjour" mean?',
        options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
        correctAnswer: 'Hello',
        points: 10,
        explanation: 'Bonjour is the standard French greeting meaning "Hello" or "Good day".',
      },
    },
    created_at: '2024-01-17T10:00:00Z',
    completion_count: 15,
  },
  {
    id: '4',
    title: 'Numbers 1-20',
    description: 'Learn to count in French',
    type: 'video',
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    created_at: '2024-01-18T10:00:00Z',
    completion_count: 11,
  },
  {
    id: '5',
    title: 'Listening Comprehension: Restaurant',
    description: 'Practice understanding restaurant conversations',
    type: 'audio',
    content: {
      audioUrl: '/audio/restaurant.mp3',
    },
    created_at: '2024-01-19T10:00:00Z',
    completion_count: 9,
  },
  {
    id: '6',
    title: 'Fill in the Blank: Articles',
    description: 'Practice using definite and indefinite articles',
    type: 'exercise',
    content: {
      exercise: {
        id: 'ex2',
        type: 'fill-blank',
        question: 'Complete: Je mange ___ pomme.',
        correctAnswer: 'une',
        points: 15,
        explanation: 'Une is the indefinite article for feminine singular nouns.',
      },
    },
    created_at: '2024-01-20T10:00:00Z',
    completion_count: 13,
  },
  {
    id: '7',
    title: 'Present Tense Verbs',
    description: 'Learn regular -er verbs',
    type: 'video',
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    created_at: '2024-01-21T10:00:00Z',
    completion_count: 14,
  },
  {
    id: '8',
    title: 'Matching: Colors',
    description: 'Match French color words with English',
    type: 'exercise',
    content: {
      exercise: {
        id: 'ex3',
        type: 'matching',
        question: 'Match the colors',
        options: ['rouge', 'bleu', 'vert', 'jaune'],
        correctAnswer: ['red', 'blue', 'green', 'yellow'],
        points: 20,
      },
    },
    created_at: '2024-01-22T10:00:00Z',
    completion_count: 16,
  },
  {
    id: '9',
    title: 'Pronunciation: Consonants',
    description: 'Master French consonant sounds',
    type: 'audio',
    content: {
      audioUrl: '/audio/consonants.mp3',
    },
    created_at: '2024-01-23T10:00:00Z',
    completion_count: 8,
  },
  {
    id: '10',
    title: 'Translation Exercise: Sentences',
    description: 'Translate simple sentences',
    type: 'exercise',
    content: {
      exercise: {
        id: 'ex4',
        type: 'translation',
        question: 'Translate: "I am a student."',
        correctAnswer: 'Je suis étudiant.',
        points: 25,
      },
    },
    created_at: '2024-01-24T10:00:00Z',
    completion_count: 12,
  },
  {
    id: '11',
    title: 'Food Vocabulary',
    description: 'Learn words for common foods',
    type: 'video',
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    created_at: '2024-01-25T10:00:00Z',
    completion_count: 17,
  },
  {
    id: '12',
    title: 'Daily Conversations',
    description: 'Practice everyday French phrases',
    type: 'audio',
    content: {
      audioUrl: '/audio/daily-conversations.mp3',
    },
    created_at: '2024-01-26T10:00:00Z',
    completion_count: 10,
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Week 1: Greetings and Basics',
    description: 'Complete all lessons on greetings and basic vocabulary',
    lesson_ids: ['1', '2', '3'],
    due_date: '2024-02-15T23:59:59Z',
    status: 'published',
    max_points: 100,
    created_at: '2024-01-28T10:00:00Z',
    submission_count: 12,
    completion_rate: 80,
  },
  {
    id: '2',
    title: 'Numbers and Counting',
    description: 'Master French numbers 1-20',
    lesson_ids: ['4'],
    due_date: '2024-02-20T23:59:59Z',
    status: 'published',
    max_points: 50,
    created_at: '2024-01-29T10:00:00Z',
    submission_count: 10,
    completion_rate: 67,
  },
  {
    id: '3',
    title: 'Grammar Practice: Articles',
    description: 'Practice using articles correctly',
    lesson_ids: ['6'],
    due_date: '2024-02-25T23:59:59Z',
    status: 'published',
    max_points: 75,
    created_at: '2024-01-30T10:00:00Z',
    submission_count: 8,
    completion_rate: 53,
  },
  {
    id: '4',
    title: 'Listening Comprehension',
    description: 'Complete listening exercises',
    lesson_ids: ['5', '12'],
    due_date: '2024-03-01T23:59:59Z',
    status: 'published',
    max_points: 100,
    created_at: '2024-02-01T10:00:00Z',
    submission_count: 6,
    completion_rate: 40,
  },
  {
    id: '5',
    title: 'Verb Conjugation Practice',
    description: 'Practice present tense verb conjugations',
    lesson_ids: ['7'],
    due_date: '2024-03-05T23:59:59Z',
    status: 'draft',
    max_points: 80,
    created_at: '2024-02-02T10:00:00Z',
  },
  {
    id: '6',
    title: 'Midterm Review',
    description: 'Review all material covered so far',
    lesson_ids: ['1', '2', '3', '4', '5', '6', '7'],
    due_date: '2024-03-10T23:59:59Z',
    status: 'published',
    max_points: 200,
    created_at: '2024-02-03T10:00:00Z',
    submission_count: 5,
    completion_rate: 33,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    student_id: '1',
    student: mockStudents[0],
    assignment_id: '1',
    assignment: mockAssignments[0],
    answers: { '1': 'Hello', '2': 'correct', '3': 'A' },
    score: 85,
    max_score: 100,
    feedback: 'Good work! Keep practicing pronunciation.',
    status: 'graded',
    submitted_at: '2024-02-10T14:30:00Z',
    graded_at: '2024-02-11T09:15:00Z',
  },
  {
    id: '2',
    student_id: '2',
    student: mockStudents[1],
    assignment_id: '1',
    assignment: mockAssignments[0],
    answers: { '1': 'Hello', '2': 'correct', '3': 'A' },
    score: 95,
    max_score: 100,
    feedback: 'Excellent! Perfect score!',
    status: 'graded',
    submitted_at: '2024-02-11T10:00:00Z',
    graded_at: '2024-02-11T15:20:00Z',
  },
  {
    id: '3',
    student_id: '3',
    student: mockStudents[2],
    assignment_id: '1',
    assignment: mockAssignments[0],
    answers: { '1': 'Goodbye', '2': 'incorrect', '3': 'B' },
    score: 60,
    max_score: 100,
    feedback: 'Review the greeting vocabulary. Practice more.',
    status: 'graded',
    submitted_at: '2024-02-12T16:45:00Z',
    graded_at: '2024-02-13T08:30:00Z',
  },
  {
    id: '4',
    student_id: '4',
    student: mockStudents[3],
    assignment_id: '1',
    assignment: mockAssignments[0],
    answers: { '1': 'Hello', '2': 'correct', '3': 'A' },
    status: 'pending',
    max_score: 100,
    submitted_at: '2024-02-14T11:20:00Z',
  },
  {
    id: '5',
    student_id: '5',
    student: mockStudents[4],
    assignment_id: '1',
    assignment: mockAssignments[0],
    answers: { '1': 'Hello', '2': 'correct', '3': 'A' },
    status: 'pending',
    max_score: 100,
    submitted_at: '2024-02-14T13:10:00Z',
  },
  {
    id: '6',
    student_id: '1',
    student: mockStudents[0],
    assignment_id: '2',
    assignment: mockAssignments[1],
    answers: { '4': 'correct' },
    score: 50,
    max_score: 50,
    feedback: 'Perfect!',
    status: 'graded',
    submitted_at: '2024-02-18T09:00:00Z',
    graded_at: '2024-02-18T14:00:00Z',
  },
  {
    id: '7',
    student_id: '2',
    student: mockStudents[1],
    assignment_id: '2',
    assignment: mockAssignments[1],
    answers: { '4': 'correct' },
    score: 50,
    max_score: 50,
    feedback: 'Well done!',
    status: 'graded',
    submitted_at: '2024-02-19T10:30:00Z',
    graded_at: '2024-02-19T11:00:00Z',
  },
  {
    id: '8',
    student_id: '6',
    student: mockStudents[5],
    assignment_id: '2',
    assignment: mockAssignments[1],
    answers: { '4': 'incorrect' },
    status: 'pending',
    max_score: 50,
    submitted_at: '2024-02-20T08:15:00Z',
  },
  {
    id: '9',
    student_id: '3',
    student: mockStudents[2],
    assignment_id: '3',
    assignment: mockAssignments[2],
    answers: { '6': 'une' },
    status: 'pending',
    max_score: 75,
    submitted_at: '2024-02-22T15:00:00Z',
  },
  {
    id: '10',
    student_id: '7',
    student: mockStudents[6],
    assignment_id: '3',
    assignment: mockAssignments[2],
    answers: { '6': 'le' },
    status: 'pending',
    max_score: 75,
    submitted_at: '2024-02-23T10:20:00Z',
  },
];

export const mockTests: Test[] = [
  {
    id: '1',
    class_id: 'class1',
    title: 'Midterm Exam: French Basics',
    description: 'Comprehensive test covering greetings, numbers, and basic vocabulary',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does "Bonjour" mean?',
        options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
        correctAnswer: 'Hello',
        points: 10,
        explanation: 'Bonjour is the standard French greeting.',
        order: 1,
      },
      {
        id: 'q2',
        type: 'fill-blank',
        question: 'Complete: Je mange ___ pomme.',
        correctAnswer: 'une',
        points: 15,
        explanation: 'Une is the indefinite article for feminine singular nouns.',
        order: 2,
      },
      {
        id: 'q3',
        type: 'matching',
        question: 'Match the French colors with English',
        options: ['rouge', 'bleu', 'vert', 'jaune'],
        correctAnswer: ['red', 'blue', 'green', 'yellow'],
        points: 20,
        order: 3,
      },
      {
        id: 'q4',
        type: 'translation',
        question: 'Translate: "I am a student."',
        correctAnswer: 'Je suis étudiant.',
        points: 25,
        order: 4,
      },
      {
        id: 'q5',
        type: 'short-answer',
        question: 'Explain when to use "le" vs "la" in French.',
        correctAnswer: null,
        points: 30,
        order: 5,
      },
    ],
    time_limit_minutes: 60,
    start_date: '2024-02-20T09:00:00Z',
    end_date: '2024-02-20T17:00:00Z',
    passing_score: 70,
    randomize_questions: false,
    status: 'active',
    max_points: 100,
    created_at: '2024-02-15T10:00:00Z',
    attempt_count: 8,
    average_score: 82,
    completion_rate: 53,
  },
  {
    id: '2',
    class_id: 'class1',
    title: 'Vocabulary Quiz: Food',
    description: 'Test your knowledge of French food vocabulary',
    questions: [
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'What is "bread" in French?',
        options: ['Pain', 'Fromage', 'Lait', 'Beurre'],
        correctAnswer: 'Pain',
        points: 10,
        order: 1,
      },
      {
        id: 'q7',
        type: 'multiple-choice',
        question: 'What is "cheese" in French?',
        options: ['Pain', 'Fromage', 'Lait', 'Beurre'],
        correctAnswer: 'Fromage',
        points: 10,
        order: 2,
      },
      {
        id: 'q8',
        type: 'fill-blank',
        question: 'I would like ___ apple. (Je voudrais ___ pomme.)',
        correctAnswer: 'une',
        points: 15,
        order: 3,
      },
    ],
    time_limit_minutes: 30,
    start_date: '2024-03-01T00:00:00Z',
    end_date: '2024-03-05T23:59:59Z',
    passing_score: 60,
    randomize_questions: true,
    status: 'scheduled',
    max_points: 35,
    created_at: '2024-02-25T10:00:00Z',
  },
  {
    id: '3',
    class_id: 'class1',
    title: 'Grammar Test: Articles',
    description: 'Test on definite and indefinite articles',
    questions: [
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which article is used with masculine singular nouns?',
        options: ['le', 'la', 'les', 'une'],
        correctAnswer: 'le',
        points: 10,
        order: 1,
      },
      {
        id: 'q10',
        type: 'essay',
        question: 'Write a paragraph (3-4 sentences) describing your favorite food in French.',
        correctAnswer: null,
        points: 50,
        order: 2,
      },
    ],
    time_limit_minutes: 45,
    start_date: '2024-02-10T09:00:00Z',
    end_date: '2024-02-10T17:00:00Z',
    passing_score: 70,
    randomize_questions: false,
    status: 'completed',
    max_points: 60,
    created_at: '2024-02-05T10:00:00Z',
    attempt_count: 12,
    average_score: 75,
    completion_rate: 80,
  },
];

export const mockTestAttempts: TestAttempt[] = [
  {
    id: 'ta1',
    test_id: '1',
    test: mockTests[0],
    student_id: '1',
    student: mockStudents[0],
    started_at: '2024-02-20T09:15:00Z',
    submitted_at: '2024-02-20T09:45:00Z',
    answers: {
      q1: 'Hello',
      q2: 'une',
      q3: { rouge: 'red', bleu: 'blue', vert: 'green', jaune: 'yellow' },
      q4: 'Je suis étudiant.',
      q5: 'Le is used for masculine nouns, la for feminine nouns.',
    },
    score: 85,
    max_score: 100,
    status: 'graded',
    graded_at: '2024-02-20T10:00:00Z',
    feedback: 'Good work! Review article usage for question 2.',
  },
  {
    id: 'ta2',
    test_id: '1',
    test: mockTests[0],
    student_id: '2',
    student: mockStudents[1],
    started_at: '2024-02-20T09:20:00Z',
    submitted_at: '2024-02-20T09:50:00Z',
    answers: {
      q1: 'Hello',
      q2: 'une',
      q3: { rouge: 'red', bleu: 'blue', vert: 'green', jaune: 'yellow' },
      q4: 'Je suis étudiant.',
      q5: 'Le is masculine, la is feminine.',
    },
    score: 90,
    max_score: 100,
    status: 'graded',
    graded_at: '2024-02-20T10:05:00Z',
    feedback: 'Excellent work!',
  },
  {
    id: 'ta3',
    test_id: '1',
    test: mockTests[0],
    student_id: '3',
    student: mockStudents[2],
    started_at: '2024-02-20T10:00:00Z',
    submitted_at: '2024-02-20T10:35:00Z',
    answers: {
      q1: 'Goodbye',
      q2: 'le',
      q3: { rouge: 'blue', bleu: 'red', vert: 'yellow', jaune: 'green' },
      q4: 'Je suis un étudiant.',
      q5: 'I am not sure.',
    },
    score: 45,
    max_score: 100,
    status: 'graded',
    graded_at: '2024-02-20T11:00:00Z',
    feedback: 'Please review the basic vocabulary and grammar rules.',
  },
  {
    id: 'ta4',
    test_id: '1',
    test: mockTests[0],
    student_id: '4',
    student: mockStudents[3],
    started_at: '2024-02-20T11:00:00Z',
    answers: {
      q1: 'Hello',
      q2: 'une',
    },
    max_score: 100,
    status: 'in_progress',
  },
  {
    id: 'ta5',
    test_id: '1',
    test: mockTests[0],
    student_id: '5',
    student: mockStudents[4],
    started_at: '2024-02-20T11:30:00Z',
    submitted_at: '2024-02-20T12:00:00Z',
    answers: {
      q1: 'Hello',
      q2: 'une',
      q3: { rouge: 'red', bleu: 'blue', vert: 'green', jaune: 'yellow' },
      q4: 'Je suis étudiant.',
      q5: 'Le is used with masculine nouns, la with feminine nouns.',
    },
    max_score: 100,
    status: 'submitted',
  },
  {
    id: 'ta6',
    test_id: '3',
    test: mockTests[2],
    student_id: '1',
    student: mockStudents[0],
    started_at: '2024-02-10T09:10:00Z',
    submitted_at: '2024-02-10T09:40:00Z',
    answers: {
      q9: 'le',
      q10: 'Mon aliment préféré est le pain. J\'aime manger du pain avec du fromage. Le pain français est délicieux.',
    },
    score: 55,
    max_score: 60,
    status: 'graded',
    graded_at: '2024-02-10T10:00:00Z',
    feedback: 'Great essay! Good use of vocabulary.',
  },
];

export const mockDashboardStats: DashboardStats = {
  total_students: 15,
  active_assignments: 4,
  pending_grades: 5,
  lessons_uploaded: 12,
  active_tests: 1,
};

// Helper functions
export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find(lesson => lesson.id === id);
}

export function getAssignmentById(id: string): Assignment | undefined {
  return mockAssignments.find(assignment => assignment.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return mockStudents.find(student => student.id === id);
}

export function getSubmissionsByAssignment(assignmentId: string): Submission[] {
  return mockSubmissions.filter(sub => sub.assignment_id === assignmentId);
}

export function getPendingSubmissions(): Submission[] {
  return mockSubmissions.filter(sub => sub.status === 'pending');
}

export function getTestById(id: string): Test | undefined {
  return mockTests.find(test => test.id === id);
}

export function getTestAttemptsByTest(testId: string): TestAttempt[] {
  return mockTestAttempts.filter(attempt => attempt.test_id === testId);
}

export function getTestAttemptById(id: string): TestAttempt | undefined {
  return mockTestAttempts.find(attempt => attempt.id === id);
}

export const mockClasses: Class[] = [
  {
    id: 'class1',
    teacher_id: 'teacher1',
    name: 'French 101 - Beginner',
    description: 'Introduction to French language and culture',
    class_code: 'FR101-2024',
    settings: {
      invitation_method: 'both',
      allow_self_enrollment: true,
    },
    created_at: '2024-01-01T10:00:00Z',
    student_count: 15,
    active_assignments_count: 4,
  },
  {
    id: 'class2',
    teacher_id: 'teacher1',
    name: 'French 201 - Intermediate',
    description: 'Intermediate French conversation and grammar',
    class_code: 'FR201-2024',
    settings: {
      invitation_method: 'code',
      allow_self_enrollment: false,
    },
    created_at: '2024-01-15T10:00:00Z',
    student_count: 12,
    active_assignments_count: 3,
  },
  {
    id: 'class3',
    teacher_id: 'teacher1',
    name: 'French Conversation Club',
    description: 'Practice speaking French in a relaxed environment',
    class_code: 'FR-CLUB-2024',
    settings: {
      invitation_method: 'email',
      allow_self_enrollment: false,
    },
    created_at: '2024-02-01T10:00:00Z',
    student_count: 8,
    active_assignments_count: 2,
  },
];

export const mockEnrollments: Enrollment[] = [
  // Class 1 enrollments
  { id: 'e1', class_id: 'class1', student_id: '1', student: mockStudents[0], enrolled_at: '2024-01-02T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e2', class_id: 'class1', student_id: '2', student: mockStudents[1], enrolled_at: '2024-01-02T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e3', class_id: 'class1', student_id: '3', student: mockStudents[2], enrolled_at: '2024-01-03T10:00:00Z', status: 'active', enrollment_method: 'email_invite' },
  { id: 'e4', class_id: 'class1', student_id: '4', student: mockStudents[3], enrolled_at: '2024-01-03T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e5', class_id: 'class1', student_id: '5', student: mockStudents[4], enrolled_at: '2024-01-04T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e6', class_id: 'class1', student_id: '6', student: mockStudents[5], enrolled_at: '2024-01-04T10:00:00Z', status: 'active', enrollment_method: 'email_invite' },
  { id: 'e7', class_id: 'class1', student_id: '7', student: mockStudents[6], enrolled_at: '2024-01-05T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e8', class_id: 'class1', student_id: '8', student: mockStudents[7], enrolled_at: '2024-01-05T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e9', class_id: 'class1', student_id: '9', student: mockStudents[8], enrolled_at: '2024-01-06T10:00:00Z', status: 'active', enrollment_method: 'manual' },
  { id: 'e10', class_id: 'class1', student_id: '10', student: mockStudents[9], enrolled_at: '2024-01-06T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e11', class_id: 'class1', student_id: '11', student: mockStudents[10], enrolled_at: '2024-01-07T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e12', class_id: 'class1', student_id: '12', student: mockStudents[11], enrolled_at: '2024-01-07T10:00:00Z', status: 'active', enrollment_method: 'email_invite' },
  { id: 'e13', class_id: 'class1', student_id: '13', student: mockStudents[12], enrolled_at: '2024-01-08T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e14', class_id: 'class1', student_id: '14', student: mockStudents[13], enrolled_at: '2024-01-08T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e15', class_id: 'class1', student_id: '15', student: mockStudents[14], enrolled_at: '2024-01-09T10:00:00Z', status: 'active', enrollment_method: 'code' },
  // Class 2 enrollments (subset of students)
  { id: 'e16', class_id: 'class2', student_id: '1', student: mockStudents[0], enrolled_at: '2024-01-16T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e17', class_id: 'class2', student_id: '2', student: mockStudents[1], enrolled_at: '2024-01-16T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e18', class_id: 'class2', student_id: '4', student: mockStudents[3], enrolled_at: '2024-01-17T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e19', class_id: 'class2', student_id: '6', student: mockStudents[5], enrolled_at: '2024-01-17T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e20', class_id: 'class2', student_id: '8', student: mockStudents[7], enrolled_at: '2024-01-18T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e21', class_id: 'class2', student_id: '11', student: mockStudents[10], enrolled_at: '2024-01-18T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e22', class_id: 'class2', student_id: '13', student: mockStudents[12], enrolled_at: '2024-01-19T10:00:00Z', status: 'active', enrollment_method: 'code' },
  { id: 'e23', class_id: 'class2', student_id: '15', student: mockStudents[14], enrolled_at: '2024-01-19T10:00:00Z', status: 'active', enrollment_method: 'code' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    class_id: 'class1',
    title: 'Welcome to French 101!',
    content: 'Welcome everyone to French 101! I\'m excited to start this journey with you. Please make sure to complete the first assignment by next week.',
    created_by: 'teacher1',
    is_pinned: true,
    created_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'a2',
    class_id: 'class1',
    title: 'Assignment Due Date Extended',
    content: 'Due to popular request, I\'m extending the due date for Week 1 assignment to Friday. Please submit by 11:59 PM.',
    created_by: 'teacher1',
    is_pinned: false,
    created_at: '2024-01-10T14:30:00Z',
  },
  {
    id: 'a3',
    class_id: 'class1',
    title: 'Midterm Exam Reminder',
    content: 'Just a reminder that the midterm exam is scheduled for next Monday. Please review all materials from weeks 1-4. Good luck!',
    created_by: 'teacher1',
    is_pinned: true,
    created_at: '2024-02-15T09:00:00Z',
  },
  {
    id: 'a4',
    class_id: 'class1',
    title: 'New Lesson Available',
    content: 'I\'ve just uploaded a new lesson on French pronunciation. Check it out in the lessons section!',
    created_by: 'teacher1',
    is_pinned: false,
    created_at: '2024-02-20T11:00:00Z',
  },
  {
    id: 'a5',
    class_id: 'class2',
    title: 'Welcome to French 201',
    content: 'Welcome to the intermediate class! We\'ll be building on what you learned in French 101.',
    created_by: 'teacher1',
    is_pinned: true,
    created_at: '2024-01-15T10:00:00Z',
  },
];

export const mockClassAnalytics: ClassAnalytics = {
  class_id: 'class1',
  completion_rates: {
    lessons: 75,
    assignments: 68,
    tests: 53,
    on_time_submissions: 82,
  },
  average_scores: {
    overall: 84,
    assignments: 82,
    tests: 79,
  },
  engagement_metrics: {
    daily_active_users: 12,
    weekly_active_users: 14,
    average_session_length: 25,
    login_frequency: 4.2,
  },
  student_progress: mockStudents.slice(0, 15).map((student) => ({
    student_id: student.id,
    student,
    lessons_completed: student.progress?.lessons_completed || 0,
    total_lessons: student.progress?.total_lessons || 20,
    assignment_completion_rate: Math.floor(Math.random() * 30) + 70,
    average_score: student.progress?.average_score || 0,
  })),
  content_performance: [
    { lesson_id: '1', lesson_title: 'Introduction to French Greetings', completion_count: 12, average_score: 88 },
    { lesson_id: '2', lesson_title: 'Pronunciation: Vowels', completion_count: 10, average_score: 85 },
    { lesson_id: '3', lesson_title: 'Basic Vocabulary Quiz', completion_count: 15, average_score: 90 },
    { lesson_id: '4', lesson_title: 'Numbers 1-20', completion_count: 11, average_score: 87 },
    { lesson_id: '5', lesson_title: 'Listening Comprehension: Restaurant', completion_count: 9, average_score: 82 },
  ],
};

// Helper functions for classes
export function getClassById(id: string): Class | undefined {
  return mockClasses.find(cls => cls.id === id);
}

export function getClassesByTeacher(teacherId: string): Class[] {
  return mockClasses.filter(cls => cls.teacher_id === teacherId);
}

export function getEnrollmentsByClass(classId: string): Enrollment[] {
  return mockEnrollments.filter(enrollment => enrollment.class_id === classId && enrollment.status === 'active');
}

export function getEnrollmentByStudentAndClass(studentId: string, classId: string): Enrollment | undefined {
  return mockEnrollments.find(
    enrollment => enrollment.student_id === studentId && enrollment.class_id === classId
  );
}

export function getAnnouncementsByClass(classId: string): Announcement[] {
  return mockAnnouncements
    .filter(announcement => announcement.class_id === classId)
    .sort((a, b) => {
      // Pinned first, then by date (newest first)
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return mockAnnouncements.find(announcement => announcement.id === id);
}

export function getClassAnalyticsByClass(classId: string): ClassAnalytics | undefined {
  // Return pre-defined analytics for class1
  if (classId === 'class1') {
    return mockClassAnalytics;
  }

  // Generate analytics dynamically for other classes
  const enrollments = getEnrollmentsByClass(classId);
  const students = enrollments.map(e => e.student).filter(Boolean) as Student[];
  
  if (students.length === 0) {
    return undefined;
  }

  // Calculate completion rates based on student progress
  const totalLessons = 20; // Default total lessons
  const lessonsCompleted = students.reduce((sum, s) => sum + (s.progress?.lessons_completed || 0), 0);
  const avgLessonsCompleted = lessonsCompleted / students.length;
  const lessonCompletionRate = Math.round((avgLessonsCompleted / totalLessons) * 100);

  // Calculate average scores
  const totalScores = students.reduce((sum, s) => sum + (s.progress?.average_score || 0), 0);
  const avgScore = Math.round(totalScores / students.length);

  // Get assignments and tests for this class
  const classAssignments = mockAssignments.filter(a => a.status === 'published');
  const classTests = mockTests.filter(t => t.class_id === classId);

  // Calculate assignment completion
  const assignmentSubmissions = mockSubmissions.filter(s => 
    classAssignments.some(a => a.id === s.assignment_id)
  );
  const assignmentCompletionRate = classAssignments.length > 0
    ? Math.round((assignmentSubmissions.length / (classAssignments.length * students.length)) * 100)
    : 0;

  // Calculate test completion
  const testAttempts = mockTestAttempts.filter(t => 
    classTests.some(test => test.id === t.test_id)
  );
  const testCompletionRate = classTests.length > 0
    ? Math.round((testAttempts.length / (classTests.length * students.length)) * 100)
    : 0;

  // Calculate on-time submissions (mock calculation)
  const onTimeRate = Math.min(100, assignmentCompletionRate + 10);

  // Generate student progress data
  const studentProgress = students.map((student) => ({
    student_id: student.id,
    student,
    lessons_completed: student.progress?.lessons_completed || 0,
    total_lessons: totalLessons,
    assignment_completion_rate: Math.round(Math.random() * 30) + 70,
    average_score: student.progress?.average_score || avgScore,
  }));

  // Generate content performance (use available lessons)
  const contentPerformance = mockLessons.slice(0, 5).map((lesson, index) => ({
    lesson_id: lesson.id,
    lesson_title: lesson.title,
    completion_count: Math.round(students.length * (0.6 + Math.random() * 0.3)),
    average_score: Math.round(75 + Math.random() * 20),
  }));

  // Calculate engagement metrics
  const dailyActiveUsers = Math.round(students.length * 0.7);
  const weeklyActiveUsers = Math.round(students.length * 0.9);
  const avgSessionLength = Math.round(20 + Math.random() * 15);
  const loginFrequency = Math.round(3 + Math.random() * 2);

  return {
    class_id: classId,
    completion_rates: {
      lessons: lessonCompletionRate,
      assignments: assignmentCompletionRate,
      tests: testCompletionRate,
      on_time_submissions: onTimeRate,
    },
    average_scores: {
      overall: avgScore,
      assignments: Math.round(avgScore - 2),
      tests: Math.round(avgScore - 5),
    },
    engagement_metrics: {
      daily_active_users: dailyActiveUsers,
      weekly_active_users: weeklyActiveUsers,
      average_session_length: avgSessionLength,
      login_frequency: loginFrequency,
    },
    student_progress: studentProgress,
    content_performance: contentPerformance,
  };
}

export function generateClassCode(): string {
  const prefix = 'FR';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  return `${prefix}${randomNum}-${year}`;
}
