export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  NONE = 'NONE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StudentStats {
  subject: string;
  progress: number; // 0-100
  tasksCompleted: number;
}

export interface LessonParams {
  topic: string;
  gradeLevel: string;
  duration: string;
}

export interface QuizParams {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
}