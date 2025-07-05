"use client"

// import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Phone, Mail, MapPin, Send, CheckCircle, Star, Sparkles } from "lucide-react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Particle = ({ index }) => {
const randomSize = Math.random() * 40 + 10
const randomX = Math.random() * 100 - 50
const randomY = Math.random() * 100 - 50
const randomDelay = Math.random() * 2
const randomDuration = Math.random() * 10 + 10

return (
<motion.div
className="absolute rounded-full bg-gradient-to-r from-gray-50/50 to-gray-100/50 blur-md"
style={{ width: randomSize, height: randomSize }}
initial={{
x: randomX,
y: randomY,
opacity: 0,
scale: 0,
}}
animate={{
x: [randomX, randomX + (Math.random() * 100 - 50)],
y: [randomY, randomY - 100 - Math.random() * 100],
opacity: [0, 0.6, 0],
scale: [0, 1.2, 0.5],
}}
transition={{
delay: randomDelay,
duration: randomDuration,
repeat: Number.POSITIVE_INFINITY,
repeatType: "loop",
ease: "easeInOut",
}}
/>
)
}

// Correct the Sparkle component
const Sparkle = ({ size = 10, color = "#222222", style = {} }) => {
  const randomDuration = 0.5 + Math.random() * 1.5;

  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 ${size / 2}px ${color}`,
        ...style,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

// Correct the FloatingBubble component
const FloatingBubble = ({ delay = 0, size = 80, duration = 15, xOffset = 0 }) => {
  const bubbleVariants = {
    initial: {
      y: 100 + Math.random() * 100,
      x: xOffset,
      opacity: 0,
      scale: 0.2,
    },
    animate: {
      y: -100 - Math.random() * 200,
      x: xOffset + Math.sin(Math.random() * 10) * 50,
      opacity: [0, 0.2, 0],
      scale: [0.2, 0.6, 0.3],
      transition: {
        delay: delay,
        duration: duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className="absolute rounded-full bg-gradient-to-r from-gray-50/30 to-gray-100/30 backdrop-blur-sm"
      style={{ width: size, height: size }}
    />
  );
}

export default function Contact() {
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
  const [hoveredIcon, setHoveredIcon] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  const formRef = useRef(null)
  const contactInfoRef = useRef(null)
  const mapRef = useRef(null)

  const isFormInView = useInView(formRef, { once: false, amount: 0.2 })
  const isContactInfoInView = useInView(contactInfoRef, { once: false, amount: 0.2 })
  const isMapInView = useInView(mapRef, { once: false, amount: 0.3 })

  const formControls = useAnimation()
  const contactInfoControls = useAnimation()
  const mapControls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isFormInView) formControls.start("visible")
    if (isContactInfoInView) contactInfoControls.start("visible")
    if (isMapInView) mapControls.start("visible")
  }, [isFormInView, isContactInfoInView, isMapInView, formControls, contactInfoControls, mapControls])

  const particles = Array.from({ length: 25 }, (_, i) => i)
  const bubbles = Array.from({ length: 12 }, (_, i) => i)

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX, y: clientY })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleFocus = (field) => {
    setActiveField(field)
  }

  const handleBlur = () => {
    setActiveField(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formState.name.trim()) errors.name = "Name is required";
    if (!formState.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formState.email)) errors.email = "Email is invalid";
    if (!formState.message.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Contact form server error:", errorText);
        throw new Error(errorText || "Failed to send message");
      }

      // Parse the JSON response with error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        // If JSON parsing fails but response was ok, create a default success response
        data = { success: true, message: "Message sent successfully" };
      }

      // Check if success is explicitly false in the response
      if (data.success === false) {
        throw new Error(data.error || "Failed to send message");
      }

      // If we get here, consider it a success
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const contactInfoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const mapVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
      },
    },
  }

  const sparkles = [
    { top: "10%", left: "5%", size: 4 },
    { top: "15%", right: "10%", size: 6 },
    { top: "60%", left: "8%", size: 5 },
    { top: "80%", right: "15%", size: 3 },
    { top: "30%", right: "20%", size: 4 },
    { top: "70%", left: "25%", size: 6 },
    { top: "40%", right: "30%", size: 5 },
    { top: "90%", right: "40%", size: 4 },
    { top: "25%", left: "40%", size: 3 },
    { top: "50%", left: "45%", size: 5 },
    { top: "85%", left: "25%", size: 5 },
    { top: "15%", left: "60%", size: 4 },
  ]

  return (
    <motion.div
      className="min-h-screen bg-white text-black relative overflow-hidden pt-16 md:pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 1, backgroundColor: '#ffffff' }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-0"
        style={{
          y: scrollY * 0.1,
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {particles.map((_, index) => (
          <Particle key={index} index={index} />
        ))}

        {bubbles.map((_, index) => (
          <FloatingBubble
            key={index}
            delay={index * 2}
            size={40 + Math.random() * 100}
            duration={10 + Math.random() * 20}
            xOffset={typeof window !== "undefined" ? window.innerWidth * Math.random() : 0}
          />
        ))}

        {sparkles.map((style, index) => (
          <Sparkle key={index} color="#222222" style={style} />
        ))}

        <motion.div
          className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-gray-50 to-gray-200/30 blur-3xl mix-blend-overlay"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-gradient-to-l from-gray-50 to-gray-100/20 blur-3xl mix-blend-overlay"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -20, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        className="fixed w-60 h-60 rounded-full bg-gradient-to-r from-gray-50/80 to-gray-100/50 blur-3xl pointer-events-none mix-blend-overlay"
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 100,
          mass: 0.5,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16 relative">
            <motion.h1
              variants={titleVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C4A454] via-[#A3884D] to-[#C4A454]"
            >
              Contact Us
            </motion.h1>

            <motion.div
              className="w-24 h-0.5 bg-gradient-to-r from-[#C4A454] via-[#A3884D] to-[#C4A454] mx-auto mb-6 sm:mb-8 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "6rem", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            <motion.p
              variants={titleVariants}
              className="text-base sm:text-xl text-gray-600 sm:mb-4 text-center max-w-3xl mx-auto"
            >
              Have questions about our luxury villa experiences?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-xl text-gray-600 mb-4 text-center max-w-3xl mx-auto"
            >
              Our team is ready to assist you with <span className="text-[#A3884D] font-medium">personalized service</span>.
            </motion.p>

            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div className="relative w-40 h-40">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: Math.cos((i * (Math.PI * 2)) / 5) * 50,
                      y: Math.sin((i * (Math.PI * 2)) / 5) * 50,
                      scale: 1,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      delay: i * 0.4,
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  >
                    <Star className="h-3 w-3 text-[#C4A454] fill-[#A3884D]/30" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              ref={formRef}
              variants={formVariants}
              initial="hidden"
              animate={formControls}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="backdrop-blur-md bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#C4A454]/20 hover:border-[#C4A454]/30 transition-colors duration-300"
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center text-center py-12 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-black/20 w-3 h-3"
                          initial={{
                            x: "50%",
                            y: "50%",
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            x: `${50 + (Math.random() * 100 - 50)}%`,
                            y: `${50 + (Math.random() * 100 - 50)}%`,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            delay: i * 0.05,
                            duration: 1.2,
                            repeat: 0,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>

                    <motion.div
                      className="relative z-10 bg-white/50 backdrop-blur-sm rounded-full p-6 border border-white/30 shadow-lg"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        transition: { type: "spring", bounce: 0.5 },
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [0.8, 1.2, 1],
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.3,
                          times: [0, 0.7, 1],
                          duration: 0.8,
                        }}
                      >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-semibold mb-3 text-gray-800 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Thank You!
                    </motion.h3>

                    <motion.p
                      className="text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      Your message has been sent successfully. We'll get back to you shortly.
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.form
                    className="space-y-5 sm:space-y-6 relative"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence>
                      {activeField && (
                        <motion.div
                          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-black/10 to-black/30 blur-md -z-10"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <motion.input
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.2)" }}
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus("name")}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border ${
                          formErrors.name ? "border-red-400" : "border-gray-100"
                        } rounded-xl focus:outline-none focus:border-black transition-all duration-300 text-black shadow-sm`}
                      />
                      <AnimatePresence>
                        {formErrors.name && (
                          <motion.p
                            className="mt-1 text-sm text-red-500 flex items-center"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                          >
                            {formErrors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <motion.input
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.2)" }}
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border ${
                          formErrors.email ? "border-red-400" : "border-gray-100"
                        } rounded-xl focus:outline-none focus:border-black transition-all duration-300 text-black shadow-sm`}
                      />
                      <AnimatePresence>
                        {formErrors.email && (
                          <motion.p
                            className="mt-1 text-sm text-red-500 flex items-center"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                          >
                            {formErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (Optional)
                      </label>
                      <motion.input
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.2)" }}
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus("phone")}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-all duration-300 text-black shadow-sm"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.27 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject (Optional)
                      </label>
                      <motion.input
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.2)" }}
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        onFocus={() => handleFocus("subject")}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-all duration-300 text-black shadow-sm"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <motion.textarea
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.2)" }}
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        onFocus={() => handleFocus("message")}
                        onBlur={handleBlur}
                        required
                        rows={5}
                        className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border ${
                          formErrors.message ? "border-red-400" : "border-gray-100"
                        } rounded-xl focus:outline-none focus:border-black transition-all duration-300 text-black shadow-sm resize-none`}
                      />
                      <AnimatePresence>
                        {formErrors.message && (
                          <motion.p
                            className="mt-1 text-sm text-red-500 flex items-center"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                          >
                            {formErrors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {formErrors.submit && (
                      <motion.div
                        className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-sm">{formErrors.submit}</p>
                      </motion.div>
                    )}

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-medium py-3 px-5 rounded-xl shadow-md transition duration-300 flex items-center justify-center relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />

                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        whileHover="visible"
                        initial="hidden"
                      >
                        {Array.from({ length: 15 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{ opacity: 0 }}
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: [0, 1, 0],
                                x: [0, Math.random() * 150 - 75],
                                y: [0, Math.random() * -50 - 10],
                                scale: [0, 1, 0],
                                transition: {
                                  delay: i * 0.05,
                                  duration: 1 + Math.random(),
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: Math.random() * 2,
                                },
                              },
                            }}
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </motion.div>

                      <div className="flex items-center justify-center relative z-10">
                        {isSubmitting ? (
                          <motion.div
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                        ) : (
                          <>
                            <span className="mr-2">Send Message</span>
                            <motion.div
                              animate={{
                                x: [0, 5, 0],
                                rotate: [0, 15, 0, -15, 0],
                              }}
                              transition={{
                                x: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                                rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                              }}
                            >
                              <Send className="h-5 w-5" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              ref={contactInfoRef}
              variants={contactInfoVariants}
              initial="hidden"
              animate={contactInfoControls}
              className="space-y-8 sm:space-y-10 flex flex-col justify-center backdrop-blur-md bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#C4A454]/20 relative overflow-hidden"
            >
              <motion.div
                className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gradient-to-r from-black/10 to-black/30 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-black"
              >
                Get in Touch
              </motion.h2>

              <motion.p variants={itemVariants} className="text-gray-600 mb-6 relative z-10">
                We're available to answer your questions and provide information about our luxury villa rentals.
              </motion.p>

              <motion.div
                className="space-y-8 relative z-10"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={itemVariants}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-white/50 flex items-start gap-3 sm:gap-5 transform transition-all duration-500"
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-black to-gray-800 rounded-full p-2 sm:p-3 md:p-4 shadow-md"
                    whileHover={{
                      scale: 1.1,
                      rotate: 15,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div>
                    <motion.h3 className="font-medium text-base sm:text-lg md:text-xl text-gray-800">Phone</motion.h3>
                    <motion.a 
                      href="tel:+918015924647"
                      className="text-gray-600 text-xs sm:text-sm md:text-base break-all hover:text-black hover:underline transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      +91 8015924647
                    </motion.a>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-white/50 flex items-start gap-3 sm:gap-5 transform transition-all duration-500"
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-black to-gray-800 rounded-full p-2 sm:p-3 md:p-4 shadow-md"
                    whileHover={{
                      scale: 1.1,
                      rotate: 15,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div>
                    <motion.h3 className="font-medium text-base sm:text-lg md:text-xl text-gray-800">Email</motion.h3>
                    <motion.a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=luxorholidayhomestays@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 text-xs sm:text-sm md:text-base break-all hover:text-black hover:underline transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      luxorholidayhomestays@gmail.com
                    </motion.a>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-white/50 flex items-start gap-3 sm:gap-5 transform transition-all duration-500"
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-black to-gray-800 rounded-full p-2 sm:p-3 md:p-4 shadow-md"
                    whileHover={{
                      scale: 1.1,
                      rotate: 15,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div>
                    <motion.h3 className="font-medium text-base sm:text-lg md:text-xl text-gray-800">Address</motion.h3>
                    <motion.a 
                      href="https://www.google.com/maps/search/?api=1&query=40/2B+Kovalam+main+road,+Chennai,+603112"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 text-xs sm:text-sm md:text-base break-all hover:text-black hover:underline transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      40/2B Kovalam main road, Chennai, 603112
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 pt-6 border-t border-gray-100 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                  </motion.div>
                  <p className="text-sm text-gray-500">Trusted by over 500+ luxury travelers</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-5 right-5 opacity-30"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="w-20 h-20 border border-black/20 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 border border-black/40 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-black/10 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            ref={mapRef}
            variants={mapVariants}
            initial="hidden"
            animate={mapControls}
            className="mt-16 sm:mt-24"
          >
            <motion.h2
              className="text-2xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-black"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Find Us on the Map
            </motion.h2>

            <motion.div
              className="w-full aspect-video backdrop-blur-md bg-white/60 rounded-3xl overflow-hidden border border-white/30 shadow-xl relative"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                delay: 0.2,
              }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.4, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <motion.div className="flex items-center justify-center">
                    <motion.div
                      className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    >
                      <MapPin className="w-6 h-6 text-black" />
                    </motion.div>
                  </motion.div>
                </div>
              )}

              <iframe
                title="Luxor Villa Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125323.40216323!2d76.89010037974042!3d11.011870079525526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1673429729105!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsMapLoaded(true)}
                className={`transition-all duration-700 ${isMapLoaded ? "opacity-100" : "opacity-0"} z-0`}
              />

              <motion.div
                className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: isMapLoaded ? 1 : 0,
                }}
                transition={{
                  delay: 1,
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0.5, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <motion.div
                    className="w-6 h-6 bg-black rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(0,0,0,0.3)", "0 0 0 10px rgba(0,0,0,0)", "0 0 0 0 rgba(0,0,0,0)"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
