'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TestQuestion, QuestionType } from '@/lib/types';
import { X, Plus, Trash2 } from 'lucide-react';

interface QuestionEditorProps {
  question: TestQuestion;
  onUpdate: (question: TestQuestion) => void;
  onDelete: () => void;
  questionNumber: number;
}

export function QuestionEditor({ question, onUpdate, onDelete, questionNumber }: QuestionEditorProps) {
  const [localQuestion, setLocalQuestion] = useState<TestQuestion>(question);

  const updateField = <K extends keyof TestQuestion>(field: K, value: TestQuestion[K]) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const addOption = () => {
    const options = localQuestion.options || [];
    updateField('options', [...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(localQuestion.options || [])];
    options[index] = value;
    updateField('options', options);
  };

  const removeOption = (index: number) => {
    const options = [...(localQuestion.options || [])];
    options.splice(index, 1);
    updateField('options', options);
  };

  const addMatchingPair = () => {
    const options = localQuestion.options || [];
    const correctAnswers = Array.isArray(localQuestion.correctAnswer)
      ? [...localQuestion.correctAnswer]
      : [];
    
    updateField('options', [...options, '']);
    updateField('correctAnswer', [...correctAnswers, '']);
  };

  const updateMatchingPair = (index: number, side: 'left' | 'right', value: string) => {
    if (side === 'left') {
      const options = [...(localQuestion.options || [])];
      options[index] = value;
      updateField('options', options);
    } else {
      const correctAnswers = Array.isArray(localQuestion.correctAnswer)
        ? [...localQuestion.correctAnswer]
        : [];
      correctAnswers[index] = value;
      updateField('correctAnswer', correctAnswers);
    }
  };

  const removeMatchingPair = (index: number) => {
    const options = [...(localQuestion.options || [])];
    const correctAnswers = Array.isArray(localQuestion.correctAnswer)
      ? [...localQuestion.correctAnswer]
      : [];
    
    options.splice(index, 1);
    correctAnswers.splice(index, 1);
    
    updateField('options', options);
    updateField('correctAnswer', correctAnswers);
  };

  const renderQuestionFields = () => {
    switch (localQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Answer Options</Label>
              {(localQuestion.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const correct = String(localQuestion.correctAnswer) === option;
                      updateField('correctAnswer', correct ? localQuestion.correctAnswer : option);
                    }}
                    className={String(localQuestion.correctAnswer) === option ? 'bg-green-100' : ''}
                  >
                    ✓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOption} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-2">
            <Label>Correct Answer(s)</Label>
            <Input
              value={Array.isArray(localQuestion.correctAnswer) ? localQuestion.correctAnswer[0] : (localQuestion.correctAnswer || '')}
              onChange={(e) => updateField('correctAnswer', e.target.value)}
              placeholder="Enter correct answer"
            />
            <p className="text-xs text-muted-foreground">
              For multiple acceptable answers, separate with commas
            </p>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <Label>Matching Pairs</Label>
            {(localQuestion.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateMatchingPair(index, 'left', e.target.value)}
                  placeholder="Left item"
                  className="flex-1"
                />
                <span className="text-muted-foreground">→</span>
                <Input
                  value={Array.isArray(localQuestion.correctAnswer) ? localQuestion.correctAnswer[index] : ''}
                  onChange={(e) => updateMatchingPair(index, 'right', e.target.value)}
                  placeholder="Right item"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMatchingPair(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMatchingPair} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Pair
            </Button>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-2">
            <Label>Acceptable Translations (one per line)</Label>
            <Textarea
              value={Array.isArray(localQuestion.correctAnswer) 
                ? localQuestion.correctAnswer.join('\n')
                : (localQuestion.correctAnswer || '')}
              onChange={(e) => {
                const answers = e.target.value.split('\n').filter(a => a.trim());
                updateField('correctAnswer', answers.length === 1 ? answers[0] : answers);
              }}
              placeholder="Enter acceptable translations..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Note: Translation questions require manual grading
            </p>
          </div>
        );

      case 'short-answer':
      case 'essay':
        return (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              This question type requires manual grading. No correct answer needs to be set.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Question {questionNumber} - {localQuestion.type.replace('-', ' ')}
            </CardTitle>
            <CardDescription>Configure this question</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${localQuestion.id}`}>Question Text *</Label>
          <Textarea
            id={`question-${localQuestion.id}`}
            value={localQuestion.question}
            onChange={(e) => updateField('question', e.target.value)}
            placeholder="Enter your question..."
            rows={3}
            required
          />
        </div>

        {renderQuestionFields()}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`points-${localQuestion.id}`}>Points *</Label>
            <Input
              id={`points-${localQuestion.id}`}
              type="number"
              min="1"
              value={localQuestion.points}
              onChange={(e) => updateField('points', Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`explanation-${localQuestion.id}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${localQuestion.id}`}
            value={localQuestion.explanation || ''}
            onChange={(e) => updateField('explanation', e.target.value)}
            placeholder="Explanation shown after grading..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
