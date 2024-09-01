import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

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
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <form onSubmit={handlePasswordSubmit}>
                <TextField
                  type="password"
                  name="oldPassword"
                  label="Old Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  type="password"
                  name="newPassword"
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Change Password
                </Button>
              </form>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Add New User
              </Typography>
              <form onSubmit={handleNewUserSubmit}>
                <TextField
                  type="text"
                  name="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newUserData.username}
                  onChange={handleNewUserChange}
                />
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newUserData.password}
                  onChange={handleNewUserChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewUserChange}
                    variant="outlined"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Add User
                </Button>
              </form>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
