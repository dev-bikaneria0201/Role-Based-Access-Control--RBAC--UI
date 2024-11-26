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
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState(null); // Role being edited
  const [openEdit, setOpenEdit] = useState(false); // Edit dialog state
  const [newRole, setNewRole] = useState({ name: "", permissions: [] }); // New role data
  const [openAdd, setOpenAdd] = useState(false); // Add dialog state

  const permissionsList = ["Read", "Write", "Delete"]; // Default permissions

  // Fetch roles from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // Open Add Role Dialog
  const handleAddClick = () => setOpenAdd(true);
  const handleAddClose = () => {
    setNewRole({ name: "", permissions: [] });
    setOpenAdd(false);
  };

  // Add a new role
  const handleAddRole = () => {
    if (newRole.name) {
      const newRoleId =
        roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
      const roleToAdd = { ...newRole, id: newRoleId };

      axios
        .post("http://localhost:3001/roles", roleToAdd)
        .then(() => {
          setRoles((prevRoles) => [...prevRoles, roleToAdd]);
          handleAddClose();
        })
        .catch((error) => {
          console.error("Error adding role:", error);
        });
    }
  };

  // Open Edit Role Dialog
  const handleEditClick = (role) => {
    setEditRole({ ...role });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setEditRole(null);
    setOpenEdit(false);
  };

  // Save edited role
  const handleSaveEdit = () => {
    if (editRole) {
      axios
        .put(`http://localhost:3001/roles/${editRole.id}`, editRole)
        .then(() => {
          setRoles((prevRoles) =>
            prevRoles.map((role) => (role.id === editRole.id ? editRole : role))
          );
          handleEditClose();
        })
        .catch((error) => {
          console.error("Error updating role:", error);
        });
    }
  };

  // Delete role
  const handleDelete = (roleId) => {
    axios
      .delete(`http://localhost:3001/roles/${roleId}`)
      .then(() => {
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
      });
  };

  // Toggle permissions for a role
  const togglePermission = (role, permission) => {
    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter((perm) => perm !== permission)
      : [...role.permissions, permission];
    return updatedPermissions;
  };

  return (
    <div>
      <h2>Role Management</h2>
      {/* Add Role Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        style={{ marginBottom: "10px" }}
      >
        Add Role
      </Button>

      {/* Roles Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(", ")}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(role)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(role.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Role Dialog */}
      {editRole && (
        <Dialog open={openEdit} onClose={handleEditClose}>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogContent>
            <TextField
              label="Role Name"
              fullWidth
              value={editRole.name}
              onChange={(e) =>
                setEditRole({ ...editRole, name: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
            {/* Display permissions dynamically */}
            {permissionsList.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={editRole.permissions.includes(permission)}
                    onChange={() =>
                      setEditRole({
                        ...editRole,
                        permissions: togglePermission(editRole, permission),
                      })
                    }
                  />
                }
                label={permission}
              />
            ))}
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

      {/* Add Role Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          {/* Display permissions dynamically */}
          {permissionsList.map((permission) => (
            <FormControlLabel
              key={permission}
              control={
                <Checkbox
                  checked={newRole.permissions.includes(permission)}
                  onChange={() =>
                    setNewRole({
                      ...newRole,
                      permissions: togglePermission(newRole, permission),
                    })
                  }
                />
              }
              label={permission}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddRole} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RoleManagement;
