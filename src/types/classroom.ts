export interface BehaviorLog {
  id: string;
  date: string;
  score: number;
  reason: string;
  type: 'plus' | 'minus';
}

export interface Grades {
  assignments: number;
  midterm: number;
  final: number;
}

export interface AttendanceMap {
  [date: string]: 'present' | 'late' | 'absent' | 'sick';
}

export interface Student {
  id: string;
  no: number;
  firstName: string;
  lastName: string;
  nickname: string;
  gender: 'Male' | 'Female';
  avatar: string;
  behaviorScore: number;
  behaviorLogs: BehaviorLog[];
  grades: Grades;
  attendance: AttendanceMap;
}

export type TabType = 'dashboard' | 'roster' | 'attendance' | 'behavior' | 'grades';
