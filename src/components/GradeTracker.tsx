import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';


const calculateGrade = (total: number) => {
  if (total >= 80) return { num: 4.0, letter: "A", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" };
  if (total >= 75) return { num: 3.5, letter: "B+", color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" };
  if (total >= 70) return { num: 3.0, letter: "B", color: "text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/30" };
  if (total >= 65) return { num: 2.5, letter: "C+", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" };
  if (total >= 60) return { num: 2.0, letter: "C", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30" };
  if (total >= 55) return { num: 1.5, letter: "D+", color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30" };
  if (total >= 50) return { num: 1.0, letter: "D", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" };
  return { num: 0.0, letter: "F", color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30" };
};

export const GradeTracker: React.FC = () => {
  const { students, updateGradeScore } = useClassroom();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const fullName = `${s.firstName} ${s.lastName} ${s.nickname}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    }).sort((a, b) => a.no - b.no);
  }, [students, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">กรอกคะแนนสะสมและระดับเกรด</h4>
          <p className="text-xs text-slate-500 mt-1">คะแนนเก็บ (30 คะแนน) + กลางภาค (30 คะแนน) + ปลายภาค (40 คะแนน) รวมทั้งหมด 100 คะแนน</p>
        </div>

        <div className="w-full md:w-80 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักเรียน..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800/55 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="px-6 py-4 w-16">เลขที่</th>
                <th className="px-6 py-4">ชื่อ - นามสกุล</th>
                <th className="px-6 py-4 w-28 text-center">คะแนนเก็บ (30)</th>
                <th className="px-6 py-4 w-28 text-center">กลางภาค (30)</th>
                <th className="px-6 py-4 w-28 text-center">ปลายภาค (40)</th>
                <th className="px-6 py-4 w-28 text-center">รวม (100)</th>
                <th className="px-6 py-4 w-24 text-center">ผลการเรียน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => {
                const totalScore = s.grades.assignments + s.grades.midterm + s.grades.final;
                const gradeDetail = calculateGrade(totalScore);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold text-slate-500">{s.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <span className="text-2xl">{s.avatar}</span>
                      <span>{s.firstName} {s.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        max="30"
                        min="0"
                        className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold"
                        value={s.grades.assignments}
                        onChange={(e) => updateGradeScore(s.id, 'assignments', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        max="30"
                        min="0"
                        className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold"
                        value={s.grades.midterm}
                        onChange={(e) => updateGradeScore(s.id, 'midterm', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        max="40"
                        min="0"
                        className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold"
                        value={s.grades.final}
                        onChange={(e) => updateGradeScore(s.id, 'final', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white text-base">
                      {totalScore}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold px-3 py-1 rounded-md text-sm border border-current ${gradeDetail.color}`}>
                        {gradeDetail.letter} ({gradeDetail.num.toFixed(1)})
                      </span>
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
