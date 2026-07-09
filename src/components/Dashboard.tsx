import React, { useMemo } from 'react';
import { Users, Calendar, Award, GraduationCap } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';


const calculateGrade = (total: number) => {
  if (total >= 80) return { num: 4.0, letter: "A" };
  if (total >= 75) return { num: 3.5, letter: "B+" };
  if (total >= 70) return { num: 3.0, letter: "B" };
  if (total >= 65) return { num: 2.5, letter: "C+" };
  if (total >= 60) return { num: 2.0, letter: "C" };
  if (total >= 55) return { num: 1.5, letter: "D+" };
  if (total >= 50) return { num: 1.0, letter: "D" };
  return { num: 0.0, letter: "F" };
};

export const Dashboard: React.FC = () => {
  const { students, attendanceDate } = useClassroom();

  const stats = useMemo(() => {
    // Attendance rates
    let presentCount = 0, lateCount = 0, absentCount = 0, sickCount = 0;
    let activeAttendanceCount = 0;

    students.forEach(s => {
      const status = s.attendance[attendanceDate];
      if (status) {
        activeAttendanceCount++;
        if (status === 'present') presentCount++;
        else if (status === 'late') lateCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'sick') sickCount++;
      }
    });

    const attendanceRate = activeAttendanceCount > 0 
      ? Math.round(((presentCount + lateCount * 0.5) / activeAttendanceCount) * 100) 
      : 0;

    const avgBehavior = students.length > 0
      ? Math.round(students.reduce((acc, curr) => acc + curr.behaviorScore, 0) / students.length)
      : 100;
      
    const boysCount = students.filter(s => s.gender === 'Male').length;
    const girlsCount = students.filter(s => s.gender === 'Female').length;

    // GPA and Grades Summary
    let totalGradePoints = 0;
    const gradeRanges = { 'A (4.0)': 0, 'B/B+ (3-3.5)': 0, 'C/C+ (2-2.5)': 0, 'D/D+ (1-1.5)': 0, 'F (0)': 0 };

    students.forEach(s => {
      const totalScore = s.grades.assignments + s.grades.midterm + s.grades.final;
      const gradeDetail = calculateGrade(totalScore);
      totalGradePoints += gradeDetail.num;

      if (gradeDetail.num === 4.0) gradeRanges['A (4.0)']++;
      else if (gradeDetail.num >= 3.0) gradeRanges['B/B+ (3-3.5)']++;
      else if (gradeDetail.num >= 2.0) gradeRanges['C/C+ (2-2.5)']++;
      else if (gradeDetail.num >= 1.0) gradeRanges['D/D+ (1-1.5)']++;
      else gradeRanges['F (0)']++;
    });
    
    const averageGPA = students.length > 0
      ? (totalGradePoints / students.length).toFixed(2)
      : "0.00";

    // Recent behavior logs
    const recentLogs: Array<{ studentName: string; no: number; id: string; date: string; score: number; reason: string; type: 'plus' | 'minus' }> = [];
    students.forEach(s => {
      s.behaviorLogs.forEach(log => {
        recentLogs.push({
          studentName: `${s.firstName} (${s.nickname})`,
          no: s.no,
          ...log
        });
      });
    });
    const sortedRecentLogs = recentLogs.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

    return {
      presentCount,
      lateCount,
      absentCount,
      sickCount,
      activeAttendanceCount,
      attendanceRate,
      avgBehavior,
      boysCount,
      girlsCount,
      gradeRanges,
      averageGPA,
      sortedRecentLogs
    };
  }, [students, attendanceDate]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">นักเรียนทั้งหมด</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{students.length} คน</h3>
            <div className="mt-1 flex gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-blue-500 font-semibold">ชาย {stats.boysCount}</span>
              <span>|</span>
              <span className="text-rose-500 font-semibold">หญิง {stats.girlsCount}</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">เข้าเรียนวันนี้ ({attendanceDate})</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{stats.attendanceRate}%</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              มาเรียน {stats.presentCount + stats.lateCount} / ขาด {stats.absentCount} / ลา {stats.sickCount} คน
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Calendar size={24} />
          </div>
        </div>

        {/* Behavior average */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">คะแนนพฤติกรรมเฉลี่ย</p>
            <h3 className={`mt-2 text-3xl font-bold tracking-tight ${stats.avgBehavior >= 90 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-500'}`}>{stats.avgBehavior} คะแนน</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">เริ่มต้น 100 คะแนน/คน</p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
            <Award size={24} />
          </div>
        </div>

        {/* Average GPA */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">คะแนนเฉลี่ยสะสม (GPA)</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-pink-600 dark:text-pink-400">{stats.averageGPA}</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ประเมินจากวิชาหลัก (เต็ม 4.0)</p>
          </div>
          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
            <GraduationCap size={24} />
          </div>
        </div>
      </div>

      {/* Charts and Attendance status details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 lg:col-span-2">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-6">กราฟวิเคราะห์ผลการเรียนระดับห้องเรียน</h4>
          
          <div className="flex items-end justify-between h-48 pt-4 pb-2 px-4 gap-4">
            {Object.entries(stats.gradeRanges).map(([gradeName, count]) => {
              const maxVal = Math.max(...Object.values(stats.gradeRanges)) || 1;
              const heightPercent = `${(count / maxVal) * 100}%`;
              return (
                <div key={gradeName} className="flex-grow flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                    {count} คน
                  </div>
                  {/* Bar */}
                  <div 
                    style={{ height: heightPercent }} 
                    className="w-full max-w-[40px] rounded-t-lg bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm"
                  ></div>
                  {/* Label */}
                  <span className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 text-center truncate w-full">{gradeName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance progress bars */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-6">สถิติการมาเรียนรายวัน</h4>
          <div className="space-y-4">
            {/* Present Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">มาเรียนปกติ</span>
                <span>{stats.presentCount} คน ({stats.activeAttendanceCount > 0 ? Math.round((stats.presentCount/stats.activeAttendanceCount)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: stats.activeAttendanceCount > 0 ? `${(stats.presentCount/stats.activeAttendanceCount)*100}%` : '0%' }}></div>
              </div>
            </div>

            {/* Late Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-500">เข้าเรียนสาย</span>
                <span>{stats.lateCount} คน ({stats.activeAttendanceCount > 0 ? Math.round((stats.lateCount/stats.activeAttendanceCount)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: stats.activeAttendanceCount > 0 ? `${(stats.lateCount/stats.activeAttendanceCount)*100}%` : '0%' }}></div>
              </div>
            </div>

            {/* Absent Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-500">ขาดเรียน</span>
                <span>{stats.absentCount} คน ({stats.activeAttendanceCount > 0 ? Math.round((stats.absentCount/stats.activeAttendanceCount)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: stats.activeAttendanceCount > 0 ? `${(stats.absentCount/stats.activeAttendanceCount)*100}%` : '0%' }}></div>
              </div>
            </div>

            {/* Sick Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-500">ลากิจ/ลาป่วย</span>
                <span>{stats.sickCount} คน ({stats.activeAttendanceCount > 0 ? Math.round((stats.sickCount/stats.activeAttendanceCount)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: stats.activeAttendanceCount > 0 ? `${(stats.sickCount/stats.activeAttendanceCount)*100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent behavior transactions list */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">ประวัติการบันทึกคะแนนความประพฤติล่าสุด</h4>
        {stats.sortedRecentLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500">ไม่มีการบันทึกประวัติความประพฤติล่าสุด</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5">วันที่</th>
                  <th className="py-2.5">ชื่อนักเรียน</th>
                  <th className="py-2.5">รายละเอียดความประพฤติ</th>
                  <th className="py-2.5 text-right">คะแนน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.sortedRecentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 text-slate-500 font-medium">{log.date}</td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      เลขที่ {log.no} - {log.studentName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{log.reason}</td>
                    <td className="py-3 text-right">
                      <span className={`font-bold ${log.type === 'plus' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {log.type === 'plus' ? '+' : ''}{log.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
