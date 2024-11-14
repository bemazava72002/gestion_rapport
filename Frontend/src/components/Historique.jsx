import React, { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';
const AdminLogs = () => {
  

  return (
    <div>
      <h2>Notifications des Actions des Utilisateurs</h2>
      <ToastContainer />
    </div>
  );
};

export default AdminLogs;
