import React, { useState } from "react"
import { Phone, Mail, MapPin, Send, CheckCircle, Sparkles, ExternalLink, Navigation } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { API_BASE_URL } from "../../config/api"

const countryCodes = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
]

export default function Contact() {
  const [countryCode, setCountryCode] = useState("+91")
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "")
      const limitedValue = numericValue.slice(0, 15)
      setFormState((prev) => ({
        ...prev,
        [name]: limitedValue,
      }))
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = {}
    if (!formState.name.trim()) errors.name = "Name is required"
    if (!formState.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formState.email)) errors.email = "Email is invalid"
    if (!formState.phone.trim()) errors.phone = "Phone number is required"
    else if (formState.phone.trim().length < 6)
      errors.phone = "Please enter a valid phone number"
    if (!formState.message.trim()) errors.message = "Message is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formState,
        phone: `${countryCode} ${formState.phone}`.trim(),
      }
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Contact form server error:", errorText)
        throw new Error(errorText || "Failed to send message")
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        data = { success: true, message: "Message sent successfully" }
      }

      if (data.success === false) {
        throw new Error(data.error || "Failed to send message")
      }

      setIsSubmitted(true)
      setFormState({ name: "", email: "", phone: "", subject: "", message: "" })

      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error("Contact form error:", error)
      setFormErrors({ submit: error.message || "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#B58E3E] tracking-tight mb-3 sm:mb-4">
            Contact Us
          </h1>
          <div className="w-20 sm:w-24 h-0.5 bg-[#C4A454] mx-auto mb-4 sm:mb-6 rounded-full" />
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Have questions about our luxury villa experiences?
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 mt-1">
            Our team is ready to assist you with{" "}
            <span className="text-[#A3884D] font-medium">personalized service</span>.
          </p>
        </motion.div>

        {/* 2-Column Grid for Form and Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-md">
                    Your message has been sent successfully. Our team will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50/70 hover:bg-gray-50 focus:bg-white border ${
                        formErrors.name ? "border-red-400" : "border-gray-200"
                      } rounded-xl focus:outline-none focus:border-black transition-colors text-gray-900 placeholder:text-gray-400`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50/70 hover:bg-gray-50 focus:bg-white border ${
                        formErrors.email ? "border-red-400" : "border-gray-200"
                      } rounded-xl focus:outline-none focus:border-black transition-colors text-gray-900 placeholder:text-gray-400`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:border-black transition-colors shrink-0"
                      >
                        {countryCodes.map((c) => (
                          <option key={`${c.code}-${c.name}`} value={c.code}>
                            {c.flag} {c.code} ({c.name})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="Mobile number"
                        required
                        className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50/70 hover:bg-gray-50 focus:bg-white border ${
                          formErrors.phone ? "border-red-400" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:border-black transition-colors text-gray-900 placeholder:text-gray-400`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Subject <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder="Reservation inquiry, event booking, etc."
                      className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us about your dates, guest count, or any special requests..."
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50/70 hover:bg-gray-50 focus:bg-white border ${
                        formErrors.message ? "border-red-400" : "border-gray-200"
                      } rounded-xl focus:outline-none focus:border-black transition-colors text-gray-900 placeholder:text-gray-400 resize-none`}
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.message}</p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900 mb-2">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                We're available to answer your questions and provide information about our luxury
                villa rentals.
              </p>

              <div className="space-y-4 sm:space-y-5">
                {/* Phone */}
                <div className="bg-gray-50/60 border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Phone</h3>
                    <div className="flex flex-col gap-0.5 text-xs sm:text-sm text-gray-600">
                      <a
                        href="tel:+918015924647"
                        className="hover:text-black transition-colors"
                      >
                        +91 8015924647
                      </a>
                      <a
                        href="tel:+919940047463"
                        className="hover:text-black transition-colors"
                      >
                        +91 9940047463
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-50/60 border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Email</h3>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=luxorholidayhomestays@gmail.com&su=Inquiry%20About%20Homestay&body=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20homestay%20options."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors break-all block"
                    >
                      luxorholidayhomestays@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50/60 border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Address</h3>
                    <a
                      href="https://maps.app.goo.gl/UdBtHYWdwSey7BKy9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-gray-600 hover:text-black hover:underline transition-colors leading-relaxed block"
                    >
                      6/181, Dargah road, Kovalam main road, Kovalam taluk, Chengalpattu dt, Tamil Nadu 603 112
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Badge */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-[#B58E3E] shrink-0" />
              <span>Trusted by over 500+ luxury travelers</span>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-14 sm:mt-18 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-center text-gray-900 mb-6 sm:mb-8">
            Find Us on the Map
          </h2>

          <div className="w-full h-[300px] sm:h-[400px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 relative bg-gray-100">
            {/* Open in Maps Navigation Button */}
            <a
              href="https://maps.app.goo.gl/UdBtHYWdwSey7BKy9"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/95 hover:bg-white text-gray-900 font-medium text-xs sm:text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition-colors shadow-none"
            >
              <span>Open in Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
            </a>

            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
                  <span className="text-xs text-gray-500">Loading map...</span>
                </div>
              </div>
            )}

            <iframe
              title="Luxor Villa Location Map"
              src="https://maps.google.com/maps?q=12.8092227,80.2239083&hl=en&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              className={`w-full h-full transition-opacity duration-500 ${
                isMapLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
