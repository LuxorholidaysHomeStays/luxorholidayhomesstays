import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Villas', href: '/villas', icon: BuildingOfficeIcon },
    { name: 'Bookings', href: '/bookings', icon: CalendarDaysIcon },
    { name: 'Manual Booking', href: '/manual-booking', icon: CalendarDaysIcon },
    { name: 'Cancel Requests', href: '/cancel-requests', icon: ExclamationTriangleIcon },
    { name: 'Amenities', href: '/amenities', icon: SparklesIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Phone Users', href: '/phone-users', icon: UsersIcon },
    { name: 'User Profiles', href: '/user-profiles', icon: UserCircleIcon },
    { name: 'Newsletter', href: '/newsletter', icon: EnvelopeIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Luxor Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => {
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-yellow-50 text-yellow-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-yellow-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar - adjusted to stay within footer boundaries */}
      <div 
        className="hidden lg:fixed lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200" 
        style={{ 
          top: '80px', 
          bottom: '150px', // Increased bottom margin to accommodate footer
          maxHeight: 'calc(100vh - 230px)', // Ensures sidebar doesn't exceed viewport height minus navbar and footer
          overflowY: 'auto'
        }}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Luxor Admin</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-yellow-50 text-yellow-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-yellow-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    }
                  >
                    <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content - adjusted to accommodate fixed navbar */}
      <div className="lg:pl-64 flex flex-col flex-1 pt-16">
        {/* Top bar */}
        <div className="sticky top-[80px] z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <span className="text-lg font-semibold text-gray-900">
                      {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user?.name || 'Admin'}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-32"> {/* Increased padding at bottom for footer */}
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
