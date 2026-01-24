'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestQuestion, QuestionType } from '@/lib/types';
import { QuestionEditor } from './QuestionEditor';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestionBuilderProps {
  questions: TestQuestion[];
  onQuestionsChange: (questions: TestQuestion[]) => void;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'fill-blank', label: 'Fill in the Blank' },
  { value: 'matching', label: 'Matching' },
  { value: 'translation', label: 'Translation' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'essay', label: 'Essay' },
];

export function QuestionBuilder({ questions, onQuestionsChange }: QuestionBuilderProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('multiple-choice');

  const addQuestion = () => {
    const newQuestion: TestQuestion = {
      id: `q${Date.now()}`,
      type: selectedType,
      question: '',
      points: 10,
      correctAnswer: selectedType === 'essay' || selectedType === 'short-answer' ? null : '',
      order: questions.length + 1,
      options: selectedType === 'multiple-choice' ? ['', ''] : selectedType === 'matching' ? [] : undefined,
    };

    if (selectedType === 'matching') {
      newQuestion.correctAnswer = [];
    }

    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updated: TestQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    onQuestionsChange(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Reorder questions
    newQuestions.forEach((q, i) => {
      q.order = i + 1;
    });
    onQuestionsChange(newQuestions);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    // Update order
    newQuestions.forEach((q, i) => {
      q.order = i + 1;
    });

    onQuestionsChange(newQuestions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions</CardTitle>
        <CardDescription>Add and configure test questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No questions added yet. Add your first question below.</p>
          </div>
        )}

        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => moveQuestion(index, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => moveQuestion(index, 'down')}
                disabled={index === questions.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <QuestionEditor
              question={question}
              onUpdate={(updated) => updateQuestion(index, updated)}
              onDelete={() => deleteQuestion(index)}
              questionNumber={index + 1}
            />
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as QuestionType)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addQuestion} className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Total Questions: {questions.length} | Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
