import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import PendingApprovals from '../../components/admin/PendingApprovals';
import DepartmentQueues from '../../components/admin/DepartmentQueues';
import StaffDirectory from '../../components/admin/StaffDirectory';

export default function AdminDashboard() {
  
  // --- MOCK STATE ---
  
  const [stats, setStats] = useState({
    total: 342,
    completed: 215,
    waiting: 127,
    pendingUsers: 3
  });

  const [pendingUsers, setPendingUsers] = useState([
    { id: 1, name: 'Dr. Alan Grant', email: 'agrant@qmedix.com', role: 'Doctor', dept: 'Orthopedics' },
    { id: 2, name: 'Claire Dearing', email: 'cdearing@qmedix.com', role: 'Staff', dept: 'Front Desk' },
    { id: 3, name: 'Dr. Ellie Sattler', email: 'esattler@qmedix.com', role: 'Doctor', dept: 'Pediatrics' }
  ]);

  const [directory, setDirectory] = useState([
    { id: 101, name: 'Dr. Robert Smith', role: 'Doctor', dept: 'Cardiology', status: 'Active' },
    { id: 102, name: 'Dr. Sarah Jenkins', role: 'Doctor', dept: 'Pediatrics', status: 'Active' },
    { id: 103, name: 'Mark Johnson', role: 'Staff', dept: 'Front Desk', status: 'Offline' },
    { id: 104, name: 'Dr. Emily Chen', role: 'Doctor', dept: 'Neurology', status: 'Active' },
    { id: 105, name: 'Amanda Clarke', role: 'Staff', dept: 'Billing', status: 'Active' },
    { id: 106, name: 'James Wilson', role: 'Staff', dept: 'Front Desk', status: 'Active' },
  ]);

  const departmentsData = [
    {
      name: 'Cardiology',
      doctors: [
        { name: 'Dr. Robert Smith', status: 'Available', current: 'Q-42', waiting: 4 },
        { name: 'Dr. James Wilson', status: 'On Break', current: null, waiting: 7 }
      ]
    },
    {
      name: 'Pediatrics',
      doctors: [
        { name: 'Dr. Sarah Jenkins', status: 'Available', current: 'P-12', waiting: 2 }
      ]
    },
    {
      name: 'Neurology',
      doctors: [
        { name: 'Dr. Emily Chen', status: 'Available', current: 'N-08', waiting: 0 },
        { name: 'Dr. Lisa Cuddy', status: 'Available', current: 'N-09', waiting: 1 }
      ]
    }
  ];

  // --- ACTIONS ---

  const handleApprove = (id) => {
    const userToApprove = pendingUsers.find(u => u.id === id);
    if(userToApprove) {
      // Move them to the directory
      setDirectory([...directory, { ...userToApprove, status: 'Active', id: Date.now() }]);
      // Remove from pending
      setPendingUsers(pendingUsers.filter(u => u.id !== id));
      // Update Stats
      setStats(prev => ({ ...prev, pendingUsers: prev.pendingUsers - 1 }));
      alert(`Approved ${userToApprove.name}`);
    }
  };

  const handleReject = (id) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, pendingUsers: prev.pendingUsers - 1 }));
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <AdminHeader stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <PendingApprovals 
            pendingUsers={pendingUsers} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
          
          <StaffDirectory directory={directory} />
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <DepartmentQueues departments={departmentsData} />
        </div>

      </div>
    </div>
  );
}