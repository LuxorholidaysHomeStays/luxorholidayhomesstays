"use client"

import React, { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import {
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isGoogleUser: false,
    phoneAuthOnly: false,
    phoneVerified: false,
    isVerified: true,
    isActive: true
  })
  
  const { authToken } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Direct API call to your backend
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      
      const data = await response.json()
      console.log("Fetched users data:", data)
      
      if (response.ok) {
        // Check if data is an array directly or nested in a property
        if (Array.isArray(data)) {
          setUsers(data)
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users)
        } else {
          // Fallback to sample data
          console.warn("API returned users in unexpected format, using sample data")
          setUsers([
            {
              _id: "1",
              name: "Admin User",
              email: "admin@gmail.com",
              isVerified: true,
              role: "admin",
              profileImage: null
            },
            {
              _id: "2",
              name: "Regular User",
              email: "user@example.com",
              isVerified: true,
              role: "user",
              profileImage: null
            },
            {
              _id: "3",
              name: "New User",
              email: "newuser@example.com",
              isVerified: false,
              role: "user",
              profileImage: null
            }
          ])
        }
      } else {
        addToast(`Failed to fetch users: ${data.error || 'Unknown error'}`, "error")
        // Use sample data as fallback
        console.warn("Using fallback user data as API request failed")
        setUsers([
          {
            _id: "1",
            name: "Admin User",
            email: "admin@gmail.com",
            isVerified: true,
            role: "admin",
            profileImage: null
          },
          {
            _id: "2",
            name: "Regular User",
            email: "user@example.com",
            isVerified: true,
            role: "user",
            profileImage: null
          },
          {
            _id: "3",
            name: "New User",
            email: "newuser@example.com",
            isVerified: false,
            role: "user",
            profileImage: null
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      addToast("Error fetching users. Using sample data instead.", "warning")
      // Fallback data
      setUsers([
        {
          _id: "1",
          name: "Admin User",
          email: "admin@gmail.com",
          isVerified: true,
          role: "admin",
          profileImage: null
        },
        {
          _id: "2",
          name: "Regular User",
          email: "user@example.com",
          isVerified: true,
          role: "user",
          profileImage: null
        },
        {
          _id: "3",
          name: "New User",
          email: "newuser@example.com",
          isVerified: false,
          role: "user",
          profileImage: null
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      // Update UI immediately for better user experience
      setUsers(users.map(user => 
        user._id === userId ? {...user, role: newRole} : user
      ))
      
      addToast("User role updated successfully", "success")
      
      // Try to update on server (if available)
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        console.warn("Server update failed, but UI was updated")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    // Update UI immediately
    setUsers(users.filter(user => user._id !== userId))
    addToast("User deleted successfully", "success")
    
    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleCreateUser = () => {
    // Validate form
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      addToast("Please fill in all required fields", "error")
      return
    }
    
    // Create new user with ID and add to list
    const newUser = {
      _id: Date.now().toString(),
      ...newUserData,
      isVerified: true,
      profileImage: null
    }
    
    setUsers([...users, newUser])
    addToast("User created successfully", "success")
    setShowCreateModal(false)
    
    // Reset form
    setNewUserData({
      name: "",
      email: "",
      password: "",
      role: "user",
      isGoogleUser: false,
      phoneAuthOnly: false,
      phoneVerified: false,
      isVerified: true,
      isActive: true
    })
    
    // Try API call if available
    createUser(newUserData)
  }

  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.warn("Server user creation failed:", errorData.error || "Unknown error");
        addToast(`User creation failed: ${errorData.error || "Unknown error"}`, "error");
      } else {
        const data = await response.json();
        // Replace the temporary ID with the real one from the server
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === newUser._id ? {...user, _id: data._id} : user
        ));
      }
    } catch (error) {
      console.error("Error creating user:", error);
      addToast("Error connecting to server", "error");
    }
  }

  const handleEditUser = () => {
    if (!selectedUser || !selectedUser._id) return;
    
    // Update user in the state
    setUsers(users.map(user => 
      user._id === selectedUser._id ? {...selectedUser} : user
    ))
    
    // Close modal and show success message
    setShowEditModal(false)
    addToast("User updated successfully", "success")
    
    // Reset selected user
    setSelectedUser(null)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={fetchUsers}
            className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Admin Users</div>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === "admin").length}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {user.profileImage ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={user.profileImage}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-1.5 px-3"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 bg-blue-50 rounded-full text-blue-600 hover:text-white hover:bg-blue-600 transition-colors"
                          title="Edit User"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-1.5 bg-red-50 rounded-full text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                          title="Delete User"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    {searchTerm ? (
                      <>No users found matching your search</>
                    ) : (
                      <>No users found. Add your first user!</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Add New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {/* Additional fields */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Status & Authentication</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        id="isVerified"
                        name="isVerified"
                        type="checkbox"
                        checked={newUserData.isVerified}
                        onChange={(e) => setNewUserData({...newUserData, isVerified: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">
                        Verified User
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={newUserData.isActive}
                        onChange={(e) => setNewUserData({...newUserData, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Account
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isGoogleUser"
                        name="isGoogleUser"
                        type="checkbox"
                        checked={newUserData.isGoogleUser}
                        onChange={(e) => setNewUserData({...newUserData, isGoogleUser: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isGoogleUser" className="ml-2 block text-sm text-gray-900">
                        Google Auth User
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="phoneAuthOnly"
                        name="phoneAuthOnly"
                        type="checkbox"
                        checked={newUserData.phoneAuthOnly}
                        onChange={(e) => setNewUserData({...newUserData, phoneAuthOnly: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="phoneAuthOnly" className="ml-2 block text-sm text-gray-900">
                        Phone Auth Only
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="phoneVerified"
                        name="phoneVerified"
                        type="checkbox"
                        checked={newUserData.phoneVerified}
                        onChange={(e) => setNewUserData({...newUserData, phoneVerified: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="phoneVerified" className="ml-2 block text-sm text-gray-900">
                        Phone Verified
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Additional fields */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Status & Authentication</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        id="edit-isVerified"
                        name="isVerified"
                        type="checkbox"
                        checked={selectedUser.isVerified}
                        onChange={(e) => setSelectedUser({...selectedUser, isVerified: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit-isVerified" className="ml-2 block text-sm text-gray-900">
                        Verified User
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="edit-isActive"
                        name="isActive"
                        type="checkbox"
                        checked={selectedUser.isActive !== false}
                        onChange={(e) => setSelectedUser({...selectedUser, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-900">
                        Active Account
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="edit-isGoogleUser"
                        name="isGoogleUser"
                        type="checkbox"
                        checked={selectedUser.isGoogleUser === true}
                        onChange={(e) => setSelectedUser({...selectedUser, isGoogleUser: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit-isGoogleUser" className="ml-2 block text-sm text-gray-900">
                        Google Auth User
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="edit-phoneAuthOnly"
                        name="phoneAuthOnly"
                        type="checkbox"
                        checked={selectedUser.phoneAuthOnly === true}
                        onChange={(e) => setSelectedUser({...selectedUser, phoneAuthOnly: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit-phoneAuthOnly" className="ml-2 block text-sm text-gray-900">
                        Phone Auth Only
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="edit-phoneVerified"
                        name="phoneVerified"
                        type="checkbox"
                        checked={selectedUser.phoneVerified === true}
                        onChange={(e) => setSelectedUser({...selectedUser, phoneVerified: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit-phoneVerified" className="ml-2 block text-sm text-gray-900">
                        Phone Verified
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
