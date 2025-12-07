import React, { useState } from 'react';
import { LogOut, GraduationCap, School } from 'lucide-react';
import { UserRole } from './types';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';

function App() {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(UserRole.NONE);
  };

  // Login Screen
  if (userRole === UserRole.NONE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Добро пожаловать в EduGenius</h1>
            <p className="text-gray-500">Выберите вашу роль, чтобы начать обучение или работу</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div 
              onClick={() => handleLogin(UserRole.STUDENT)}
              className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Я Ученик</h2>
              <p className="text-gray-500 mb-6">Получи доступ к ИИ-репетитору, персональным заданиям и отслеживай свой прогресс.</p>
              <span className="text-indigo-600 font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Войти как ученик &rarr;
              </span>
            </div>

            {/* Teacher Card */}
            <div 
              onClick={() => handleLogin(UserRole.TEACHER)}
              className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-teal-100 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <School className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Я Учитель</h2>
              <p className="text-gray-500 mb-6">Создавай планы уроков, генерируй тесты и анализируй успеваемость классов.</p>
              <span className="text-teal-600 font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Войти как учитель &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userRole === UserRole.STUDENT ? 'bg-indigo-600' : 'bg-teal-600'}`}>
              {userRole === UserRole.STUDENT ? <GraduationCap className="text-white" /> : <School className="text-white" />}
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">EduGenius</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {userRole === UserRole.STUDENT ? 'Кабинет Ученика' : 'Кабинет Учителя'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userRole === UserRole.STUDENT ? 'Алексей Иванов' : 'Мария Петрова'}
                </p>
                <p className="text-xs text-gray-500">
                  {userRole === UserRole.STUDENT ? '9 "Б" Класс' : 'Преподаватель Истории'}
                </p>
             </div>
             <div className="h-8 w-px bg-gray-200 hidden md:block" />
             <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Выйти"
             >
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="pt-2">
        {userRole === UserRole.STUDENT ? <StudentView /> : <TeacherView />}
      </main>
    </div>
  );
}

export default App;