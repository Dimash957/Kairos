import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, BookOpen, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { createStudentChat } from '../services/geminiService';
import { Message, UserRole } from '../types';
import { DashboardStats } from './DashboardStats';
import { GenerateContentResponse } from '@google/genai';

export const StudentView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Привет! Я твой персональный ИИ-репетитор. Какую тему ты хочешь разобрать сегодня? Я могу объяснить материал или дать интересное задание.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to persist the chat session across renders without re-initializing
  const chatSessionRef = useRef(createStudentChat());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({
        message: userMsg.text
      });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "Извини, я не смог ответить. Попробуй еще раз.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Произошла ошибка соединения. Проверьте ваш API ключ или интернет.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Sidebar: Progress & Tasks */}
      <div className="w-1/3 flex flex-col gap-6 hidden md:flex">
        <DashboardStats role={UserRole.STUDENT} />
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-800">Твои задания</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Квадратные уравнения', status: 'pending', date: 'Сегодня' },
              { title: 'Закон Ома', status: 'completed', date: 'Вчера' },
              { title: 'Эссе "Война и Мир"', status: 'pending', date: 'Завтра' },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-700 text-sm">{task.title}</h4>
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{task.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Умный Помощник</h2>
              <p className="text-xs text-primary-600">Всегда онлайн • Готов объяснять</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-100' : 'bg-primary-100'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-indigo-600" /> : <Bot size={16} className="text-primary-600" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className={`text-[10px] mt-2 block opacity-70 ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                 <Bot size={16} className="text-primary-600" />
               </div>
               <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                 <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спроси меня о чём-нибудь..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};