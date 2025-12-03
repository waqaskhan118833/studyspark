/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import ApiKeyDialog from './components/ApiKeyDialog';
import { BookIcon, ZapIcon, FlameIcon, ChatIcon, GradCapIcon } from './components/icons';
import StudyChat from './components/PromptForm';
import QuizArena from './components/VideoResult';
import FocusBuddy from './components/LoadingIndicator';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CHAT);
  const [streak, setStreak] = useState(3);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
          if (!(await window.aistudio.hasSelectedApiKey())) {
            setShowApiKeyDialog(true);
          }
        } catch (error) {
          setShowApiKeyDialog(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleApiKeyDialogContinue = async () => {
    setShowApiKeyDialog(false);
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const startQuiz = (topic: string) => {
    setQuizTopic(topic);
    setActiveView(View.QUIZ);
  };

  const handleQuizComplete = () => {
    setStreak(s => s + 1);
    // Optionally stay on quiz or go back
  };

  const handleFocusComplete = () => {
    setStreak(s => s + 1);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all w-full ${
        activeView === view 
          ? 'text-white' 
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <div className={`p-2 rounded-2xl ${activeView === view ? 'bg-purple-600 shadow-lg shadow-purple-900/40' : 'bg-transparent'}`}>
        <Icon className={`w-6 h-6 ${activeView === view ? 'text-white' : 'text-current'}`} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col font-sans overflow-hidden">
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}
      
      {/* Mobile-friendly Header */}
      <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-purple-600 rounded-lg flex items-center justify-center">
            <GradCapIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">StudySpark</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
          <FlameIcon className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-100">{streak}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeView === View.CHAT && (
          <div className="h-full animate-fade-in">
            <StudyChat onStartQuiz={startQuiz} />
          </div>
        )}
        {activeView === View.QUIZ && (
          <div className="h-full animate-fade-in">
            <QuizArena initialTopic={quizTopic} onComplete={handleQuizComplete} />
          </div>
        )}
        {activeView === View.FOCUS && (
          <div className="h-full animate-fade-in">
            <FocusBuddy onSessionComplete={handleFocusComplete} />
          </div>
        )}
      </main>

      {/* Bottom Navigation for Mobile Feel */}
      <nav className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 pb-2 shrink-0 z-20">
        <NavItem view={View.CHAT} icon={ChatIcon} label="Ask" />
        <NavItem view={View.QUIZ} icon={BookIcon} label="Quiz" />
        <NavItem view={View.FOCUS} icon={ZapIcon} label="Focus" />
      </nav>
    </div>
  );
};

export default App;