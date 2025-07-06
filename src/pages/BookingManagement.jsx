"use client"

import React, { useState, useEffect } from "react"
import { API_BASE_URL } from "../config/api"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getVillaImage } from "../utils/villaImages"
import {
  CalendarDaysIcon,
  UserIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"

const BookingManagement = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetails, setShowDetails] = useState(null)
  const [sortField, setSortField] = useState("checkIn")
  const [sortDirection, setSortDirection] = useState("desc")
  const { authToken } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/search?checkIn=2020-01-01&checkOut=2030-12-31`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      addToast("Error fetching bookings", "error")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        addToast("Booking status updated successfully", "success")
        fetchBookings()
      } else {
        addToast("Error updating booking status", "error")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      addToast("Error updating booking status", "error")
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

  const getStatusColor = (status) => {
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

  const exportToCSV = () => {
    const headers = ["ID", "Villa", "Guest", "Email", "Check In", "Check Out", "Amount", "Status"]
    
    const csvData = filteredBookings.map(booking => [
      booking._id,
      booking.villaName,
      booking.guestName,
      booking.email,
      new Date(booking.checkIn).toLocaleDateString(),
      new Date(booking.checkOut).toLocaleDateString(),
      booking.totalAmount,
      booking.status
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortBookings = (bookings) => {
    return [...bookings].sort((a, b) => {
      let valueA, valueB
      
      switch (sortField) {
        case 'villaName':
          valueA = a.villaName
          valueB = b.villaName
          break
        case 'guestName':
          valueA = a.guestName
          valueB = b.guestName
          break
        case 'checkIn':
          valueA = new Date(a.checkIn)
          valueB = new Date(b.checkIn)
          break
        case 'totalAmount':
          valueA = a.totalAmount
          valueB = b.totalAmount
          break
        default:
          valueA = a[sortField]
          valueB = b[sortField]
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const filteredBookings = sortBookings(
    bookings.filter((booking) => {
      const matchesFilter = filter === "all" || booking.status === filter
      const matchesSearch =
        booking.villaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesFilter && matchesSearch
    })
  )

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage all villa bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by villa, guest or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('villaName')}
                >
                  <div className="flex items-center">
                    Villa
                    {sortField === 'villaName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('guestName')}
                >
                  <div className="flex items-center">
                    Guest
                    {sortField === 'guestName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('checkIn')}
                >
                  <div className="flex items-center">
                    Check In
                    {sortField === 'checkIn' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'totalAmount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
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
                    <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                    <div className="text-sm text-gray-500">to {formatDate(booking.checkOut)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{booking.totalAmount?.toLocaleString() || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowDetails(booking)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {booking.status !== "completed" && booking.status !== "cancelled" && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, "completed")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, "cancelled")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No bookings found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={getVillaImage(showDetails.villaName)} 
                      alt={showDetails.villaName} 
                      className="object-cover w-full h-64"
                    />
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-1">{showDetails.villaName}</h3>
                  <p className="text-gray-600 mb-4">{showDetails.location}</p>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">Booking Status</h4>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => {
                          updateBookingStatus(showDetails._id, "confirmed")
                          setShowDetails(null)
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          showDetails.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 ring-2 ring-green-600' 
                            : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                        }`}
                      >
                        Confirmed
                      </button>
                      <button 
                        onClick={() => {
                          updateBookingStatus(showDetails._id, "completed")
                          setShowDetails(null)
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          showDetails.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-600' 
                            : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                        }`}
                      >
                        Completed
                      </button>
                      <button 
                        onClick={() => {
                          updateBookingStatus(showDetails._id, "cancelled")
                          setShowDetails(null)
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          showDetails.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800 ring-2 ring-red-600' 
                            : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                        }`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Booking Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="text-gray-900 font-medium">{showDetails._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest:</span>
                      <span className="text-gray-900 font-medium">{showDetails.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900 font-medium">{showDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900 font-medium">{showDetails.phone || 'Not provided'}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 my-3"></div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900 font-medium">{formatDate(showDetails.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900 font-medium">{formatDate(showDetails.checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="text-gray-900 font-medium">{showDetails.guests || 'Not specified'}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 my-3"></div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${showDetails.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {showDetails.isPaid ? 'Paid' : 'Not Paid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900 font-medium">{showDetails.paymentMethod || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-800">Total Amount:</span>
                      <span className="text-gray-900">₹{showDetails.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
