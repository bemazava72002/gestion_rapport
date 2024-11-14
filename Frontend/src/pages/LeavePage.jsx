import React from 'react';
import LeaveRequests from './../components/LeaveRequests';

const LeavePage = ()=> {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl mb-6">Leave Management</h1>
      <LeaveRequests />
    </div>
  );
}

export default LeavePage;
