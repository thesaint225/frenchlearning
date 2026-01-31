'use client';

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import type { Assignment, Submission, Class } from '@/lib/types';

export interface StudentLayoutContextValue {
  studentId: string | null;
  studentLoading: boolean;
  studentError: string | null;
  assignments: Assignment[];
  submissions: Submission[];
  classes: Class[];
  shellLoading: boolean;
  refetchShell: () => Promise<void>;
  refetchSubmissionsOnly: () => Promise<void>;
  refetchClassesOnly: () => Promise<void>;
}

const StudentLayoutContext = createContext<StudentLayoutContextValue | null>(
  null,
);

export interface StudentLayoutProviderProps {
  children: ReactNode;
  value: StudentLayoutContextValue;
}

export function StudentLayoutProvider({
  children,
  value,
}: StudentLayoutProviderProps) {
  return (
    <StudentLayoutContext.Provider value={value}>
      {children}
    </StudentLayoutContext.Provider>
  );
}

export function useStudentLayout(): StudentLayoutContextValue {
  const ctx = useContext(StudentLayoutContext);
  if (!ctx) {
    throw new Error(
      'useStudentLayout must be used within a StudentLayoutProvider',
    );
  }
  return ctx;
}
