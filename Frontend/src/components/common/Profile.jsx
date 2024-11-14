import React, { useState } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
        <img src="profile_pic.png" alt="profile" className="w-8 h-8 rounded-full" />
        <span className="ml-2">John Alex</span>
        <i className="fas fa-chevron-down ml-2"></i>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-100"><i className="fas fa-user-alt mr-2"></i>Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100"><i className="fas fa-map-marker mr-2"></i>Address</li>
            <li className="px-4 py-2 hover:bg-gray-100"><i className="fas fa-cog mr-2"></i>Settings</li>
            <li className="px-4 py-2 hover:bg-gray-100"><i className="fas fa-sign-out-alt mr-2"></i>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
