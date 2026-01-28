import { TestQuestion, QuestionType } from '../types';

/**
 * Auto-grade a question based on its type
 */
export function autoGradeQuestion(
  question: TestQuestion,
  studentAnswer: any
): { correct: boolean; points: number } {
  if (!question.correctAnswer) {
    // Manual grading required
    return { correct: false, points: 0 };
  }

  switch (question.type) {
    case 'multiple-choice':
      return gradeMultipleChoice(question, studentAnswer);

    case 'fill-blank':
      return gradeFillBlank(question, studentAnswer);

    case 'matching':
      return gradeMatching(question, studentAnswer);

    case 'translation':
    case 'short-answer':
    case 'essay':
      // Manual grading required
      return { correct: false, points: 0 };

    default:
      return { correct: false, points: 0 };
  }
}

/**
 * Grade multiple choice question
 */
function gradeMultipleChoice(question: TestQuestion, answer: string): { correct: boolean; points: number } {
  const correct = String(answer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
  return {
    correct,
    points: correct ? question.points : 0,
  };
}

/**
 * Grade fill-in-the-blank question
 */
function gradeFillBlank(question: TestQuestion, answer: string): { correct: boolean; points: number } {
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];

  const normalizedAnswer = String(answer).trim().toLowerCase();
  const normalizedCorrect = correctAnswer.map(a => String(a).trim().toLowerCase());

  const correct = normalizedCorrect.includes(normalizedAnswer);
  return {
    correct,
    points: correct ? question.points : 0,
  };
}

/**
 * Grade matching question
 */
function gradeMatching(question: TestQuestion, answer: Record<string, string>): { correct: boolean; points: number } {
  const correctAnswer = question.correctAnswer;
  if (!question.options || !Array.isArray(correctAnswer)) {
    return { correct: false, points: 0 };
  }

  const correctPairs = question.options.reduce((acc, option, index) => {
    acc[option] = correctAnswer[index];
    return acc;
  }, {} as Record<string, string>);

  let correctCount = 0;
  const totalPairs = question.options.length;

  for (const [key, value] of Object.entries(answer)) {
    if (correctPairs[key]?.toLowerCase() === value?.toLowerCase()) {
      correctCount++;
    }
  }

  // All pairs must be correct to get full points
  const allCorrect = correctCount === totalPairs;
  return {
    correct: allCorrect,
    points: allCorrect ? question.points : 0,
  };
}

/**
 * Calculate total score for a test attempt
 */
export function calculateTestScore(
  questions: TestQuestion[],
  answers: Record<string, any>
): { score: number; maxScore: number; autoGraded: boolean } {
  let score = 0;
  let maxScore = 0;
  let allAutoGraded = true;

  for (const question of questions) {
    maxScore += question.points;
    const studentAnswer = answers[question.id];

    if (studentAnswer !== undefined && studentAnswer !== null && studentAnswer !== '') {
      const result = autoGradeQuestion(question, studentAnswer);
      score += result.points;

      // If question requires manual grading, mark as not fully auto-graded
      if (!question.correctAnswer) {
        allAutoGraded = false;
      }
    } else {
      // Question not answered
      allAutoGraded = false;
    }
  }

  return {
    score,
    maxScore,
    autoGraded: allAutoGraded,
  };
}
