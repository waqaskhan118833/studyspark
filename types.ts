/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export enum View {
  CHAT = 'chat',
  FOCUS = 'focus',
  QUIZ = 'quiz',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isSimplification?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface StudyStats {
  streak: number;
  topicsLearned: number;
  focusMinutes: number;
}