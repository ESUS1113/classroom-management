import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import type { Student } from '../types/classroom';

interface BehaviorTrackerProps {
  onManagePoints: (student: Student) => void;
}

export const BehaviorTracker: React.FC<BehaviorTrackerProps> = ({ onManagePoints }) => {
  const { students } = useClassroom();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName} ${s.nickname}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    }).sort((a, b) => a.no - b.no);
  }, [students, searchQuery]);

  const allLogs = useMemo(() => {
    return students.flatMap(s => s.behaviorLogs.map(l => ({ ...l, studentName: `${s.firstName} (${s.nickname})` })))
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [students]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side: Student list with scores */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <span className="text-slate-400"><Search size={18} /></span>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักเรียนเพื่อจัดการคะแนน..." 
            className="w-full border-none focus:outline-none bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="px-6 py-4 w-16">เลขที่</th>
                  <th className="px-6 py-4">ชื่อ - นามสกุล</th>
                  <th className="px-6 py-4 w-32 text-center">คะแนนพฤติกรรม</th>
                  <th className="px-6 py-4 w-40 text-center">ดำเนินการบันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold text-slate-500">{s.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <span className="text-2xl">{s.avatar}</span>
                      <span>{s.firstName} {s.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold px-2.5 py-0.5 rounded text-sm ${s.behaviorScore >= 90 ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30' : s.behaviorScore >= 70 ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'}`}>
                        {s.behaviorScore} คะแนน
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:hover:bg-indigo-950 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                        onClick={() => onManagePoints(s)}
                      >
                        ปรับปรุงคะแนน
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right side: Points guides & log */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">พฤติกรรมความประพฤติอ้างอิง</h4>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/60">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">ช่วยเหลือผู้อื่น / มีจิตอาสา</span>
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">+5 หรือ +10</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/60">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">ตัวแทนโรงเรียนแข่งวิชาการ</span>
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">+10</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/60">
              <span className="text-xs font-semibold text-rose-800 dark:text-rose-400">เข้าห้องเรียนสายบ่อยครั้ง</span>
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-5</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/60">
              <span className="text-xs font-semibold text-rose-800 dark:text-rose-400">พฤติกรรมก้าวร้าว / ทะเลาะวิวาท</span>
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-10 หรือ -20</span>
            </div>
          </div>
        </div>

        {/* Behavior Audit Trail */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">ประวัติการปรับแต้มความประพฤติ (Log)</h4>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {allLogs.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">ไม่มีการบันทึกประวัติความประพฤติ</div>
            ) : (
              allLogs.map(log => (
                <div key={log.id} className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-start justify-between text-xs last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{log.studentName}</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{log.reason}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{log.date}</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded ${log.type === 'plus' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
                    {log.type === 'plus' ? '+' : ''}{log.score}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
