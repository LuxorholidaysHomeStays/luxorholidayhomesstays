import React, { useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styled from 'styled-components';

// Import components
import HeroSection from '../components/About/HeroSection';
import PersonalIntro from '../components/About/PersonalIntro';
import Mission from '../components/About/Mission';
import StatsCounter from '../components/About/StatsCounter';
import Timeline from '../components/About/Timeline';

import Gallery from '../components/About/Gallery';

const About = () => {
    useEffect(() => {
        // Initialize AOS
        AOS.init({
            duration: 200,
            once: true,
            disable: 'mobile'
        });
        
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <AboutWrapper>
        
                <title>About Us | Luxor Holiday Home Stays</title>
                <meta name="description" content="Learn about Luxor Holiday Home Stays, our journey, mission, and the luxury villa experiences we've been crafting since 2010." />
                <meta name="keywords" content="luxury villas Chennai, luxury villas Pondicherry, Luxor Holiday Home Stays history, about us, villa experiences" />
       
            
            {/* Hero Section with Video Background */}
            <HeroSection />
            
            {/* Personal Introduction Section */}
            <PersonalIntro />
                     <Timeline />
            
            {/* Mission & Vision Section */}
            <Mission />
            
            {/* Stats Counter Section */}
            {/* <StatsCounter /> */}
    
            <Gallery />
        </AboutWrapper>
    );
};

const AboutWrapper = styled.div`
    background-color: #fff;
    color: #333;
    
    /* Gold text selection styling */
    ::selection {
        background: rgba(212, 175, 55, 0.3);
        color: #333;
    }
`;

export default About;
