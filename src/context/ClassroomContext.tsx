import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Grades, BehaviorLog } from '../types/classroom';

interface ClassroomContextType {
  students: Student[];
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  addStudent: (studentData: { firstName: string; lastName: string; nickname: string; gender: 'Male' | 'Female' }) => void;
  editStudent: (updatedStudent: Student) => void;
  deleteStudent: (id: string) => void;
  markAttendance: (studentId: string, status: 'present' | 'late' | 'absent' | 'sick') => void;
  markAllPresent: () => void;
  adjustBehaviorScore: (studentId: string, points: number, reason: string, actionType: 'plus' | 'minus') => void;
  updateGradeScore: (studentId: string, examKey: keyof Grades, score: number) => void;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

const initialStudents: Student[] = [
  {
    id: "M50101",
    no: 1,
    firstName: "กิตติภพ",
    lastName: "รุ่งเรือง",
    nickname: "กิต",
    gender: "Male",
    avatar: "👦",
    behaviorScore: 100,
    behaviorLogs: [
      { id: "b1", date: "2026-07-06", score: 5, reason: "ช่วยกวาดห้องเรียนหลังเลิกเรียน", type: "plus" },
      { id: "b2", date: "2026-07-08", score: -5, reason: "เข้าห้องเรียนสายโดยไม่มีสาเหตุ", type: "minus" }
    ],
    grades: { assignments: 26, midterm: 22, final: 32 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "late",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50102",
    no: 2,
    firstName: "ณัฐวุฒิ",
    lastName: "สมบูรณ์",
    nickname: "นนท์",
    gender: "Male",
    avatar: "👦",
    behaviorScore: 105,
    behaviorLogs: [
      { id: "b3", date: "2026-07-07", score: 5, reason: "ช่วยจัดบอร์ดวิชาการประจำสัปดาห์", type: "plus" }
    ],
    grades: { assignments: 28, midterm: 25, final: 35 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50103",
    no: 3,
    firstName: "ธนกร",
    lastName: "ศิริวัฒน์",
    nickname: "พีท",
    gender: "Male",
    avatar: "👨‍🎓",
    behaviorScore: 95,
    behaviorLogs: [
      { id: "b4", date: "2026-07-08", score: -5, reason: "คุยเสียงดังรบกวนสมาธิเพื่อนร่วมชั้น", type: "minus" }
    ],
    grades: { assignments: 22, midterm: 18, final: 28 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "absent",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50104",
    no: 4,
    firstName: "ปกรณ์",
    lastName: "สุขดี",
    nickname: "บาส",
    gender: "Male",
    avatar: "👦",
    behaviorScore: 100,
    behaviorLogs: [],
    grades: { assignments: 25, midterm: 20, final: 30 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50105",
    no: 5,
    firstName: "กุลธิดา",
    lastName: "แก้วมณี",
    nickname: "ดาว",
    gender: "Female",
    avatar: "👩‍🎓",
    behaviorScore: 110,
    behaviorLogs: [
      { id: "b5", date: "2026-07-06", score: 10, reason: "ตัวแทนโรงเรียนแข่งขันทักษะวิชาการคณิตศาสตร์", type: "plus" }
    ],
    grades: { assignments: 29, midterm: 28, final: 37 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50106",
    no: 6,
    firstName: "ชลลดา",
    lastName: "บุญส่ง",
    nickname: "น้ำ",
    gender: "Female",
    avatar: "👧",
    behaviorScore: 85,
    behaviorLogs: [
      { id: "b6", date: "2026-07-07", score: -10, reason: "ไม่ส่งงานวิชาฟิสิกส์ 2 ครั้งติดต่อกัน", type: "minus" },
      { id: "b7", date: "2026-07-09", score: -5, reason: "หนีเวรทำความสะอาดห้องเรียน", type: "minus" }
    ],
    grades: { assignments: 15, midterm: 14, final: 20 },
    attendance: {
      "2026-07-06": "sick",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "late"
    }
  },
  {
    id: "M50107",
    no: 7,
    firstName: "ธัญญารัตน์",
    lastName: "ดีพร้อม",
    nickname: "หมิว",
    gender: "Female",
    avatar: "👧",
    behaviorScore: 100,
    behaviorLogs: [],
    grades: { assignments: 24, midterm: 21, final: 29 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50108",
    no: 8,
    firstName: "พิมพิศา",
    lastName: "เจริญยิ่ง",
    nickname: "แพร",
    gender: "Female",
    avatar: "👩‍🎓",
    behaviorScore: 105,
    behaviorLogs: [
      { id: "b8", date: "2026-07-08", score: 5, reason: "ช่วยเก็บเงินห้องส่งครูบรรณารักษ์", type: "plus" }
    ],
    grades: { assignments: 27, midterm: 26, final: 34 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50109",
    no: 9,
    firstName: "วรวุฒิ",
    lastName: "สิทธิชัย",
    nickname: "เบียร์",
    gender: "Male",
    avatar: "👦",
    behaviorScore: 90,
    behaviorLogs: [
      { id: "b9", date: "2026-07-07", score: -10, reason: "ใช้โทรศัพท์เล่นเกมระหว่างเรียน", type: "minus" }
    ],
    grades: { assignments: 20, midterm: 16, final: 22 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "late",
      "2026-07-09": "absent"
    }
  },
  {
    id: "M50110",
    no: 10,
    firstName: "อนงค์นาถ",
    lastName: "รักชาติ",
    nickname: "ก้อย",
    gender: "Female",
    avatar: "👧",
    behaviorScore: 100,
    behaviorLogs: [],
    grades: { assignments: 25, midterm: 20, final: 26 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50111",
    no: 11,
    firstName: "อนิรุธ",
    lastName: "ปัญญาดี",
    nickname: "ตูน",
    gender: "Male",
    avatar: "👦",
    behaviorScore: 95,
    behaviorLogs: [
      { id: "b10", date: "2026-07-08", score: -5, reason: "แต่งกายไม่เรียบร้อย เสื้อออกนอกกางเกง", type: "minus" }
    ],
    grades: { assignments: 18, midterm: 17, final: 25 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  },
  {
    id: "M50112",
    no: 12,
    firstName: "อุมาพร",
    lastName: "แสงทอง",
    nickname: "ฝน",
    gender: "Female",
    avatar: "👧",
    behaviorScore: 102,
    behaviorLogs: [
      { id: "b11", date: "2026-07-09", score: 2, reason: "ช่วยเก็บกวาดเศษขยะในคาบศิลปะ", type: "plus" }
    ],
    grades: { assignments: 28, midterm: 23, final: 31 },
    attendance: {
      "2026-07-06": "present",
      "2026-07-07": "present",
      "2026-07-08": "present",
      "2026-07-09": "present"
    }
  }
];

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('classroom_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const localDark = localStorage.getItem('classroom_dark_mode');
    return localDark === 'true';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('classroom_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('classroom_students', JSON.stringify(students));
  }, [students]);

  const addStudent = (studentData: { firstName: string; lastName: string; nickname: string; gender: 'Male' | 'Female' }) => {
    const nextNo = students.length > 0 ? Math.max(...students.map(s => s.no)) + 1 : 1;
    const newStudent: Student = {
      id: `M501${String(nextNo).padStart(2, '0')}`,
      no: nextNo,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      nickname: studentData.nickname,
      gender: studentData.gender,
      avatar: studentData.gender === 'Male' ? '👦' : '👧',
      behaviorScore: 100,
      behaviorLogs: [],
      grades: { assignments: 0, midterm: 0, final: 0 },
      attendance: {}
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const editStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, no: idx + 1 }));
    });
  };

  const markAttendance = (studentId: string, status: 'present' | 'late' | 'absent' | 'sick') => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          attendance: { ...s.attendance, [attendanceDate]: status }
        };
      }
      return s;
    }));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({
      ...s,
      attendance: { ...s.attendance, [attendanceDate]: 'present' }
    })));
  };

  const adjustBehaviorScore = (studentId: string, points: number, reason: string, actionType: 'plus' | 'minus') => {
    const finalChange = actionType === 'plus' ? points : -points;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newLog: BehaviorLog = {
          id: 'b_' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          score: finalChange,
          reason,
          type: actionType
        };
        return {
          ...s,
          behaviorScore: s.behaviorScore + finalChange,
          behaviorLogs: [newLog, ...s.behaviorLogs]
        };
      }
      return s;
    }));
  };

  const updateGradeScore = (studentId: string, examKey: keyof Grades, score: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const maxScore = examKey === 'final' ? 40 : 30;
        const parsedScore = Math.min(maxScore, Math.max(0, score));
        return {
          ...s,
          grades: {
            ...s.grades,
            [examKey]: parsedScore
          }
        };
      }
      return s;
    }));
  };

  return (
    <ClassroomContext.Provider value={{
      students,
      attendanceDate,
      setAttendanceDate,
      isDarkMode,
      setIsDarkMode,
      addStudent,
      editStudent,
      deleteStudent,
      markAttendance,
      markAllPresent,
      adjustBehaviorScore,
      updateGradeScore
    }}>
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (context === undefined) {
    throw new Error('useClassroom must be used within a ClassroomProvider');
  }
  return context;
};
