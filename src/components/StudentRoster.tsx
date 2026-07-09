import React, { useState, useMemo } from 'react';
import { Search, Plus, Info, Edit2, Trash2 } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import type { Student } from '../types/classroom';

interface StudentRosterProps {
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onAdd: () => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({ onViewDetails, onEdit, onAdd }) => {
  const { students, deleteStudent } = useClassroom();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName} ${s.nickname}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === 'All' ? true : s.gender === genderFilter;
      return matchesSearch && matchesGender;
    }).sort((a, b) => a.no - b.no);
  }, [students, searchQuery, genderFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm("คุณต้องการลบข้อมูลนักเรียนรายนี้ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="w-full md:w-96 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, ชื่อเล่น หรือรหัสนักเรียน..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800/55 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800/55 text-sm flex-grow md:flex-grow-0"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as 'All' | 'Male' | 'Female')}
          >
            <option value="All">ทุกเพศ</option>
            <option value="Male">ชาย</option>
            <option value="Female">หญิง</option>
          </select>

          <button 
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm cursor-pointer"
            onClick={onAdd}
          >
            <Plus size={18} /> เพิ่มนักเรียนใหม่
          </button>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          <p className="text-slate-500 dark:text-slate-400">ไม่พบรายชื่อนักเรียนตามคำค้นหาที่กำหนด</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="px-6 py-4 w-16">เลขที่</th>
                  <th className="px-6 py-4 w-32">รหัสประจำตัว</th>
                  <th className="px-6 py-4">ชื่อ - นามสกุล</th>
                  <th className="px-6 py-4 w-28">ชื่อเล่น</th>
                  <th className="px-6 py-4 w-24">เพศ</th>
                  <th className="px-6 py-4 w-32 text-center">คะแนนพฤติกรรม</th>
                  <th className="px-6 py-4 w-36 text-center">จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold text-slate-500">{s.no}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-400">{s.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <span className="text-2xl">{s.avatar}</span>
                      <span>{s.firstName} {s.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{s.nickname}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.gender === 'Male' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'}`}>
                        {s.gender === 'Male' ? 'ชาย' : 'หญิง'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded text-sm ${s.behaviorScore >= 90 ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30' : s.behaviorScore >= 70 ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'}`}>
                        {s.behaviorScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          title="ดูประวัติและผลการเรียน"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded cursor-pointer transition-colors"
                          onClick={() => onViewDetails(s)}
                        >
                          <Info size={16} />
                        </button>
                        <button 
                          title="แก้ไขประวัติ"
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded cursor-pointer transition-colors"
                          onClick={() => onEdit(s)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          title="ลบออกจากห้องเรียน"
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 rounded cursor-pointer transition-colors"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
