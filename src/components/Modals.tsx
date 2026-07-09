import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Student } from '../types/classroom';
import { useClassroom } from '../context/ClassroomContext';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; nickname: string; gender: 'Male' | 'Female' }) => void;
  initialData?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setNickname(initialData.nickname);
      setGender(initialData.gender);
    } else {
      setFirstName('');
      setLastName('');
      setNickname('');
      setGender('Male');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, nickname, gender });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'แก้ไขข้อมูลส่วนตัวนักเรียน' : 'เพิ่มนักเรียนใหม่เข้าสู่ห้อง'}
          </h3>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">ชื่อจริง *</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">นามสกุล *</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">ชื่อเล่น *</label>
              <input 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">เพศ *</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              >
                <option value="Male">ชาย</option>
                <option value="Female">หญิง</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg text-sm font-semibold cursor-pointer" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold cursor-pointer">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
};


interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

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

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const totalDays = Object.keys(student.attendance).length;
  const presentDays = Object.values(student.attendance).filter(st => st === 'present' || st === 'late').length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  const lateCount = Object.values(student.attendance).filter(st => st === 'late').length;

  const totalScore = student.grades.assignments + student.grades.midterm + student.grades.final;
  const gradeDetail = calculateGrade(totalScore);

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">ข้อมูลประวัตินักเรียนและผลการประเมินรายบุคคล</h3>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Area */}
          <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/60">
            <span className="text-7xl mb-4">{student.avatar}</span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white text-center">
              {student.firstName} {student.lastName}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">ชื่อเล่น: {student.nickname}</p>
            
            <div className="w-full border-t border-slate-200/50 dark:border-slate-700/50 my-4"></div>
            
            <div className="w-full space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">เลขที่ชั้นเรียน</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">เลขที่ {student.no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">รหัสประจำตัว</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{student.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">เพศ</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{student.gender === 'Male' ? 'ชาย' : 'หญิง'}</span>
              </div>
            </div>
          </div>

          {/* Details Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-xs font-semibold text-slate-500 block">สถิติการมาเรียน</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">{attendancePct}%</span>
                <span className="text-[10px] text-slate-400 block mt-1">เช็คชื่อแล้ว {totalDays} วัน / มาสาย {lateCount} ครั้ง</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-xs font-semibold text-slate-500 block">คะแนนเก็บ & สอบรวม (100)</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2 block">{totalScore} คะแนน</span>
                <span className="text-[10px] text-slate-400 block mt-1">ระดับเกรด {gradeDetail.letter} ({gradeDetail.num.toFixed(1)})</span>
              </div>
            </div>

            {/* Behavior Logs */}
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">บันทึกพฤติกรรมความประพฤติรายบุคคล</h5>
              {student.behaviorLogs.length === 0 ? (
                <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs text-slate-500">
                  ไม่มีการบันทึกประวัติพฤติกรรมสำหรับนักเรียนคนนี้
                </div>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {student.behaviorLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800/40 text-xs">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{log.reason}</span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">{log.date}</span>
                      </div>
                      <span className={`font-bold ${log.type === 'plus' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {log.type === 'plus' ? '+' : ''}{log.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exam subscores */}
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">คะแนนผลสอบย่อย</h5>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-xs text-center">
                <div>
                  <span className="text-slate-400 block mb-1">คะแนนเก็บ (30)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{student.grades.assignments}</span>
                </div>
                <div className="border-x border-slate-200/50 dark:border-slate-750">
                  <span className="text-slate-400 block mb-1">กลางภาค (30)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{student.grades.midterm}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">ปลายภาค (40)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{student.grades.final}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold cursor-pointer"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};


interface BehaviorModalProps {
  student: Student | null;
  onClose: () => void;
}

export const BehaviorModal: React.FC<BehaviorModalProps> = ({ student, onClose }) => {
  const { adjustBehaviorScore } = useClassroom();
  const [points, setPoints] = useState(5);
  const [reason, setReason] = useState('ช่วยกวาดห้องเรียนหลังเลิกเรียน');
  const [actionType, setActionType] = useState<'plus' | 'minus'>('plus');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustBehaviorScore(student.id, points, reason, actionType);
    onClose();
    // reset defaults
    setPoints(5);
    setReason('ช่วยกวาดห้องเรียนหลังเลิกเรียน');
    setActionType('plus');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-semibold">ปรับแต้มคะแนนพฤติกรรม</h3>
            <p className="text-xs text-slate-500 mt-1">ของนักเรียน: {student.firstName} {student.lastName} (เลขที่ {student.no})</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">รูปแบบการปรับเปลี่ยน</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <button 
                type="button"
                className={`py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${actionType === 'plus' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'}`}
                onClick={() => {
                  setActionType('plus');
                  setReason('ช่วยกวาดห้องเรียนหลังเลิกเรียน');
                }}
              >
                เพิ่มคะแนนความดี (+)
              </button>
              <button 
                type="button"
                className={`py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${actionType === 'minus' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500'}`}
                onClick={() => {
                  setActionType('minus');
                  setReason('เข้าห้องเรียนสายโดยไม่มีสาเหตุ');
                }}
              >
                หักคะแนนพฤติกรรม (-)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">คะแนน (แต้ม)</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            >
              <option value="2">2 คะแนน</option>
              <option value="5">5 คะแนน</option>
              <option value="10">10 คะแนน</option>
              <option value="15">15 คะแนน</option>
              <option value="20">20 คะแนน</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">รายละเอียดความประพฤติ</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {actionType === 'plus' ? (
                <>
                  <option value="ช่วยกวาดห้องเรียนหลังเลิกเรียน">ช่วยกวาดห้องเรียนหลังเลิกเรียน</option>
                  <option value="ช่วยจัดบอร์ดวิชาการประจำสัปดาห์">ช่วยจัดบอร์ดวิชาการประจำสัปดาห์</option>
                  <option value="ตัวแทนโรงเรียนแข่งขันทักษะวิชาการ">ตัวแทนโรงเรียนแข่งขันทักษะวิชาการ</option>
                  <option value="ช่วยเหลืองานครูประจำชั้นเป็นพิเศษ">ช่วยเหลืองานครูประจำชั้นเป็นพิเศษ</option>
                  <option value="แสดงกิริยามารยาทดีงามและเคารพเชื่อฟัง">แสดงกิริยามารยาทดีงามและเคารพเชื่อฟัง</option>
                </>
              ) : (
                <>
                  <option value="เข้าห้องเรียนสายโดยไม่มีสาเหตุ">เข้าห้องเรียนสายโดยไม่มีสาเหตุ</option>
                  <option value="ใช้โทรศัพท์เล่นเกมระหว่างเรียน">ใช้โทรศัพท์เล่นเกมระหว่างเรียน</option>
                  <option value="แต่งกายไม่เรียบร้อย เสื้อออกนอกกางเกง">แต่งกายไม่เรียบร้อย เสื้อออกนอกกางเกง</option>
                  <option value="ไม่ส่งการบ้านและแบบฝึกหัดในเวลาที่กำหนด">ไม่ส่งการบ้านและแบบฝึกหัดในเวลาที่กำหนด</option>
                  <option value="ทะเลาะวิวาทหรือใช้ความก้าวร้าวต่อเพื่อน">ทะเลาะวิวาทหรือใช้ความก้าวร้าวต่อเพื่อน</option>
                </>
              )}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg text-sm font-semibold cursor-pointer" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold cursor-pointer">บันทึกแต้มพฤติกรรม</button>
          </div>
        </form>
      </div>
    </div>
  );
};
