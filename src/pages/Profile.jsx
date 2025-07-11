"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Swal from "sweetalert2"
import AOS from "aos"
import "aos/dist/aos.css"
import { MapPin, X } from "lucide-react"
import axios from "axios"
import { auth } from "../utils/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

const getInitials = (name) => {
  if (!name) return "?"
  const names = name.trim().split(" ")
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  } else {
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
}

const Profile = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
    })
  }, [])

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

  const recaptchaVerifierRef = useRef(null)

  const countryCodes = [
    { code: "+1", name: "United States", flag: "🇺🇸" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+977", name: "Nepal", flag: "🇳🇵" },
    { code: "+92", name: "Pakistan", flag: "🇵🇰" },
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "+254", name: "Kenya", flag: "🇰🇪" },
    { code: "+52", name: "Mexico", flag: "🇲🇽" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
    { code: "+57", name: "Colombia", flag: "🇨🇴" },
    { code: "+51", name: "Peru", flag: "🇵🇪" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    { code: "+964", name: "Iraq", flag: "🇮🇶" },
    { code: "+972", name: "Israel", flag: "🇮🇱" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
  ]

  const navigate = useNavigate()
  const { authToken, userData, setUserData } = useAuth()

  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [bookings, setBookings] = useState([])
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    profileImage: "",
  })
  const [editMode, setEditMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const displayEmail = profileData.email || userData?.email || ""

  const [phoneOtpMode, setPhoneOtpMode] = useState(false)
  const [emailOtpMode, setEmailOtpMode] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [newEmail, setNewEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [phoneVerificationSuccess, setPhoneVerificationSuccess] = useState(false)
  const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [isLoadingCountries, setIsLoadingCountries] = useState(false)
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [hasExistingData, setHasExistingData] = useState(false)
  const [dataSource, setDataSource] = useState({
    hasBookingData: false,
    hasPhoneData: false,
    hasProfileData: false,
  })
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false)

  // Auto-hide success/error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (!authToken) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to view your profile.",
        confirmButtonColor: "#ca8a04",
      }).then(() => {
        navigate("/sign-in")
      })
      return
    }
    fetchUserProfile()
    fetchUserBookings()
  }, [authToken, navigate])

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    if (profileData.country && editMode) {
      fetchStates(profileData.country)
    }
  }, [profileData.country, editMode])

  useEffect(() => {
    if (profileData.country && profileData.state && editMode) {
      fetchCities(profileData.country, profileData.state)
    }
  }, [profileData.country, profileData.state, editMode])

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (error) {
          console.error("Error clearing recaptcha:", error)
        }
        recaptchaVerifierRef.current = null
      }
    }
  }, [])

  const fetchCountries = async () => {
    setIsLoadingCountries(true)
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions")
      const data = await response.json()
      if (data.data && Array.isArray(data.data)) {
        setCountries(data.data.map((c) => ({ name: c.name, code: c.iso2 || "" })))
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    } finally {
      setIsLoadingCountries(false)
    }
  }

  const fetchStates = async (country) => {
    if (!country) return

    setIsLoadingStates(true)
    setStates([])
    setCities([])

    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      })

      const data = await response.json()
      if (data.data && data.data.states) {
        setStates(data.data.states)
      }
    } catch (error) {
      console.error("Error fetching states:", error)
    } finally {
      setIsLoadingStates(false)
    }
  }

  const fetchCities = async (country, state) => {
    if (!country || !state) return

    setIsLoadingCities(true)
    setCities([])

    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      })

      const data = await response.json()
      if (data.data) {
        setCities(data.data)
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setIsLoadingCities(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.get(`${baseUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.data.success) {
        const { user, hasData, dataSource: dataSourceInfo } = response.data

        setHasExistingData(hasData)
        if (dataSourceInfo) {
          setDataSource(dataSourceInfo)
        }

        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          countryCode: user.countryCode || "+91",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          country: user.country || "",
          zipCode: user.zipCode || "",
          profileImage: user.profileImage || "",
        })

        if (hasData && dataSourceInfo) {
          setShowDataSourceInfo(true)
          setTimeout(() => setShowDataSourceInfo(false), 5000)
        }

        if (!hasData) {
          setEditMode(true)
          setSuccess("Please complete your profile information.")
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile data")
      setEditMode(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/bookings/user-bookings`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.data.success) {
        setBookings(response.data.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "country") {
      fetchStates(value)
      setProfileData((prev) => ({ ...prev, state: "", city: "" }))
    }
    if (name === "state") {
      fetchCities(profileData.country, value)
      setProfileData((prev) => ({ ...prev, city: "" }))
    }
  }

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)")
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setUploadingImage(true)
      setError("")

      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const base64String = event.target.result

          const response = await axios.post(
            `${baseUrl}/api/profile/upload-image`,
            { imageData: base64String },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            },
          )

          if (response.data.success) {
            // Update profile data with the base64 image
            setProfileData((prev) => ({
              ...prev,
              profileImage: response.data.imageData,
            }))

            setSuccess("Profile image updated successfully")

            // Update user data in context if needed
            if (setUserData) {
              setUserData((prev) => ({
                ...prev,
                profileImage: response.data.imageData,
              }))
            }
          }
        } catch (error) {
          console.error("Error uploading image:", error)
          setError(error.response?.data?.error || "Failed to upload image. Please try again.")
        } finally {
          setUploadingImage(false)
        }
      }

      reader.onerror = () => {
        setError("Error reading file")
        setUploadingImage(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error handling image upload:", error)
      setError("Failed to process image. Please try again.")
      setUploadingImage(false)
    }
  }

  // Add debugging function to check image data
  const debugImageData = () => {
    console.log("Profile Image Debug Info:")
    console.log("profileData.profileImage exists:", !!profileData.profileImage)
    console.log("profileData.profileImage length:", profileData.profileImage?.length || 0)
    console.log("profileData.profileImage starts with data:image:", profileData.profileImage?.startsWith("data:image/"))
    console.log("First 100 chars:", profileData.profileImage?.substring(0, 100))
  }

  // Call this in useEffect to debug
  useEffect(() => {
    if (profileData.profileImage) {
      debugImageData()
    }
  }, [profileData.profileImage])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      setUpdating(true)
      setError("")
      setSuccess("")

      const response = await axios.put(`${baseUrl}/api/profile/update`, profileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.data.success) {
        setSuccess("Profile updated successfully!")
        setEditMode(false)
        setHasExistingData(true)
        if (setUserData) {
          setUserData((prev) => ({ ...prev, ...profileData }))
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.response?.data?.message || "Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  const resetForm = () => {
    fetchUserProfile()
    setEditMode(false)
    setError("")
    setSuccess("")
  }

  const startPhoneVerification = async () => {
    try {
      setSendingOtp(true)
      setError("")

      if (!newPhone || newPhone.length < 10) {
        setError("Please enter a valid phone number")
        setSendingOtp(false)
        return
      }

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (error) {
          console.error("Error clearing recaptcha:", error)
        }
      }

      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified")
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.")
          setSendingOtp(false)
        },
      })

      const formattedPhone = `${countryCode}${newPhone}`
      console.log("Sending OTP to:", formattedPhone)

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current)
      setConfirmationResult(confirmation)
      setPhoneOtpMode(true)
      setSendingOtp(false)
      setSuccess("OTP sent successfully! Please check your phone.")
    } catch (error) {
      console.error("Error sending OTP:", error)
      setError(error.message || "Failed to send OTP. Please try again.")
      setSendingOtp(false)
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (error) {
          console.error("Error clearing recaptcha:", error)
        }
        recaptchaVerifierRef.current = null
      }
    }
  }

  const verifyPhoneOtp = async () => {
    try {
      setVerifyingOtp(true)
      setError("")

      if (!otpCode || otpCode.length !== 6) {
        setError("Please enter a valid 6-digit OTP")
        setVerifyingOtp(false)
        return
      }

      if (!confirmationResult) {
        setError("Session expired. Please request a new OTP.")
        setVerifyingOtp(false)
        return
      }

      await confirmationResult.confirm(otpCode)

      const response = await axios.post(
        `${baseUrl}/api/profile/update-phone`,
        { phone: newPhone, countryCode: countryCode },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )

      if (response.data.success) {
        setPhoneVerificationSuccess(true)
        setPhoneOtpMode(false)
        setSuccess("Phone number updated successfully!")
        setProfileData((prev) => ({
          ...prev,
          phone: newPhone,
          countryCode: countryCode,
        }))
        setNewPhone("")
        setOtpCode("")
        if (setUserData) {
          setUserData((prev) => ({
            ...prev,
            phone: newPhone,
            countryCode: countryCode,
          }))
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setError(error.message || "Failed to verify OTP. Please try again.")
    } finally {
      setVerifyingOtp(false)
      setConfirmationResult(null)
    }
  }

  const startEmailVerification = async () => {
    try {
      setSendingOtp(true)
      setError("")

      if (!newEmail || !newEmail.includes("@")) {
        setError("Please enter a valid email address")
        setSendingOtp(false)
        return
      }

      const response = await axios.post(
        `${baseUrl}/api/profile/send-email-otp`,
        {
          email: newEmail,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )

      if (response.data.success) {
        setSuccess("Verification code sent to your email!")
      }
    } catch (error) {
      console.error("Error sending email OTP:", error)
      setError(error.response?.data?.message || "Failed to send verification code")
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyEmailOtp = async () => {
    try {
      setVerifyingOtp(true)
      setError("")

      if (!otpCode) {
        setError("Please enter the verification code")
        setVerifyingOtp(false)
        return
      }

      const response = await axios.post(
        `${baseUrl}/api/profile/verify-email-otp`,
        {
          email: newEmail,
          otp: otpCode,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )

      if (response.data.success) {
        setEmailVerificationSuccess(true)
        setEmailOtpMode(false)
        setSuccess("Email updated successfully!")
        setProfileData((prev) => ({
          ...prev,
          email: newEmail,
        }))
        setNewEmail("")
        setOtpCode("")
        if (setUserData) {
          setUserData((prev) => ({
            ...prev,
            email: newEmail,
          }))
        }
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error)
      setError(error.response?.data?.message || "Failed to verify email")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const addSampleBooking = () => {
    const sampleBooking = {
      _id: Date.now().toString(),
      propertyName: "Sample Villa Resort",
      status: "confirmed",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 25000,
      address: {
        street: "123 Resort Street",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        zipCode: "400001",
      },
    }
    setBookings((prev) => [sampleBooking, ...prev])
    setSuccess("Sample booking added successfully!")
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const openAddressModal = (booking) => {
    setSelectedBooking(booking)
    setShowAddressModal(true)
  }

  const PhoneVerificationSection = () => (
    <div className="mt-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
      <h4 className="font-medium text-yellow-800 mb-3">
        {profileData.phone ? "Change Phone Number" : "Add & Verify Phone Number"}
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Country Code</label>
          <div className="relative">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg appearance-none pr-10"
              disabled={sendingOtp}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.code})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <div className="flex">
            <div className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
              <span className="text-sm text-gray-500">{countryCode}</span>
            </div>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter phone number"
              disabled={sendingOtp}
            />
          </div>
        </div>
        {!phoneVerificationSuccess && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={startPhoneVerification}
              disabled={sendingOtp || !newPhone || newPhone.length < 10}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 text-sm"
            >
              {sendingOtp ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
            <button
              type="button"
              onClick={() => setPhoneOtpMode(false)}
              className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
        {phoneVerificationSuccess && (
          <div className="text-green-600 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {profileData.phone ? "Phone number changed successfully!" : "Phone number added and verified!"}
          </div>
        )}
        {phoneOtpMode && !phoneVerificationSuccess && (
          <div className="mt-3">
            <label className="block text-sm text-gray-600 mb-1">Verification Code</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
              <button
                type="button"
                onClick={verifyPhoneOtp}
                disabled={verifyingOtp || !otpCode || otpCode.length !== 6}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {verifyingOtp ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify Code"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Didn't receive the code?
              <button
                type="button"
                onClick={startPhoneVerification}
                disabled={sendingOtp}
                className="text-yellow-600 ml-1 hover:text-yellow-700 disabled:opacity-50"
              >
                {sendingOtp ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const DataSourceIndicator = () =>
    showDataSourceInfo && (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-800">Data Source Information</span>
          </div>
          <button onClick={() => setShowDataSourceInfo(false)} className="text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-sm text-blue-700">
          <p>Your profile data was loaded from:</p>
          <ul className="mt-1 space-y-1">
            {dataSource.hasProfileData && (
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Complete Profile Data
              </li>
            )}
            {dataSource.hasBookingData && (
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Previous Booking Information
              </li>
            )}
            {dataSource.hasPhoneData && (
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Phone Registration Data
              </li>
            )}
          </ul>
          <p className="mt-2 text-xs">You can edit and update any information as needed.</p>
        </div>
      </div>
    )

  const NoDataPrompt = () =>
    !hasExistingData && (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-yellow-800">Complete Your Profile</h3>
            <p className="text-sm text-yellow-700 mt-1">
              No existing profile data found. Please fill in your information below to complete your profile.
            </p>
          </div>
        </div>
      </div>
    )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button onClick={() => setError("")} className="ml-2 text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {success && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">{success}</span>
              <button onClick={() => setSuccess("")} className="ml-2 text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm border-b-4 border-gradient-to-r from-yellow-400 to-yellow-600 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors group">
                <svg
                  className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
              </div>
              <div className="w-20"></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-right">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
                  <div className="text-center">
                  
                    <div className="relative inline-block">
                      {profileData.profileImage ? (
                        <img
                          src={profileData.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white/20 object-cover"
                          onError={(e) => {
                            console.error("Error loading profile image:", e)
                            // Hide the broken image and show initials instead
                            e.target.style.display = "none"
                            const initialsDiv = e.target.parentNode.querySelector(".initials-fallback")
                            if (initialsDiv) {
                              initialsDiv.style.display = "flex"
                            }
                          }}
                          onLoad={(e) => {
                            console.log("Profile image loaded successfully")
                            // Hide initials when image loads successfully
                            const initialsDiv = e.target.parentNode.querySelector(".initials-fallback")
                            if (initialsDiv) {
                              initialsDiv.style.display = "none"
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`initials-fallback w-20 h-20 rounded-full mx-auto mb-3 bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/20 ${
                          profileData.profileImage ? "hidden" : "flex"
                        }`}
                      >
                        {getInitials(profileData.name)}
                      </div>

                      {editMode && (
                        <div className="absolute -bottom-1 -right-1">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                            <div className="w-8 h-8 bg-white text-yellow-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                              {uploadingImage ? (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 9a2 2 0 002-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              )}
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold">{profileData.name || "User"}</h3>
                    <p className="text-yellow-100 text-sm">{displayEmail}</p>
                    {editMode && <p className="text-yellow-200 text-xs mt-1">Click camera icon to change photo</p>}
                  </div>
                </div>

                <div className="p-6">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === "profile"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile Details
                    </button>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === "bookings"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                        />
                      </svg>
                      My Bookings
                      {bookings.length > 0 && (
                        <span className="ml-auto bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                          {bookings.length}
                        </span>
                      )}
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-left">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                      {hasExistingData && (
                        <button
                          onClick={() => setEditMode(!editMode)}
                          className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          {editMode ? "Cancel" : "Edit Profile"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <DataSourceIndicator />
                    <NoDataPrompt />

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              editMode
                                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="flex flex-col">
                            <input
                              type="email"
                              id="email"
                              className="w-full px-4 py-3 border rounded-lg transition-colors border-gray-200 bg-gray-50"
                              value={displayEmail}
                              disabled
                            />
                            {!emailOtpMode && (
                              <button
                                type="button"
                                onClick={() => setEmailOtpMode(true)}
                                className="mt-2 w-full md:w-auto text-sm bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors"
                              >
                                Change Email
                              </button>
                            )}
                          </div>
                          {emailOtpMode && (
                            <div className="mt-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                              <h4 className="font-medium text-yellow-800 mb-3">Change Email Address</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">New Email Address</label>
                                  <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter new email address"
                                  />
                                </div>
                                {!emailVerificationSuccess && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={startEmailVerification}
                                      disabled={sendingOtp || !newEmail}
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 text-sm"
                                    >
                                      {sendingOtp ? "Sending..." : "Send Verification Code"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEmailOtpMode(false)}
                                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                                {emailVerificationSuccess && (
                                  <div className="text-green-600 flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Email verified successfully!
                                  </div>
                                )}
                                {emailOtpMode && (
                                  <div className="mt-3">
                                    <label className="block text-sm text-gray-600 mb-1">Verification Code</label>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter code"
                                      />
                                      <button
                                        type="button"
                                        onClick={verifyEmailOtp}
                                        disabled={verifyingOtp || !otpCode}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
                                      >
                                        {verifyingOtp ? "Verifying..." : "Verify"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <div className="flex flex-col">
                            <div className="flex">
                              {profileData.countryCode && (
                                <div className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                  <span className="text-sm text-gray-500">
                                    {countryCodes.find((c) => c.code === profileData.countryCode)?.flag || ""}{" "}
                                    {profileData.countryCode}
                                  </span>
                                </div>
                              )}
                              <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                disabled
                                className={`flex-1 px-4 py-3 border rounded${profileData.countryCode ? "-r" : ""}-lg transition-colors border-gray-200 bg-gray-50`}
                                placeholder="No phone number added"
                              />
                            </div>
                            {!profileData.phone && (
                              <p className="text-xs text-yellow-600 mt-1">
                                <svg
                                  className="w-4 h-4 inline-block mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                Please add your phone number for account security
                              </p>
                            )}
                            {!phoneOtpMode && (
                              <button
                                type="button"
                                onClick={() => setPhoneOtpMode(true)}
                                className="mt-2 w-full md:w-auto text-sm bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors"
                              >
                                {profileData.phone ? "Change Phone Number" : "Add Phone Number & Verify"}
                              </button>
                            )}
                          </div>
                          {phoneOtpMode && <PhoneVerificationSection />}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              editMode
                                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="Enter your address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          {editMode ? (
                            <select
                              name="country"
                              value={profileData.country}
                              onChange={handleInputChange}
                              disabled={!editMode || isLoadingCountries}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            >
                              <option value="">-- Select Country --</option>
                              {isLoadingCountries ? (
                                <option value="" disabled>
                                  Loading countries...
                                </option>
                              ) : (
                                countries.map((country) => (
                                  <option key={country.name} value={country.name}>
                                    {country.name}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={profileData.country}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          {editMode ? (
                            <select
                              name="state"
                              value={profileData.state}
                              onChange={handleInputChange}
                              disabled={!editMode || !profileData.country || isLoadingStates}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            >
                              <option value="">-- Select State --</option>
                              {isLoadingStates ? (
                                <option value="" disabled>
                                  Loading states...
                                </option>
                              ) : (
                                states.map((state) => (
                                  <option key={state.name} value={state.name}>
                                    {state.name}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={profileData.state}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          {editMode ? (
                            <select
                              name="city"
                              value={profileData.city}
                              onChange={handleInputChange}
                              disabled={!editMode || !profileData.state || isLoadingCities}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            >
                              <option value="">-- Select City --</option>
                              {isLoadingCities ? (
                                <option value="" disabled>
                                  Loading cities...
                                </option>
                              ) : (
                                cities.map((city) => (
                                  <option key={city} value={city}>
                                    {city}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={profileData.city}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={profileData.zipCode}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              editMode
                                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="Enter your ZIP code"
                          />
                        </div>
                      </div>

                      {(!hasExistingData || editMode) && (
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                          {hasExistingData && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={updating}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 transition-colors"
                          >
                            {updating ? "Saving..." : hasExistingData ? "Save Changes" : "Complete Profile"}
                          </button>
                        </div>
                      )}

                      {hasExistingData && !editMode && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h3 className="text-sm font-medium text-yellow-800 mb-2">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-yellow-700">Phone:</span>
                              <span className="ml-2 text-gray-800">{profileData.phone || "Not provided"}</span>
                            </div>
                            <div>
                              <span className="text-yellow-700">Address:</span>
                              <span className="ml-2 text-gray-800">{profileData.address || "Not provided"}</span>
                            </div>
                            <div>
                              <span className="text-yellow-700">City:</span>
                              <span className="ml-2 text-gray-800">{profileData.city || "Not provided"}</span>
                            </div>
                            <div>
                              <span className="text-yellow-700">State:</span>
                              <span className="ml-2 text-gray-800">{profileData.state || "Not provided"}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-left">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                        <p className="text-gray-600 mt-1">Manage and view your booking history</p>
                      </div>
                      <button
                        onClick={addSampleBooking}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Sample Booking
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">
                          Start exploring our luxury properties and make your first booking!
                        </p>
                        <Link
                          to="/"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-colors"
                        >
                          Browse Properties
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName}</h3>
                                <p className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </p>
                                <p className="text-lg font-bold text-gray-800 mt-1">₹{booking.totalAmount}</p>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-yellow-600 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-gray-700 text-sm">
                                  {booking.address.street}, {booking.address.city}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-yellow-600 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-gray-700 text-sm">
                                  {booking.address.state}, {booking.address.zipCode}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openAddressModal(booking)}
                                  className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                  </svg>
                                  View Address
                                </button>
                              </div>
                              <div className="mt-3 sm:mt-0 sm:ml-4">
                                <Link
                                  to={`/booking-details/${booking._id}`}
                                  className="block text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Booking Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City/State</p>
                  <p className="text-sm font-medium">
                    {[selectedBooking.address?.city, selectedBooking.address?.state].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
              {selectedBooking.address?.zipCode && (
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ZIP/Postal Code</p>
                    <p className="text-sm font-medium">{selectedBooking.address.zipCode}</p>
                  </div>
                </div>
              )}
              {selectedBooking.address?.country && (
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm font-medium">{selectedBooking.address.country}</p>
                  </div>
                </div>
              )}
              {(!selectedBooking.address ||
                (!selectedBooking.address.street &&
                  !selectedBooking.address.city &&
                  !selectedBooking.address.state &&
                  !selectedBooking.address.country)) && (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-gray-500">No address information provided for this booking</p>
                </div>
              )}
            </div>
            {selectedBooking.address && (selectedBooking.address.street || selectedBooking.address.city) && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Address Map View</p>
                <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
                  <p className="text-sm text-gray-500">
                    <MapPin className="w-5 h-5 inline mr-1" />
                    {[
                      selectedBooking.address.street,
                      selectedBooking.address.city,
                      selectedBooking.address.state,
                      selectedBooking.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Map view is simulated in this demo</p>
              </div>
            )}
            <button
              onClick={() => setShowAddressModal(false)}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div id="recaptcha-container" style={{ visibility: "hidden" }}></div>
    </>
  )
}

export default Profile
