'use client';

import { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExerciseDisplayProps {
  exercise: Exercise;
}

/**
 * Displays exercise content in a formatted card with support for all exercise types.
 * 
 * @param props - Component props
 * @param props.exercise - The exercise object to display
 * @returns Exercise display component
 */
export function ExerciseDisplay({ exercise }: ExerciseDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-lg">Exercise Question</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
              {exercise.type.replace('-', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">{exercise.points} points</span>
          </div>
          <p className="text-base">{exercise.question}</p>
        </div>

        {/* Multiple Choice */}
        {exercise.type === 'multiple-choice' && exercise.options && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Options:</p>
            {exercise.options.map((option, idx) => {
              const isCorrect = Array.isArray(exercise.correctAnswer)
                ? exercise.correctAnswer.includes(option)
                : exercise.correctAnswer === option;
              
              return (
                <div
                  key={idx}
                  className={cn(
                    'text-sm p-3 rounded border',
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {String.fromCharCode(65 + idx)}. {option}
                    </span>
                    {isCorrect && (
                      <span className="text-green-600 font-medium text-xs">✓ Correct</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank */}
        {exercise.type === 'fill-blank' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Correct Answer(s):</p>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium">
                {Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer.join(', ')
                  : exercise.correctAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Matching */}
        {exercise.type === 'matching' && exercise.options && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">Matching Pairs:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exercise.options.map((leftItem, idx) => {
                const rightAnswer = Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer[idx]
                  : '';
                
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{leftItem}</p>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700">{rightAnswer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Translation */}
        {exercise.type === 'translation' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Correct Translation:</p>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium">
                {Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer.join(', ')
                  : exercise.correctAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Short Answer (for backward compatibility) */}
        {exercise.type === 'short-answer' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Correct Answer:</p>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium">
                {Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer.join(', ')
                  : exercise.correctAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Explanation */}
        {exercise.explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="font-medium text-blue-900 mb-1">Explanation:</p>
            <p className="text-sm text-blue-800">{exercise.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
