import React, { useState } from 'react';
import { BookOpen, FileQuestion, Download, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateLessonPlan, generateQuiz } from '../services/geminiService';
import { DashboardStats } from './DashboardStats';
import { UserRole } from '../types';

type Tab = 'lesson' | 'quiz';

export const TeacherView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('lesson');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form States
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('9 Класс');
  const [details, setDetails] = useState(''); // Duration for lesson, count for quiz

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      let response;
      if (activeTab === 'lesson') {
        response = await generateLessonPlan(topic, grade, details || '45 минут');
      } else {
        response = await generateQuiz(topic, 'Medium', parseInt(details) || 5);
      }
      setResult(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] gap-6 p-6 max-w-7xl mx-auto">
      
      {/* Left Column: Controls & Dashboard */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto pb-4 scrollbar-hide">
        <DashboardStats role={UserRole.TEACHER} />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Генератор Контента
          </h3>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => { setActiveTab('lesson'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'lesson' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen size={16} />
              Урок
            </button>
            <button
              onClick={() => { setActiveTab('quiz'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'quiz' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileQuestion size={16} />
              Тест
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тема</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={activeTab === 'lesson' ? "Например: Великая Французская Революция" : "Например: Тригонометрические функции"}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Уровень</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                >
                  {[5, 6, 7, 8, 9, 10, 11].map(g => (
                    <option key={g} value={`${g} Класс`}>{g} Класс</option>
                  ))}
                  <option value="Университет">ВУЗ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'lesson' ? 'Длительность' : 'Кол-во вопросов'}
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={activeTab === 'lesson' ? "45 мин" : "10"}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-3 mt-2 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Думаю...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Сгенерировать
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h4 className="font-semibold text-gray-700">Предварительный просмотр</h4>
          {result && (
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {result ? (
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Download size={32} className="opacity-50" />
              </div>
              <p>Заполните форму слева, чтобы создать контент</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};