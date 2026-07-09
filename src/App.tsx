import { useState } from 'react';
import { ClassroomProvider, useClassroom } from './context/ClassroomContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentRoster } from './components/StudentRoster';
import { Attendance } from './components/Attendance';
import { BehaviorTracker } from './components/BehaviorTracker';
import { GradeTracker } from './components/GradeTracker';
import { StudentFormModal, StudentDetailModal, BehaviorModal } from './components/Modals';
import type { TabType, Student } from './types/classroom';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [behaviorModalStudent, setBehaviorModalStudent] = useState<Student | null>(null);

  const { addStudent, editStudent } = useClassroom();

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleFormSubmit = (data: { firstName: string; lastName: string; nickname: string; gender: 'Male' | 'Female' }) => {
    if (editingStudent) {
      editStudent({
        ...editingStudent,
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname,
        gender: data.gender,
        avatar: data.gender === 'Male' ? '👦' : '👧'
      });
    } else {
      addStudent(data);
    }
    setIsAddEditModalOpen(false);
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <Header activeTab={activeTab} />

        {/* Tab panels */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'roster' && (
          <StudentRoster 
            onViewDetails={setViewingStudent}
            onEdit={handleOpenEdit}
            onAdd={handleOpenAdd}
          />
        )}
        {activeTab === 'attendance' && <Attendance />}
        {activeTab === 'behavior' && (
          <BehaviorTracker onManagePoints={setBehaviorModalStudent} />
        )}
        {activeTab === 'grades' && <GradeTracker />}
      </main>

      {/* Modals */}
      <StudentFormModal 
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
      />

      <StudentDetailModal 
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />

      <BehaviorModal 
        student={behaviorModalStudent}
        onClose={() => setBehaviorModalStudent(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClassroomProvider>
      <MainAppContent />
    </ClassroomProvider>
  );
}
