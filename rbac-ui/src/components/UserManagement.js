import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editUser, setEditUser] = useState(null); // User to edit
  const [openEdit, setOpenEdit] = useState(false); // Edit dialog state
  const [newUser, setNewUser] = useState({ name: "", role: "", status: "" }); // New user data
  const [openAdd, setOpenAdd] = useState(false); // Add dialog state

  // Fetch users and roles on component mount
  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => setUsers(response.data));
    axios.get("http://localhost:3001/roles").then((response) => setRoles(response.data));
  }, []);

  // Open and close dialogs
  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setEditUser(null);
    setOpenEdit(false);
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setNewUser({ name: "", role: "", status: "" });
    setOpenAdd(false);
  };

  // Save changes after editing
  const handleSaveEdit = () => {
    if (editUser) {
      axios.put(`http://localhost:3001/users/${editUser.id}`, editUser).then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editUser.id ? editUser : user))
        );
        handleEditClose();
      });
    }
  };

  // Add new user
  const handleAddUser = () => {
    if (newUser.name && newUser.role && newUser.status) {
      const newUserId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const userToAdd = { ...newUser, id: newUserId };
      axios.post("http://localhost:3001/users", userToAdd).then(() => {
        setUsers([...users, userToAdd]);
        handleAddClose();
      });
    }
  };

  // Delete user
  const handleDelete = (userId) => {
    axios.delete(`http://localhost:3001/users/${userId}`).then(() => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    });
  };

  return (
    <div>
      <h2>User Management</h2>
      {/* Add User Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        style={{ marginBottom: "10px" }}
      >
        Add User
      </Button>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      {editUser && (
        <Dialog open={openEdit} onClose={handleEditClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              value={editUser.name}
              disabled
              style={{ marginBottom: "10px" }}
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              value={editUser.status}
              onChange={(e) =>
                setEditUser({ ...editUser, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add User Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            select
            label="Role"
            fullWidth
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{ marginBottom: "10px" }}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            fullWidth
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserManagement;
