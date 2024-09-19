import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';


const UserManagement = () => {
  const [user, setUser] = useState({ name: '', email: '', mobile: '' });
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]); // State for deleted users
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({ name: '', email: '', mobile: '' });
  const [view, setView] = useState('users'); // State to toggle between 'users' and 'deletedUsers'
  const baseUrl = "https://user-client-qmvw.onrender.com"

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/getuser`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/users/adduser`, user);
      setUsers([...users, response.data]);
      setUser({ name: '', email: '', mobile: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = (name) => {
    const userToDelete = users.find((u) => u.name === name);
    setUsers(users.filter((u) => u.name !== name));
    setDeletedUsers([...deletedUsers, userToDelete]); // Move to deleted users
  };

  const handleRestoreUser = (name) => {
    const userToRestore = deletedUsers.find((u) => u.name === name);
    setDeletedUsers(deletedUsers.filter((u) => u.name !== name));
    setUsers([...users, userToRestore]); 
  };

  const handleEditUser = async (id) => {
    try {
      const response = await axios.patch(`${baseUrl}/api/users/getuser/${id}`, editUser);
      setUsers(users.map((u) => (u._id === id ? response.data : u)));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user._id);
    setEditUser({ name: user.name, email: user.email, mobile: user.mobile });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevEditUser) => ({
      ...prevEditUser,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleViewChange = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="user-management">

      {/* Buttons to toggle between User and Deleted User */}
      <div className="view-buttons">
        <button onClick={() => handleViewChange('users')} className={view === 'users' ? 'active' : ''}>
          Users
        </button>
        <button onClick={() => handleViewChange('deletedUsers')} className={view === 'deletedUsers' ? 'active' : ''}>
          Deleted Users
        </button>
      </div>

      {/* Conditionally render based on selected view */}
      {view === 'users' ? (
        <>
          {/* Add New User Form */}
          <form onSubmit={handleAddUser} className="user-form">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              required
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
            />
            <input
              type="tel"
              name="mobile"
              value={user.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              required
            />
            <button type="submit" className="btn-primary">
              Add New User
            </button>
          </form>

          {/* User Table */}
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingUserId === user._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editUser.name}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editUser.email}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="tel"
                          name="mobile"
                          value={editUser.mobile}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleEditUser(user._id)} className="btn-save">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="btn-cancel">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>
                        <button onClick={() => handleStartEdit(user)} className="btn-edit">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteUser(user.name)} className="btn-delete">
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Deleted Users Table */}
          <h3>Deleted Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <button onClick={() => handleRestoreUser(user.name)} className="btn-restore">
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserManagement;
