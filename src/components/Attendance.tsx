import React from 'react';
import { Check } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';

export const Attendance: React.FC = () => {
  const { students, attendanceDate, setAttendanceDate, markAttendance, markAllPresent } = useClassroom();

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">เลือกวันที่เช็คชื่อ:</span>
          <input 
            type="date" 
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>

        <button 
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm cursor-pointer transition-colors w-full md:w-auto"
          onClick={markAllPresent}
        >
          <Check size={16} /> เช็คชื่อมาเรียนทั้งหมด
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="px-6 py-4 w-16">เลขที่</th>
                <th className="px-6 py-4">ชื่อ - นามสกุล</th>
                <th className="px-6 py-4 w-28 text-center">ชื่อเล่น</th>
                <th className="px-6 py-4 text-center w-[350px]">บันทึกสถานะการมาเรียน ({attendanceDate})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice().sort((a,b)=>a.no-b.no).map((s) => {
                const currentStatus = s.attendance[attendanceDate] || '';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold text-slate-500">{s.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <span className="text-2xl">{s.avatar}</span>
                      <span>{s.firstName} {s.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300 font-medium">{s.nickname}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900/60">
                        <button 
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${currentStatus === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                          onClick={() => markAttendance(s.id, 'present')}
                        >
                          มาเรียน
                        </button>
                        <button 
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${currentStatus === 'late' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                          onClick={() => markAttendance(s.id, 'late')}
                        >
                          สาย
                        </button>
                        <button 
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${currentStatus === 'absent' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                          onClick={() => markAttendance(s.id, 'absent')}
                        >
                          ขาด
                        </button>
                        <button 
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${currentStatus === 'sick' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                          onClick={() => markAttendance(s.id, 'sick')}
                        >
                          ลา
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
