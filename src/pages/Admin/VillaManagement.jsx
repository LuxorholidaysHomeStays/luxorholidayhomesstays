"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  UsersIcon,
  BanknotesIcon,
  HomeIcon,
} from "@heroicons/react/24/outline"

// Import villa images properly
import Amrith from "/AmrithPalace/AP8.jpg"
import EastCoast from "/eastcoastvilla/EC1.jpg"
import EmpireAnand from "/empireanandvillasamudra/anandvilla1.jpg"
import RamWater from "/ramwatervilla/RW1.jpg"
import LavishOne from "/LavishVilla 1/lvone18.jpg"
import LavishTwo from "/LavishVilla 2/lvtwo22.jpg"
import LavishThree from "/LavishVilla 3/lvthree5.jpg"

// Create a proper villa images mapping
const villaImages = {
  "Amrith Palace": Amrith,
  "East Coast Villa": EastCoast,
  "Empire Anand Villa Samudra": EmpireAnand,
  "Ram Water Villa": RamWater,
  "Lavish Villa I": LavishOne,
  "Lavish Villa II": LavishTwo,
  "Lavish Villa III": LavishThree,
}

// Helper function to get villa image based on villa name with better matching
const getVillaImage = (villaName) => {
  if (!villaName) return Amrith

  // Direct match first
  if (villaImages[villaName]) {
    return villaImages[villaName]
  }

  // Case insensitive partial matching
  const lowerName = villaName.toLowerCase()

  if (lowerName.includes("amrith") || lowerName.includes("palace")) {
    return villaImages["Amrith Palace"]
  } else if (lowerName.includes("east") || lowerName.includes("coast")) {
    return villaImages["East Coast Villa"]
  } else if (lowerName.includes("empire") || lowerName.includes("anand") || lowerName.includes("samudra")) {
    return villaImages["Empire Anand Villa Samudra"]
  } else if (lowerName.includes("ram") || lowerName.includes("water")) {
    return villaImages["Ram Water Villa"]
  } else if (
    lowerName.includes("lavish") &&
    lowerName.includes("i") &&
    !lowerName.includes("ii") &&
    !lowerName.includes("iii")
  ) {
    return villaImages["Lavish Villa I"]
  } else if (lowerName.includes("lavish") && lowerName.includes("ii")) {
    return villaImages["Lavish Villa II"]
  } else if (lowerName.includes("lavish") && lowerName.includes("iii")) {
    return villaImages["Lavish Villa III"]
  }

  // Default fallback
  return Amrith
}

const VillaManagement = () => {
  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVilla, setEditingVilla] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: 0,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
  })
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const { authToken } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    fetchVillas()
  }, [])

  const fetchVillas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/villas`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setVillas(data)
      } else {
        setVillas([])
      }
    } catch (error) {
      console.error("Error fetching villas:", error)
      addToast("Error fetching villas", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAmenitiesChange = (e) => {
    const { checked, value } = e.target
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, value],
      })
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((amenity) => amenity !== value),
      })
    }
  }

  const handleImageUpload = (e) => {
    // Placeholder for image upload
    // In a real app, this would handle file uploads to your server
    addToast("Image upload functionality would be implemented here", "info")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingVilla ? `${API_BASE_URL}/api/villas/${editingVilla._id}` : `${API_BASE_URL}/api/villas`
      const method = editingVilla ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addToast(`Villa ${editingVilla ? "updated" : "created"} successfully`, "success")
        setShowModal(false)
        setEditingVilla(null)
        setFormData({
          name: "",
          description: "",
          location: "",
          price: 0,
          maxGuests: 1,
          bedrooms: 1,
          bathrooms: 1,
          amenities: [],
          images: [],
        })
        fetchVillas()
      } else {
        addToast(`Failed to ${editingVilla ? "update" : "create"} villa`, "error")
      }
    } catch (error) {
      console.error("Error saving villa:", error)
      addToast("Error saving villa", "error")
    }
  }

  const handleEdit = (villa) => {
    setEditingVilla(villa)
    setFormData({
      name: villa.name,
      description: villa.description,
      location: villa.location,
      price: villa.price,
      maxGuests: villa.maxGuests,
      bedrooms: villa.bedrooms,
      bathrooms: villa.bathrooms,
      amenities: villa.amenities || [],
      images: villa.images || [],
    })
    setShowModal(true)
  }

  const confirmDelete = (villa) => {
    setDeleteConfirmation(villa)
  }

  const cancelDelete = () => {
    setDeleteConfirmation(null)
  }

  const handleDelete = async (villaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/villas/${villaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        addToast("Villa deleted successfully", "success")
        fetchVillas()
      } else {
        addToast("Failed to delete villa", "error")
      }
    } catch (error) {
      console.error("Error deleting villa:", error)
      addToast("Error deleting villa", "error")
    } finally {
      setDeleteConfirmation(null)
    }
  }

  const filteredVillas = villas.filter(
    (villa) =>
      villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      villa.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const amenitiesList = [
    "WiFi",
    "Swimming Pool",
    "Air Conditioning",
    "Kitchen",
    "TV",
    "Parking",
    "Washing Machine",
    "BBQ",
  ]

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
          <h1 className="text-3xl font-bold text-gray-900">Villa Management</h1>
          <p className="text-gray-600">Manage your luxury villas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search villas..."
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setEditingVilla(null)
              setFormData({
                name: "",
                description: "",
                location: "",
                price: 0,
                maxGuests: 1,
                bedrooms: 1,
                bathrooms: 1,
                amenities: [],
                images: [],
              })
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Villa
          </button>
        </div>
      </div>

      {/* Villas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillas.map((villa) => (
          <div
            key={villa._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-64 relative overflow-hidden">
              <img
                src={getVillaImage(villa.name) || "/placeholder.svg"}
                alt={villa.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  console.log(`Failed to load image for ${villa.name}, using fallback`)
                  e.target.src = Amrith
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image for ${villa.name}`)
                }}
                style={{
                  backgroundColor: "#f3f4f6", // Light gray background while loading
                  minHeight: "256px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{villa.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center text-gray-600 mb-3">
                <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{villa.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded-md flex items-center">
                  <UsersIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{villa.maxGuests || villa.guests} guests</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-md flex items-center">
                  <HomeIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{villa.bedrooms} bedrooms</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BanknotesIcon className="h-5 w-5 text-green-600 mr-1 flex-shrink-0" />
                  <span className="text-lg font-semibold text-green-600">₹{villa.price.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm ml-1">/night</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(villa)}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit Villa"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => confirmDelete(villa)}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Villa"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredVillas.length === 0 && (
          <div className="col-span-full bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HomeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No villas found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? "Try adjusting your search" : "Add your first villa to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setEditingVilla(null)
                  setShowModal(true)
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Villa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Villa Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{editingVilla ? "Edit Villa" : "Add New Villa"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Villa Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                    <input
                      type="number"
                      name="maxGuests"
                      value={formData.maxGuests}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={handleAmenitiesChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md p-6 flex justify-center">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageUpload}
                            multiple
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {editingVilla ? "Update Villa" : "Create Villa"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Villa</h3>
              <p className="text-gray-500">
                Are you sure you want to delete <span className="font-medium">{deleteConfirmation.name}</span>? This
                action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VillaManagement
