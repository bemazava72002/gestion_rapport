import React, { useState } from 'react';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Robert Fox', type: 'Annual Leave', dates: 'Sep 12 - Sep 16, 2024', duration: '5 days', status: 'Pending' },
    { id: 2, name: 'Arlene McCoy', type: 'Sick Leave', dates: 'Aug 2 - Aug 9, 2024', duration: '8 days', status: 'Pending' },
    { id: 3, name: 'Brooklyn Simmons', type: 'Annual Leave', dates: 'Apr 18 - Apr 21, 2024', duration: '4 days', status: 'Pending' },
    { id: 4, name: 'Darlene Robertson', type: 'Annual Leave', dates: 'Apr 1 - Apr 4, 2024', duration: '4 days', status: 'Approved' },
    // Additional data...
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-green-100';
      case 'Pending':
        return 'bg-orange-500 text-orange-100';
      case 'Declined':
        return 'bg-red-500 text-red-100';
      default:
        return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Employee</th>
            <th className="p-2">Leave Type</th>
            <th className="p-2">Dates Requested</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id} className="border-b border-gray-700">
              <td className="p-2">{request.name}</td>
              <td className="p-2">{request.type}</td>
              <td className="p-2">{request.dates}</td>
              <td className="p-2">{request.duration}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full ${getStatusBadge(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td className="p-2">
                <ActionMenu />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ActionMenu = () => {
  return (
    <div className="relative inline-block text-left">
      <button className="flex items-center px-2 py-1 text-gray-200 hover:text-gray-400 focus:outline-none">
        &#8226;&#8226;&#8226;
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-10">
        <ul className="py-1">
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">Approve</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">Decline</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">Send Message</li>
        </ul>
      </div>
    </div>
  );
};

export default LeaveRequests;
