import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import NewsLetter from "../components/NewsLetter";

import VillaSwiper from "../components/VillaSwiper";

const Home = () => {
  const location = useLocation();

  // Handle success messages from other pages
  useEffect(() => {
    console.log("Home component location state:", location.state); // Debug log

    // Check navigation state first
    if (location.state?.message && location.state?.type) {
      const { message, type } = location.state;

      console.log("Showing success message from navigation state:", {
        message,
        type,
      }); // Debug log
      Swal.fire({
        icon: type,
        title: type === "success" ? "Success!" : "Information",
        text: message,
        confirmButtonColor: "#16a34a",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

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
          console.log(
            "Showing success message from localStorage:",
            successData
          ); // Debug log
          Swal.fire({
            icon: successData.type,
            title: successData.type === "success" ? "Success!" : "Information",
            text: successData.message,
            confirmButtonColor: "#16a34a",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: true,
          });
        }
        // Clear the localStorage message
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

      <NewsLetter />
    </>
  );
};

export default Home;
