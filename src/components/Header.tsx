import React from 'react';
import type { TabType } from '../types/classroom';

interface HeaderProps {
  activeTab: TabType;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
          SmartClassroom v1.0
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mt-1">
          {activeTab === 'dashboard' && 'แดชบอร์ดภาพรวมห้องเรียน'}
          {activeTab === 'roster' && 'จัดการรายชื่อนักเรียน'}
          {activeTab === 'attendance' && 'เช็คชื่อเข้าชั้นเรียน'}
          {activeTab === 'behavior' && 'คะแนนความประพฤตินักเรียน'}
          {activeTab === 'grades' && 'สรุปคะแนนสอบและเกรดเฉลี่ย'}
        </h2>
      </div>

      <div className="text-right hidden sm:block">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
          ภาคเรียนที่ 1/2569
        </span>
      </div>
    </header>
  );
};
