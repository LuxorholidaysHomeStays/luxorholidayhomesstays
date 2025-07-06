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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVillas: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)
  const { authToken } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      }

      // Fetch villas
      const villasResponse = await fetch(`${API_BASE_URL}/api/villas`, { headers })
      const villasData = await villasResponse.json()

      // Fetch bookings
      const bookingsResponse = await fetch(
        `${API_BASE_URL}/api/bookings/search?checkIn=2020-01-01&checkOut=2030-12-31`,
        { headers },
      )
      const bookingsData = await bookingsResponse.json()

      // Fetch users (if endpoint is available)
      let usersCount = 0
      try {
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`, { headers })
        const usersData = await usersResponse.json()
        usersCount = Array.isArray(usersData) ? usersData.length : 0
      } catch (error) {
        console.error("Error fetching users:", error)
      }

      // Calculate stats
      const totalRevenue = Array.isArray(bookingsData)
        ? bookingsData.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
        : 0

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
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      addToast("Failed to load dashboard data", "error")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={fetchDashboardData}
            className="bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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
            <Link to="/villas" className="text-blue-600 text-sm font-medium hover:underline">
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
            <Link to="/bookings" className="text-green-600 text-sm font-medium hover:underline">
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
            <Link to="/users" className="text-purple-600 text-sm font-medium hover:underline">
              View all users
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md border border-amber-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-amber-600 font-medium uppercase">Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <CurrencyRupeeIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 text-sm font-medium">12% from last month</span>
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
            <Link to="/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
