import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "../utils/toast";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import VillaSwiper from "../components/VillaSwiper";

const Home = () => {
  const location = useLocation();

  // Handle success messages from other pages
  useEffect(() => {
    // Check navigation state first
    if (location.state?.message && location.state?.type) {
      const { message, type } = location.state;
      if (type === "error") {
        toast.error(message);
      } else {
        toast.success(message);
      }

      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    // Check localStorage as backup
    const bookingSuccess = localStorage.getItem("bookingSuccess");
    if (bookingSuccess) {
      try {
        const successData = JSON.parse(bookingSuccess);
        // Check if the message is recent (within 30 seconds)
        if (Date.now() - successData.timestamp < 30000) {
          if (successData.type === "error") {
            toast.error(successData.message);
          } else {
            toast.success(successData.message);
          }
        }
        localStorage.removeItem("bookingSuccess");
      } catch (error) {
        console.error("Error parsing booking success data:", error);
        localStorage.removeItem("bookingSuccess");
      }
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <FeaturedDestination />
      <VillaSwiper />
    </>
  );
};

export default Home;
