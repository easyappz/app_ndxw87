import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = '/';

const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [referenceId, setReferenceId] = useState('');
  const [referenceModel, setReferenceModel] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}api/access/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setPermissions(user.permissions);
    setReferenceId(user.referenceId || '');
    setReferenceModel(user.referenceModel || '');
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleReferenceModelChange = (event) => {
    setReferenceModel(event.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      // Update role
      await axios.put(`${API_URL}api/access/users/${selectedUser._id}/role`, { role });

      // Update permissions
      await axios.put(`${API_URL}api/access/users/${selectedUser._id}/permissions`, { permissions });

      // Update reference
      if (referenceId && referenceModel) {
        await axios.put(`${API_URL}api/access/users/${selectedUser._id}/reference`, { referenceId, referenceModel });
      }

      setUpdateSuccess(true);
      setUpdateLoading(false);

      // Refresh user list
      const response = await axios.get(`${API_URL}api/access/users`);
      setUsers(response.data);
    } catch (err) {
      setUpdateError('Failed to update user data. Please try again.');
      setUpdateLoading(false);
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon fontSize="large" />
        Access Control
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover onClick={() => handleUserSelect(user)} selected={selectedUser && selectedUser._id === user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => handleUserSelect(user)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {selectedUser && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit User: {selectedUser.email}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select value={role} onChange={handleRoleChange} label="Role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Reference ID"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              disabled={role === 'admin'}
            />

            <FormControl fullWidth margin="normal" disabled={role === 'admin'}>
              <InputLabel>Reference Model</InputLabel>
              <Select value={referenceModel} onChange={handleReferenceModelChange} label="Reference Model">
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
              </Select>
            </FormControl>

            {updateError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {updateError}
              </Alert>
            )}

            {updateSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                User data updated successfully!
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedUser(null)}
                disabled={updateLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AccessControl;
