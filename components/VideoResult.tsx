/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz } from '../types';
import { CheckIcon, XIcon, BrainIcon, SparklesIcon, ArrowRightIcon } from './icons';

interface QuizArenaProps {
  initialTopic?: string;
  onComplete: () => void;
}

const QuizArena: React.FC<QuizArenaProps> = ({ initialTopic, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (initialTopic) {
      loadQuiz(initialTopic);
    }
  }, [initialTopic]);

  const loadQuiz = async (topic: string) => {
    setLoading(true);
    const data = await generateQuiz(topic);
    setQuiz(data);
    setLoading(false);
    setCurrentQIndex(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === quiz?.questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
      new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg').play().catch(() => {});
    } else {
      new Audio('https://actions.google.com/sounds/v1/cartoon/clank_car_crash.ogg').play().catch(() => {});
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Quiz finished
      onComplete();
      setQuiz(null); // Simple reset for now
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 mb-6 rounded-full bg-purple-900/30 flex items-center justify-center animate-bounce">
          <BrainIcon className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Cooking up a Quiz...</h3>
        <p className="text-gray-400">Getting questions ready for "{initialTopic}"</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <SparklesIcon className="w-12 h-12 text-orange-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Quiz Arena</h3>
        <p className="text-gray-400 mb-6">Ask a question in Chat to generate a quiz!</p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];
  const isCorrect = selectedOption === currentQ.correctAnswerIndex;

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col justify-center p-4">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
        <span>Question {currentQIndex + 1} / {quiz.questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-8 leading-snug">{currentQ.question}</h2>

      <div className="space-y-3">
        {currentQ.options.map((option, idx) => {
          let stateStyles = "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700";
          
          if (showFeedback) {
            if (idx === currentQ.correctAnswerIndex) {
              stateStyles = "bg-green-500/20 border-green-500 text-green-200";
            } else if (idx === selectedOption) {
              stateStyles = "bg-red-500/20 border-red-500 text-red-200";
            } else {
              stateStyles = "opacity-50 bg-gray-900 border-gray-800 text-gray-500";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all text-lg font-medium flex items-center justify-between ${stateStyles}`}
            >
              <span>{option}</span>
              {showFeedback && idx === currentQ.correctAnswerIndex && <CheckIcon className="w-5 h-5" />}
              {showFeedback && idx === selectedOption && idx !== currentQ.correctAnswerIndex && <XIcon className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 animate-fade-in">
          <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-900/20 text-green-300' : 'bg-orange-900/20 text-orange-300'}`}>
            <p className="font-medium">{currentQ.explanation}</p>
          </div>
          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
          >
            {currentQIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizArena;