import React from 'react';
import { LayoutDashboard, Users, Calendar, Award, GraduationCap, Sun, Moon } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import type { TabType } from '../types/classroom';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { isDarkMode, setIsDarkMode } = useClassroom();

  const menuItems = [
    { id: 'dashboard' as TabType, name: 'แดชบอร์ดสรุปผล', icon: LayoutDashboard },
    { id: 'roster' as TabType, name: 'รายชื่อนักเรียน', icon: Users },
    { id: 'attendance' as TabType, name: 'บันทึกเวลาเรียน', icon: Calendar },
    { id: 'behavior' as TabType, name: 'คะแนนพฤติกรรม', icon: Award },
    { id: 'grades' as TabType, name: 'บันทึกคะแนนสอบ', icon: GraduationCap },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col shrink-0">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            SC
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-none">SmartClassroom</h1>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">ระบบบริหารจัดการชั้นเรียน</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-950/60">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">ห้องเรียน ม.5/1</p>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">ครูประจำชั้น: อ.วิสุทธิ์ ใจดี</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <span>ธีมแสดงผล</span>
          {isDarkMode ? (
            <div className="flex items-center gap-1 text-amber-400">
              <Sun size={16} /> <span>สว่าง</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-600">
              <Moon size={16} /> <span>มืด</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
