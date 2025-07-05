import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config/api';

const HelpCenter = () => {
  // Define state to track open FAQ sections
  const [openSection, setOpenSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Luxor Assistant. How can I help you today?", 
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [villaData, setVillaData] = useState([]);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const chatbotRef = useRef(null);
  const messageEndRef = useRef(null);

  // Toggle FAQ section open/close
  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
  
  // Close chatbot if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setShowChatbot(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Scroll to bottom of chat whenever messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Search through all FAQ questions and answers
    const results = [];
    faqCategories.forEach(category => {
      category.questions.forEach(faq => {
        if (faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)) {
          results.push({
            category: category.title,
            ...faq
          });
        }
      });
    });
    
    setSearchResults(results);
  };

  // Chatbot functionality with API integration
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;
    
    // Store the current input before clearing it
    const currentInput = userInput;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: currentInput,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);
    
    try {
      // Fetch response from AI API
      const response = await fetchChatbotResponse(currentInput);
      
      // Add bot response message
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: response,
        sender: "bot",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      
      // Add error message if API call fails
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later or contact our support team directly.",
        sender: "bot",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Function to fetch response from API
  const fetchChatbotResponse = async (query) => {
    try {
      // First try to get response from the API
      const apiResponse = await callChatAPI(query);
      return apiResponse;
    } catch (error) {
      // If API fails, fall back to local response generator
      console.log("API call failed, using fallback response generator", error);
      return generateBotResponse(query);
    }
  };
  
  // Call to external API for chatbot response
  const callChatAPI = async (query) => {
    // API endpoint for the chatbot service
    const API_ENDPOINT = 'https://api.luxorholidayhomestays.com/chat';
    // Or use a third-party AI service
    
    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Add the current query
    chatHistory.push({
      role: 'user',
      content: query
    });
    
    try {
      // Using fetch API to call the chatbot service
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.REACT_APP_CHAT_API_KEY || 'api-key-placeholder'
        },
        body: JSON.stringify({
          messages: chatHistory,
          villa_data: isApiConnected ? villaData : getVillaData(),
          max_tokens: 300,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return the response from the API
      return data.message || data.response || data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling chat API:", error);
      throw error; // Rethrow to be handled by the caller
    }
  };
  
  // Helper function to get structured villa data for API consumption
  const getVillaData = () => {
    if (villaData.length > 0 && isApiConnected) {
      return villaData; // Return the API-fetched data if available
    }
    
    // Fallback data structure if API data isn't available
    return {
      "amrith palace": {
        id: "ap1",
        name: "Amrith Palace",
        location: "Pattipulam ECR, Tamil Nadu",
        bedrooms: 9,
        bathrooms: 9,
        maxOccupancy: 35,
        amenities: [
          "Private swimming pool", 
          "9 AC rooms with 1 AC Hall",
          "Beach access (800m away)", 
          "Parking", 
          "WiFi", 
          "Basic kitchen facilities", 
          "Fridge", 
          "TV", 
          "Caretaker service", 
          "Security cameras", 
          "Outdoor games"
        ],
        priceRange: "₹45,000 - ₹65,000 per night",
        weekdayPrice: 45000,
        weekendPrice: 65000,
        events: "Suitable for family gatherings, bachelor parties, marriage events, corporate events, shootings and birthday celebrations",
        minStay: "1 night"
      },
      "ram water villa": {
        id: "rwv1",
        name: "Ram Water Villa",
        location: "Perur ECR, Tamil Nadu",
        bedrooms: 5,
        bathrooms: 5,
        maxOccupancy: 20,
        amenities: [
          "Private swimming pool", 
          "5 AC rooms with Hall AC", 
          "TV", 
          "Party speaker", 
          "Fridge", 
          "Basic kitchen facilities", 
          "WiFi", 
          "Caretaker service", 
          "Private beach access"
        ],
        luxuryCategory: true,
        minStay: "1 night"
      },
      "east coast villa": {
        id: "ecv1",
        name: "East Coast Villa",
        location: "Perur ECR, Tamil Nadu",
        bedrooms: 3,
        bathrooms: 3,
        maxOccupancy: 15,
        amenities: [
          "Private swimming pool", 
          "3 AC rooms with Hall AC", 
          "Basic kitchen facilities", 
          "Fridge", 
          "TV", 
          "WiFi", 
          "Power backup DG", 
          "Caretaker service", 
          "JBL party speaker", 
          "BBQ setup", 
          "Compact party lawn"
        ],
        priceRange: "₹15,000 - ₹25,000 per night",
        weekdayPrice: 15000,
        weekendPrice: 25000,
        events: "Event pricing varies depending on requirements",
        minStay: "1 night"
      },
      "empire anand villa samudra": {
        id: "eavs1",
        name: "Empire Anand Villa Samudra",
        location: "Kovalam ECR, Tamil Nadu",
        bedrooms: 6,
        bathrooms: 6,
        maxOccupancy: 20,
        amenities: [
          "Private swimming pool", 
          "Spacious modern interiors", 
          "High-end amenities", 
          "En-suite facilities in each bedroom", 
          "Fully equipped kitchen", 
          "Dining area", 
          "Expansive living areas", 
          "Sea views", 
          "Private beach access"
        ],
        priceRange: "₹40,000 - ₹60,000 per night",
        weekdayPrice: 40000,
        weekendPrice: 60000,
        securityDeposit: 15000,
        minStay: "1 night",
        mapLink: "https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7"
      }
    };
  };
  
  // Process user input when pressing enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Format timestamp for chat messages
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(date);
  };

  // AI-powered response generator based on predefined data
  const generateBotResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    // Villa information
    const villaData = {
      "lavish villa 1": {
        location: "Ooty, Tamil Nadu",
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["Swimming pool", "Free WiFi", "Fully equipped kitchen", "Outdoor dining area"],
        priceRange: "₹8,000 - ₹15,000 per night",
        minStay: "2 nights"
      },
      "lavish villa 2": {
        location: "Kodaikanal, Tamil Nadu",
        bedrooms: 4,
        bathrooms: 3,
        amenities: ["Jacuzzi", "BBQ area", "Garden", "Mountain view"],
        priceRange: "₹10,000 - ₹18,000 per night",
        minStay: "2 nights"
      },
      "lavish villa 3": {
        location: "Yercaud, Tamil Nadu",
        bedrooms: 2,
        bathrooms: 2,
        amenities: ["Private terrace", "Fireplace", "Lake view", "Pet-friendly"],
        priceRange: "₹7,500 - ₹12,000 per night",
        minStay: "2 nights"
      },
      "amrith palace": {
        location: "Pattipulam ECR, Tamil Nadu",
        bedrooms: 9,
        bathrooms: 9,
        maxOccupancy: 35,
        amenities: [
          "Private swimming pool", 
          "9 AC rooms with 1 AC Hall",
          "Beach access (800m away)", 
          "Parking", 
          "WiFi", 
          "Basic kitchen facilities", 
          "Fridge", 
          "TV", 
          "Caretaker service", 
          "Security cameras", 
          "Outdoor games available"
        ],
        priceRange: "₹45,000 - ₹65,000 per night",
        weekdayPrice: "₹45,000",
        weekendPrice: "₹65,000",
        events: "Suitable for family gatherings, bachelor parties, marriage events, corporate events, shootings and birthday celebrations",
        category: "Luxury",
        minStay: "1 night",
        description: "Amrith Palace is a luxurious 9BHK private villa with private swimming pool located in Pattipulam ECR. With 9 AC rooms and an AC hall, it's perfect for large groups and events, with a maximum capacity of 35 people."
      },
      "ram water villa": {
        location: "Perur ECR, Tamil Nadu",
        bedrooms: 5,
        bathrooms: 5,
        amenities: [
          "Private swimming pool", 
          "5 AC rooms with Hall AC", 
          "TV", 
          "Party speaker", 
          "Fridge", 
          "Basic kitchen facilities", 
          "WiFi", 
          "Caretaker service", 
          "Private beach access"
        ],
        category: "Luxury",
        minStay: "1 night",
        description: "Ram Water Villa is a luxury 5BHK property in Perur ECR featuring a private swimming pool. All 5 rooms are air-conditioned, and the villa offers private beach access, making it perfect for a coastal getaway."
      },
      "east coast villa": {
        location: "Perur ECR, Tamil Nadu",
        bedrooms: 3,
        bathrooms: 3,
        maxOccupancy: 15,
        amenities: [
          "Private swimming pool", 
          "3 AC rooms with Hall AC", 
          "Basic kitchen facilities", 
          "Fridge", 
          "TV", 
          "WiFi", 
          "Power backup DG", 
          "Caretaker service", 
          "JBL party speaker", 
          "BBQ setup", 
          "Compact party lawn"
        ],
        priceRange: "₹15,000 - ₹25,000 per night",
        weekdayPrice: "₹15,000",
        weekendPrice: "₹25,000",
        events: "Event pricing varies depending on requirements",
        minStay: "1 night",
        description: "East Coast Villa is a private 3BHK property in Perur ECR with a private swimming pool. All rooms are air-conditioned, and the villa features amenities like BBQ setup, JBL party speaker, and a compact party lawn, making it perfect for small gatherings of up to 15 people."
      },
      "empire anand villa samudra": {
        location: "Kovalam ECR, Tamil Nadu",
        bedrooms: 6,
        bathrooms: 6,
        maxOccupancy: "15-20",
        amenities: [
          "Private swimming pool", 
          "Spacious modern interiors", 
          "High-end amenities", 
          "En-suite facilities in each bedroom", 
          "Fully equipped kitchen", 
          "Dining area", 
          "Expansive living areas", 
          "Sea views", 
          "Private beach access"
        ],
        priceRange: "₹40,000 - ₹60,000 per night",
        weekdayPrice: "₹40,000",
        weekendPrice: "₹60,000",
        securityDeposit: "₹15,000 (refundable)",
        minStay: "1 night",
        mapLink: "https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7",
        description: "Empire Anand Villa Samudra is a luxurious 6BHK private villa located in Kovalam (ECR). It offers private beach access, making it perfect for a serene coastal getaway. The villa features spacious, modern interiors equipped with high-end amenities and can accommodate 15-20 people."
      }
    };
    
    // Booking related keywords
    if (query.includes("book") || query.includes("reservation") || query.includes("stay") || query.includes("availability")) {
      return "You can book any of our luxury villas through our website by selecting your desired dates and completing the booking process. Alternatively, you can contact our customer service team at +91 8015924647 for personalized assistance. Would you like information about a specific villa?";
    }
    
    // Price related keywords
    if (query.includes("price") || query.includes("cost") || query.includes("rate") || query.includes("fee")) {
      return "Our villa rates vary depending on the property, season, and length of stay. Prices typically range from ₹7,500 to ₹25,000 per night. For the most accurate pricing, please select specific dates on our booking page or mention which villa you're interested in.";
    }
    
    // Check for specific villa inquiries
    for (const villa in villaData) {
      if (query.includes(villa)) {
        const data = villaData[villa];
        let response = `${villa.charAt(0).toUpperCase() + villa.slice(1)} is located in ${data.location}. `;
        
        if (data.description) {
          response += `${data.description} `;
        }
        
        response += `It features ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, and amenities including ${data.amenities.slice(0, 5).join(", ")}`;
        
        if (data.amenities.length > 5) {
          response += ` and more`;
        }
        
        response += `. `;
        
        if (data.weekdayPrice && data.weekendPrice) {
          response += `Pricing: Weekdays at ₹${data.weekdayPrice.replace(/[₹,]/g, '')}, Weekends at ₹${data.weekendPrice.replace(/[₹,]/g, '')}. `;
        } else if (data.priceRange) {
          response += `Price range: ${data.priceRange}. `;
        }
        
        if (data.maxOccupancy) {
          response += `Maximum occupancy: ${data.maxOccupancy} guests. `;
        }
        
        if (data.events) {
          response += `${data.events}. `;
        }
        
        response += `Minimum stay: ${data.minStay}.`;
        
        if (data.mapLink) {
          response += ` View location: ${data.mapLink}`;
        }
        
        return response;
      }
    }
    
    // Cancellation policy
    if (query.includes("cancel") || query.includes("refund")) {
      return "Our standard cancellation policy allows for a full refund if cancelled 7 days before check-in. Cancellations made less than 7 days before check-in may be subject to charges. Please refer to your specific booking terms for detailed information.";
    }
    
    // Amenities
    if (query.includes("amenities") || query.includes("facilities") || query.includes("features")) {
      return "Our luxury villas offer premium amenities including private swimming pools, fully equipped kitchens, air conditioning, Wi-Fi, premium toiletries, and daily housekeeping. Some villas also feature outdoor dining areas, BBQ facilities, home theaters, and more. Each villa page has a complete list of amenities.";
    }
    
    // Location or directions
    if (query.includes("location") || query.includes("address") || query.includes("direction") || query.includes("map")) {
      return "Our villas are located in various scenic destinations across Tamil Nadu including Ooty, Kodaikanal, Yercaud, Yelagiri, Coonoor and Chennai's East Coast Road. Detailed directions and location information will be provided after booking confirmation. Would you like information about a specific property?";
    }
    
    // Check-in/check-out
    if (query.includes("check-in") || query.includes("check-out") || query.includes("checkout") || query.includes("checkin")) {
      return "Our standard check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability. Please contact us prior to your stay if you need flexibility with these times.";
    }
    
    // Payment methods
    if (query.includes("payment") || query.includes("pay") || query.includes("card")) {
      return "We accept all major credit cards, debit cards, and online banking transfers. For certain properties, we also accept payment through popular digital wallets. A security deposit is typically required and will be refunded within 7 days after checkout, provided no damages are found.";
    }
    
    // Contact support
    if (query.includes("contact") || query.includes("support") || query.includes("help") || query.includes("assistance")) {
      return "Our customer support team is available 24/7 to assist with any inquiries or issues. You can reach us via phone at +91 8015924647, WhatsApp, or by email at support@luxorholidayhomestays.com. Would you like us to contact you?";
    }
    
    // Special services
    if (query.includes("service") || query.includes("chef") || query.includes("airport") || query.includes("transfer") || query.includes("pickup")) {
      return "We offer additional services including airport transfers, private chefs, grocery delivery, guided local tours, and special event arrangements. These can be requested during booking or by contacting our concierge team. Charges may apply depending on the service requested.";
    }
    
    // Greetings
    if (query.includes("hi") || query.includes("hello") || query.includes("hey")) {
      return "Hello! I'm the Luxor Villa Assistant. How can I help you today? Feel free to ask about our villas, bookings, amenities, or any other questions you might have!";
    }
    
    // Thank you responses
    if (query.includes("thank") || query.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with regarding our luxury villas?";
    }
    
    // Default response
    return "I'm not sure I understand your question. Could you please rephrase it? You can ask about our villas, booking process, amenities, cancellation policies, or contact information. Or would you like to speak with a human representative?";
  };

  // Fetch villa data from API
  useEffect(() => {
    const fetchVillaData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/villas/`);
        if (response.ok) {
          const data = await response.json();
          setVillaData(data);
          setIsApiConnected(true);
          console.log("Villa data fetched successfully:", data);
        } else {
          console.error("Failed to fetch villa data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching villa data:", error);
      }
    };

    fetchVillaData();
  }, []);

  // FAQ categories with questions
  const faqCategories = [
    {
      title: "Booking Questions",
      questions: [
        {
          question: "How do I make a reservation?",
          answer: "You can make a reservation directly through our website by selecting your desired villa, dates, and completing the booking form. Alternatively, you can contact our customer service team via phone or WhatsApp."
        },
        {
          question: "What is the cancellation policy?",
          answer: "Our standard cancellation policy allows for a full refund if cancelled 7 days before check-in. Cancellations made less than 7 days before check-in may be subject to charges. Please refer to your specific booking terms for detailed information."
        },
        {
          question: "How can I modify my reservation?",
          answer: "To modify your reservation, please contact our customer support team with your booking reference number. Changes are subject to availability and may incur additional charges."
        }
      ]
    },
    {
      title: "Villa Information",
      questions: [
        {
          question: "What amenities are included in your villas?",
          answer: "Our villas feature premium amenities including swimming pools, fully equipped kitchens, air conditioning, Wi-Fi, premium toiletries, and daily housekeeping. Specific amenities vary by property and are listed on each villa's page."
        },
        {
          question: "Are pets allowed in the villas?",
          answer: "Pet policies vary by property. Some of our villas are pet-friendly with additional fees. Please check the individual villa listings or contact us for specific pet policies."
        },
        {
          question: "Is parking available?",
          answer: "Yes, most of our properties offer complimentary private parking. Details about parking arrangements are available on each villa's information page."
        }
      ]
    },
    {
      title: "Payment & Security",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, and online banking transfers. For certain properties, we also accept payment through digital wallets."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and secure payment processors to ensure your financial information is protected at all times."
        },
        {
          question: "Do I need to pay a security deposit?",
          answer: "Yes, most bookings require a refundable security deposit that is returned within 7 days after checkout, provided no damages are found."
        }
      ]
    },
    {
      title: "Guest Services",
      questions: [
        {
          question: "Is there 24/7 customer support?",
          answer: "Yes, our customer support team is available 24/7 to assist with any inquiries or issues during your stay."
        },
        {
          question: "Can I request special services?",
          answer: "Yes, we offer additional services including airport transfers, private chefs, grocery delivery, and more. These can be requested during booking or by contacting our concierge team."
        }
      ]
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our luxury villas and services. If you can't find what you're looking for, our team is here to help.
        </p>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto mb-12"
      >
        <div className={`relative ${isSearchFocused ? 'ring-2 ring-[#D4AF37] rounded-full' : ''}`}>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#D4AF37] text-white px-4 py-1.5 rounded-full hover:bg-[#BFA181] transition-colors duration-300"
          >
            Search
          </motion.button>
          
          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
              >
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="p-3 border-b border-gray-100 hover:bg-[#F6F9FC] cursor-pointer"
                    onClick={() => {
                      // Find and open the relevant FAQ section
                      faqCategories.forEach((category, catIndex) => {
                        category.questions.forEach((q, qIndex) => {
                          if (q.question === result.question) {
                            setOpenSection(`${catIndex}-${qIndex}`);
                            setSearchQuery('');
                            setSearchResults([]);
                            
                            // Scroll to the result
                            setTimeout(() => {
                              document.getElementById(`faq-${catIndex}-${qIndex}`)?.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'center'
                              });
                            }, 100);
                          }
                        });
                      });
                    }}
                  >
                    <div className="text-xs text-[#BFA181] font-medium mb-1">{result.category}</div>
                    <div className="font-medium text-gray-800">{result.question}</div>
                    <div className="text-sm text-gray-500 truncate">{result.answer}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { 
            title: 'Ask AI Assistant', 
            description: 'Chat with our AI assistant for instant help',
            icon: '🤖',
            action: () => setShowChatbot(true)
          },
          { 
            title: 'Villa Information', 
            description: 'Quick access to villa information resources',
            icon: '🏠'
          },
          { 
            title: 'Payment & Security', 
            description: 'Quick access to payment & security resources',
            icon: '🔒'
          },
          { 
            title: 'Contact Support', 
            description: 'Quick access to contact support resources',
            icon: '💬'
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              borderColor: "#D4AF37" 
            }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
            onClick={item.action}
          >
            <motion.div 
              className="h-14 w-14 rounded-full bg-[#F6F9FC] flex items-center justify-center mb-4"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl">{item.icon}</span>
            </motion.div>
            <h3 className="font-medium text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
        
        {faqCategories.map((category, catIndex) => (
          <motion.div 
            key={catIndex} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            className="mb-8"
          >
            <h3 className="text-xl font-playfair text-[#1A1A1A] mb-4">{category.title}</h3>
            <div className="space-y-4">
              {category.questions.map((faq, faqIndex) => (
                <motion.div 
                  id={`faq-${catIndex}-${faqIndex}`}
                  key={`${catIndex}-${faqIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: faqIndex * 0.1 + catIndex * 0.2 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "#F6F9FC" }}
                    className="w-full px-6 py-4 text-left flex justify-between items-center"
                    onClick={() => toggleSection(`${catIndex}-${faqIndex}`)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <motion.svg
                      animate={{ rotate: openSection === `${catIndex}-${faqIndex}` ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-5 h-5 text-gray-500`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>
                  <AnimatePresence>
                    {openSection === `${catIndex}-${faqIndex}` && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-[#F6F9FC] border-t border-gray-200">
                          <p className="text-gray-600">{faq.answer}</p>
                          
                          {/* Special actions for booking questions */}
                          {category.title === "Booking Questions" && faqIndex === 0 && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setShowChatbot(true)}
                              className="mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#BFA181] transition-colors duration-300 flex items-center gap-2"
                            >
                              <span>Ask AI Assistant</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-[#F6F9FC] rounded-xl p-8 text-center max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">Our support team is here to help you with any questions or concerns.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/contact" className="px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#BFA181] transition-colors duration-300 inline-block">
              Contact Support
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a 
              href="https://wa.me/918015924647?text=Hi, I would like to know more about Luxor Holiday Home Stays"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 inline-block"
            >
              WhatsApp Chat
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {showChatbot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              ref={chatbotRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl overflow-hidden max-w-md w-full max-h-[80vh] flex flex-col"
            >
              {/* Chatbot Header */}
              <div className="flex justify-between items-center p-4 bg-[#D4AF37] text-white">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xl text-[#D4AF37]">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Luxor Assistant</h3>
                    <div className="text-xs opacity-80">Online | Responds instantly</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChatbot(false)}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-sm rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-[#D4AF37] text-white rounded-tr-none' 
                          : 'bg-white shadow rounded-tl-none'
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex mb-4">
                    <div className="bg-white shadow rounded-lg px-4 py-2 rounded-tl-none">
                      <div className="flex gap-1">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="h-2 w-2 bg-gray-400 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="h-2 w-2 bg-gray-400 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="h-2 w-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
              
              {/* Quick Suggestions */}
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                  {[
                    "Tell me about Amrith Palace",
                    "Ram Water Villa pricing",
                    "East Coast Villa amenities",
                    "Empire Anand Villa location",
                    "Booking policy"
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setUserInput(suggestion);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="px-3 py-1.5 text-xs whitespace-nowrap bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    disabled={!userInput.trim()}
                    className={`p-2 rounded-full ${
                      userInput.trim() ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpCenter;