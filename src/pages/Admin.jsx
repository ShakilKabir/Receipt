// src/pages/AdminPage.js
import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [newUserData, setNewUserData] = useState({ username: '', password: '', role: 'user' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/change-password', { ...passwordData }); // Use actual userId
      toast.success(response.data.message);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response.data.error || 'Password change failed');
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', newUserData);
      toast.success(response.data.message);
      setNewUserData({ username: '', password: '', role: 'user' });
    } catch (error) {
      toast.error(error.response.data.error || 'User registration failed');
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <button type="submit">Change Password</button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Add New User</h2>
        <form onSubmit={handleNewUserSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUserData.username}
            onChange={handleNewUserChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUserData.password}
            onChange={handleNewUserChange}
          />
          <select
            name="role"
            value={newUserData.role}
            onChange={handleNewUserChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
