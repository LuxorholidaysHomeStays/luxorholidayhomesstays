import React, { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { getVillaImage } from "../../utils/villaImages"
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
    fetchBookings();

    const interval = setInterval(() => {
      setBookings(currentBookings =>
        currentBookings.map(booking => {
          if (isBookingExpired(booking)) {
            // Mark as expired locally for immediate UI update
            // Backend call to update status will happen if not already done
            if (booking.status !== "expired") {
              return { ...booking, status: "expired" };
            }
          }
          return booking;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      const bookingList = Array.isArray(data) ? data : (data.bookings || data.data || []);
      setBookings(bookingList)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      addToast("Error fetching bookings", "error")
    } finally {
      setLoading(false)
    }
  }

  // Update the updateBookingStatus function for better error handling and confirmation
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // For cancellations, we need to provide additional information
      if (newStatus === "cancelled" && !window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
        return; // User cancelled the action
      }
      
      setLoading(true);
      
      const endpoint = newStatus === "cancelled" 
        ? `${API_BASE_URL}/api/bookings/${bookingId}/cancel` 
        : `${API_BASE_URL}/api/admin/bookings/${bookingId}`;
      
      const method = newStatus === "cancelled" ? "POST" : "PUT";
      const body = newStatus === "cancelled" 
        ? JSON.stringify({ reason: "Cancelled by administrator" }) 
        : JSON.stringify({ status: newStatus });
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: body
      });

      const data = await response.json();

      if (response.ok) {
        addToast(`Booking ${newStatus === "cancelled" ? "cancelled" : "status updated"} successfully`, "success");
        fetchBookings(); // Refresh the bookings list
      } else {
        throw new Error(data.error || data.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      addToast(error.message || "Error updating booking status", "error");
    } finally {
      setLoading(false);
    }
  }

  const isBookingExpired = (booking) => {
    // A pending booking expires if its check-in date is in the past
    // or if it has been pending for more than a reasonable time (e.g., 30 minutes for manual bookings)
    // For simplicity, we'll check if check-in date is in the past for now.
    // More complex logic can be added later (e.g., based on a 'pendingSince' timestamp)
    
    if (booking.status === "pending") {
      const checkInDate = new Date(booking.checkIn);
      const now = new Date();
      return checkInDate < now;
    }
    return false;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case "expired":
        return <XCircleIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Villa", "Guest", "Email", "Check In", "Check Out", "Amount", "Status"]
    
    const csvData = filteredBookings.map(booking => [
      booking.id || booking._id,
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
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
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
              {filteredBookings.map((booking) => {
                const isSelected = showDetails && (showDetails.id === booking.id || showDetails._id === booking._id)
                return (
                  <React.Fragment key={booking.id || booking._id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-yellow-50/50' : ''}`}>
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
                            onClick={() => setShowDetails(isSelected ? null : booking)}
                            className={`px-3 py-1 rounded font-medium transition-colors ${
                              isSelected 
                                ? 'bg-yellow-600 text-white' 
                                : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                            }`}
                          >
                            {isSelected ? 'Hide' : 'View'}
                          </button>
                          {booking.status !== "completed" && booking.status !== "cancelled" && (
                            <button
                              onClick={() => updateBookingStatus(booking.id || booking._id, "completed")}
                              disabled={loading}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Processing..." : "Complete"}
                            </button>
                          )}
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => updateBookingStatus(booking.id || booking._id, "cancelled")}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Processing..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Inline Expandable Booking Details */}
                    {isSelected && (
                      <tr className="bg-gray-50 border-b-2 border-yellow-500/30">
                        <td colSpan="6" className="px-6 py-6">
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                              <h3 className="text-lg font-bold text-gray-800">Booking Details</h3>
                              <button
                                onClick={() => setShowDetails(null)}
                                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Close Details ✕
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                  <img 
                                    src={getVillaImage(showDetails.villaName)} 
                                    alt={showDetails.villaName} 
                                    className="object-cover w-full h-64"
                                  />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{showDetails.villaName}</h3>
                                <p className="text-gray-600 mb-4">{showDetails.location}</p>
                                
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Booking Status</h4>
                                  <div className="flex items-center space-x-3">
                                    <button 
                                      onClick={() => {
                                        updateBookingStatus(showDetails.id || showDetails._id, "confirmed")
                                        setShowDetails(null)
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        showDetails.status === 'confirmed' 
                                          ? 'bg-green-600 text-white shadow' 
                                          : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200'
                                      }`}
                                    >
                                      Confirmed
                                    </button>
                                    <button 
                                      onClick={() => {
                                        updateBookingStatus(showDetails.id || showDetails._id, "completed")
                                        setShowDetails(null)
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        showDetails.status === 'completed' 
                                          ? 'bg-blue-600 text-white shadow' 
                                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                                      }`}
                                    >
                                      Completed
                                    </button>
                                    <button 
                                      onClick={() => {
                                        updateBookingStatus(showDetails.id || showDetails._id, "cancelled")
                                        setShowDetails(null)
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        showDetails.status === 'cancelled' 
                                          ? 'bg-red-600 text-white shadow' 
                                          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 border border-gray-200'
                                      }`}
                                    >
                                      Cancelled
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-4 text-base">Booking Information</h4>
                                
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Invoice ID:</span>
                                    <span className="text-gray-900 font-mono text-xs font-medium">{showDetails.invoiceNumber || showDetails.id || showDetails._id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Guest:</span>
                                    <span className="text-gray-900 font-semibold">{showDetails.guestName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="text-gray-900 font-medium">{showDetails.email}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="text-gray-900 font-medium">{showDetails.phone || 'Not provided'}</span>
                                  </div>
                                  
                                  <div className="border-t border-gray-200 my-3"></div>
                                  
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Check-in:</span>
                                    <span className="text-gray-900 font-medium">{formatDate(showDetails.checkIn)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Check-out:</span>
                                    <span className="text-gray-900 font-medium">{formatDate(showDetails.checkOut)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Guests:</span>
                                    <span className="text-gray-900 font-medium">{showDetails.guests || 'Not specified'}</span>
                                  </div>
                                  
                                  <div className="border-t border-gray-200 my-3"></div>
                                  
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Status:</span>
                                    <span className={`font-semibold ${showDetails.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                      {showDetails.isPaid ? 'Paid' : 'Not Paid'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Method:</span>
                                    <span className="text-gray-900 font-medium">{showDetails.paymentMethod || 'Not specified'}</span>
                                  </div>
                                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                    <span className="text-gray-800">Total Amount:</span>
                                    <span className="text-yellow-700 text-lg">₹{showDetails.totalAmount?.toLocaleString() || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
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
    </div>
  )
}

export default BookingManagement
