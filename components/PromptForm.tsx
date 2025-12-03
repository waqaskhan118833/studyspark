/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { explainTopic } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SparklesIcon, ArrowRightIcon, ZapIcon, BookIcon } from './icons';

interface StudyChatProps {
  onStartQuiz: (topic: string) => void;
}

const StudyChat: React.FC<StudyChatProps> = ({ onStartQuiz }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hi! I'm StudySpark. What do you want to learn today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const topic = input.trim();
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: topic };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const explanation = await explainTopic(topic);
    
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: explanation 
    }]);
    setLoading(false);
  };

  const handleSimplify = async (originalText: string) => {
    setLoading(true);
    const simple = await explainTopic(originalText, true);
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'model', 
      text: simple,
      isSimplification: true
    }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none'
              } ${msg.isSimplification ? 'border-2 border-green-500/50' : ''}`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              
              {msg.role === 'model' && !msg.isSimplification && msg.id !== '1' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleSimplify(messages[messages.length - 2].text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors text-green-300"
                  >
                    <ZapIcon className="w-3 h-3" />
                    Simplify
                  </button>
                  <button 
                    onClick={() => onStartQuiz(messages[messages.length - 2].text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    <BookIcon className="w-3 h-3" />
                    Quiz Me
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-800 rounded-2xl p-4 rounded-bl-none flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g., 'How do rockets fly?')"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-full pl-5 pr-14 py-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-purple-600 rounded-full text-white disabled:opacity-50 disabled:bg-gray-700 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyChat;