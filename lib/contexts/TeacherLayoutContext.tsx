'use client';

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import type { Class } from '@/lib/types';

export interface TeacherLayoutContextValue {
  teacherId: string | null;
  teacherLoading: boolean;
  teacherError: string | null;
  classes: Class[];
  classesLoading: boolean;
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  refetchClasses: () => Promise<void>;
}

const TeacherLayoutContext = createContext<TeacherLayoutContextValue | null>(
  null,
);

export interface TeacherLayoutProviderProps {
  children: ReactNode;
  value: TeacherLayoutContextValue;
}

export function TeacherLayoutProvider({
  children,
  value,
}: TeacherLayoutProviderProps) {
  return (
    <TeacherLayoutContext.Provider value={value}>
      {children}
    </TeacherLayoutContext.Provider>
  );
}

export function useTeacherLayout(): TeacherLayoutContextValue {
  const ctx = useContext(TeacherLayoutContext);
  if (!ctx) {
    throw new Error(
      'useTeacherLayout must be used within a TeacherLayoutProvider',
    );
  }
  return ctx;
}
