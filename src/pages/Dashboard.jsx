"use client"

import React, { useState, useEffect } from "react"
import { API_BASE_URL } from "../config/api"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getVillaImage } from "../utils/villaImages"
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import { Tab } from '@headlessui/react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Pie, Bar, Doughnut, Line, Radar, PolarArea } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVillas: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState({
    today: 0,
    last7Days: 0,
    last30Days: 0,
    last90Days: 0,
    thisYear: 0,
    lastYear: 0,
    total: 0,
  });
  const [revenueByVilla, setRevenueByVilla] = useState({});
  const [bookingsByStatus, setBookingsByStatus] = useState({});
  const [bookingsByMonth, setBookingsByMonth] = useState({});
  const [selectedTimeRange, setSelectedTimeRange] = useState('total');
  const [villaOccupancyRate, setVillaOccupancyRate] = useState({});
  const [bookingsByVilla, setBookingsByVilla] = useState({});
  
  const { authToken, user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      // Fetch villas
      const villasResponse = await fetch(`${API_BASE_URL}/api/villas`, { headers });
      const villasData = await villasResponse.json();

      // Fetch bookings
      const bookingsResponse = await fetch(
        `${API_BASE_URL}/api/bookings/search?checkIn=2020-01-01&checkOut=2030-12-31`,
        { headers },
      );
      const bookingsData = await bookingsResponse.json();

      // Fetch users (if endpoint is available)
      let usersCount = 0;
      try {
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`, { headers });
        const usersData = await usersResponse.json();
        usersCount = Array.isArray(usersData) ? usersData.length : 0;
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      // Calculate date ranges
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      const last90Days = new Date(today);
      last90Days.setDate(today.getDate() - 90);
      const thisYearStart = new Date(now.getFullYear(), 0, 1);
      const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);

      // Calculate revenue for different time periods
      let todayRevenue = 0;
      let last7DaysRevenue = 0;
      let last30DaysRevenue = 0;
      let last90DaysRevenue = 0;
      let thisYearRevenue = 0;
      let lastYearRevenue = 0;
      let totalRevenue = 0;
      
      // Revenue by villa and booking status counts
      const revenueByVillaData = {};
      const bookingStatusCounts = {
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        pending: 0
      };
      
      // Initialize monthly bookings data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyBookings = months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});
      
      // Villa occupancy tracking
      const villaOccupancy = {};
      const villaBookingDays = {};
      
      // Initialize villa booking counts
      const villaBookingCounts = {};

      if (Array.isArray(bookingsData)) {
        bookingsData.forEach(booking => {
          const bookingDate = new Date(booking.bookingDate || booking.createdAt);
          const amount = booking.totalAmount || 0;
          
          // Count booking statuses
          if (booking.status in bookingStatusCounts) {
            bookingStatusCounts[booking.status]++;
          }
          
          // Track revenue by villa
          if (booking.villaName) {
            if (!revenueByVillaData[booking.villaName]) {
              revenueByVillaData[booking.villaName] = 0;
            }
            revenueByVillaData[booking.villaName] += amount;
            
            // Track booking days for each villa
            if (!villaBookingDays[booking.villaName]) {
              villaBookingDays[booking.villaName] = 0;
            }
            
            // Calculate days booked
            if (booking.status !== 'cancelled') {
              const checkIn = new Date(booking.checkIn);
              const checkOut = new Date(booking.checkOut);
              const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
              villaBookingDays[booking.villaName] += days;
            }
          }
          
          // Count bookings by villa
          if (booking.villaName) {
            villaBookingCounts[booking.villaName] = (villaBookingCounts[booking.villaName] || 0) + 1;
          }
          
          // Track monthly bookings
          const monthName = months[bookingDate.getMonth()];
          monthlyBookings[monthName]++;
          
          // Add to total revenue
          totalRevenue += amount;
          
          // Check if booking was made today
          if (bookingDate >= today) {
            todayRevenue += amount;
          }
          
          // Last 7 days
          if (bookingDate >= last7Days) {
            last7DaysRevenue += amount;
          }
          
          // Last 30 days
          if (bookingDate >= last30Days) {
            last30DaysRevenue += amount;
          }
          
          // Last 90 days
          if (bookingDate >= last90Days) {
            last90DaysRevenue += amount;
          }
          
          // This year
          if (bookingDate >= thisYearStart) {
            thisYearRevenue += amount;
          }
          
          // Last year
          if (bookingDate >= lastYearStart && bookingDate <= lastYearEnd) {
            lastYearRevenue += amount;
          }
        });
      }

      // Calculate occupancy rates (approx. based on days booked in the past year)
      const daysInYear = 365;
      if (Array.isArray(villasData)) {
        villasData.forEach(villa => {
          const villaName = villa.name;
          const daysBooked = villaBookingDays[villaName] || 0;
          villaOccupancy[villaName] = Math.min(100, Math.round((daysBooked / daysInYear) * 100));
        });
      }

      setRevenueStats({
        today: todayRevenue,
        last7Days: last7DaysRevenue,
        last30Days: last30DaysRevenue,
        last90Days: last90DaysRevenue,
        thisYear: thisYearRevenue,
        lastYear: lastYearRevenue,
        total: totalRevenue
      });
      
      setRevenueByVilla(revenueByVillaData);
      setBookingsByStatus(bookingStatusCounts);
      setBookingsByMonth(monthlyBookings);
      setVillaOccupancyRate(villaOccupancy);
      setBookingsByVilla(villaBookingCounts);

      setStats({
        totalVillas: Array.isArray(villasData) ? villasData.length : 0,
        totalBookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
        totalUsers: usersCount,
        totalRevenue,
        recentBookings: Array.isArray(bookingsData) 
          ? bookingsData
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5) 
          : [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Prepare data for pie chart
  const bookingStatusData = {
    labels: ['Confirmed', 'Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        data: [
          bookingsByStatus.confirmed || 0,
          bookingsByStatus.completed || 0, 
          bookingsByStatus.cancelled || 0, 
          bookingsByStatus.pending || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for doughnut chart (villa occupancy)
  const occupancyData = {
    labels: Object.keys(villaOccupancyRate).slice(0, 5),
    datasets: [
      {
        data: Object.values(villaOccupancyRate).slice(0, 5),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for villa revenue bar chart
  const villaRevenueData = {
    labels: Object.keys(revenueByVilla).slice(0, 5),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(revenueByVilla).slice(0, 5),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for booking trend line chart
  const bookingTrendData = {
    labels: Object.keys(bookingsByMonth),
    datasets: [
      {
        label: 'Bookings',
        data: Object.values(bookingsByMonth),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Get revenue based on selected time range
  const getRevenueByTimeRange = () => {
    switch (selectedTimeRange) {
      case 'today':
        return revenueStats.today;
      case 'last7Days':
        return revenueStats.last7Days;
      case 'last30Days':
        return revenueStats.last30Days;
      case 'last90Days':
        return revenueStats.last90Days;
      case 'thisYear':
        return revenueStats.thisYear;
      case 'lastYear':
        return revenueStats.lastYear;
      default:
        return revenueStats.total;
    }
  };

  // Get time range label
  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case 'today':
        return 'Today';
      case 'last7Days':
        return 'Last 7 Days';
      case 'last30Days':
        return 'Last 30 Days';
      case 'last90Days':
        return 'Last 90 Days';
      case 'thisYear':
        return 'This Year';
      case 'lastYear':
        return 'Last Year';
      default:
        return 'Total';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
     
      <div className="space-y-8">
     
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome, {user?.name || "Administrator"}</h2>
              <p className="text-amber-100">Dashboard Overview</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="bg-white text-amber-600 px-4 py-2 rounded-md border border-amber-400 hover:bg-amber-50 transition-colors"
              >
                Refresh Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-600 font-medium uppercase">Total Villas</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalVillas}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/villa-management" className="text-blue-600 text-sm font-medium hover:underline">
                View all villas
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-600 font-medium uppercase">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <CalendarDaysIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/booking-management" className="text-green-600 text-sm font-medium hover:underline">
                Manage bookings
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-600 font-medium uppercase">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/user-management" className="text-purple-600 text-sm font-medium hover:underline">
                View all users
              </Link>
            </div>
          </div>

          {/* Revenue card with time range selector */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md border border-amber-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-amber-600 font-medium uppercase">Revenue ({getTimeRangeLabel()})</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{getRevenueByTimeRange().toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <CurrencyRupeeIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            
            <div className="mt-4">
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm text-amber-800"
              >
                <option value="total">Total Revenue</option>
                <option value="today">Today</option>
                <option value="last7Days">Last 7 Days</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="last90Days">Last 90 Days</option>
                <option value="thisYear">This Year</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts section - first row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Villa Booking Distribution (Pie Chart) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Villa Booking Distribution</h2>
            </div>
            <div className="p-4 h-80">
              <Pie 
                data={{
                  labels: Object.keys(bookingsByVilla),
                  datasets: [
                    {
                      data: Object.values(bookingsByVilla),
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',   // Blue
                        'rgba(16, 185, 129, 0.7)',   // Green
                        'rgba(245, 158, 11, 0.7)',   // Amber
                        'rgba(99, 102, 241, 0.7)',   // Indigo
                        'rgba(236, 72, 153, 0.7)',   // Pink
                        'rgba(139, 92, 246, 0.7)',   // Purple
                        'rgba(220, 38, 38, 0.7)',    // Red
                      ],
                      borderColor: [
                        'rgba(59, 130, 246, 1)',     // Blue
                        'rgba(16, 185, 129, 1)',     // Green
                        'rgba(245, 158, 11, 1)',     // Amber
                        'rgba(99, 102, 241, 1)',     // Indigo
                        'rgba(236, 72, 153, 1)',     // Pink
                        'rgba(139, 92, 246, 1)',     // Purple
                        'rgba(220, 38, 38, 1)',      // Red
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} bookings (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />

            </div>

          </div>
       


          {/* Top Villas by Revenue */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Top Villas by Revenue</h2>
            </div>
            <div className="p-4 h-80">
              <Bar 
                data={villaRevenueData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Revenue by Villa (Top 5)',
                      font: { size: 14 }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '₹' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Charts section - second row */}
        <div className="grid grid-cols-1 gap-8">
          {/* Monthly Booking Trends (Line Chart) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Booking Trends</h2>
            </div>
            <div className="p-4 h-80">
              <Line 
                data={bookingTrendData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Villa
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img 
                              className="h-16 w-16 rounded-md object-cover"
                              src={getVillaImage(booking.villaName)} 
                              alt={booking.villaName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.villaName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</div>
                        <div className="text-sm text-gray-500">
                          {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.totalAmount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.recentBookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link to="/admin/booking-management" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default Dashboard;
