import React, { useState } from "react";
import ProfileDropdown from "./Profile";
import NotificationsDropdown from "./Notification";


const TestNavbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Coding Market</div>
      <div className="flex items-center space-x-4">
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default TestNavbar;
