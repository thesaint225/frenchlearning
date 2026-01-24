'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Class } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ClassSelectorProps {
  classes: Class[];
  currentClassId?: string;
  onClassChange?: (classId: string) => void;
}

export function ClassSelector({
  classes,
  currentClassId,
  onClassChange,
}: ClassSelectorProps) {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState(currentClassId || classes[0]?.id);

  const handleChange = (value: string) => {
    setSelectedClassId(value);
    if (onClassChange) {
      onClassChange(value);
    } else {
      router.push(`/teacher/classes/${value}`);
    }
  };

  if (classes.length === 0) {
    return null;
  }

  return (
    <Select value={selectedClassId} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a class" />
      </SelectTrigger>
      <SelectContent>
        {classes.map((classItem) => (
          <SelectItem key={classItem.id} value={classItem.id}>
            {classItem.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
