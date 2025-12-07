import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserRole } from '../types';

interface DashboardStatsProps {
  role: UserRole;
}

const studentData = [
  { name: 'Математика', progress: 85, color: '#6366f1' },
  { name: 'Физика', progress: 65, color: '#ec4899' },
  { name: 'История', progress: 90, color: '#14b8a6' },
  { name: 'Химия', progress: 40, color: '#f59e0b' },
];

const teacherData = [
  { name: '9 "А"', progress: 78, color: '#6366f1' },
  { name: '10 "Б"', progress: 82, color: '#ec4899' },
  { name: '11 "В"', progress: 91, color: '#14b8a6' },
  { name: '8 "Г"', progress: 64, color: '#f59e0b' },
];

export const DashboardStats: React.FC<DashboardStatsProps> = ({ role }) => {
  const data = role === UserRole.STUDENT ? studentData : teacherData;
  const title = role === UserRole.STUDENT ? "Мой прогресс" : "Успеваемость классов";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              hide 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-xl">
          <p className="text-xs text-blue-600 font-medium uppercase">Задания</p>
          <p className="text-xl font-bold text-blue-800">{role === UserRole.STUDENT ? '12/15' : '45'}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl">
          <p className="text-xs text-purple-600 font-medium uppercase">Ср. Балл</p>
          <p className="text-xl font-bold text-purple-800">{role === UserRole.STUDENT ? '4.8' : '4.2'}</p>
        </div>
      </div>
    </div>
  );
};