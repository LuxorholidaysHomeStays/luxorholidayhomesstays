import React, { useEffect } from 'react';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaWater, FaTrophy, FaChartLine, FaLaptop, FaSeedling, FaStar } from 'react-icons/fa';

const Timeline = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const milestones = [
    {
      year: 2010,
      title: "The Beginning",
      description: "Luxor Holiday Home Stays was founded with a vision to redefine luxury villa experiences in South India. We started with our first property in Pondicherry's French Quarter.",
      icon: <FaHome />
    },
    {
      year: 2012,
      title: "Expanding to ECR",
      description: "We acquired our first beachfront property along East Coast Road, setting new standards for luxury coastal stays with the launch of Amrith Palace Villa.",
      icon: <FaWater />
    },
    {
      year: 2015,
      title: "Award Recognition",
      description: "Luxor was recognized as the 'Best Luxury Villa Provider' by the Tamil Nadu Tourism Department, acknowledging our commitment to excellence.",
      icon: <FaTrophy />
    },
    {
      year: 2017,
      title: "Portfolio Growth",
      description: "Our collection expanded to include 8 distinctive properties across Chennai and Pondicherry, each with unique character and premium amenities.",
      icon: <FaChartLine />
    },
    {
      year: 2020,
      title: "Digital Transformation",
      description: "We launched our integrated booking platform and virtual tours, making luxury villa selection and reservation effortless for our guests.",
      icon: <FaLaptop />
    },
    {
      year: 2023,
      title: "Sustainability Initiative",
      description: "Implemented eco-friendly practices across all properties, including solar energy, rainwater harvesting, and organic gardens, without compromising luxury.",
      icon: <FaSeedling />
    },
    {
      year: 2025,
      title: "The Future",
      description: "Today, Luxor stands as the premier luxury villa provider in the region, with plans to expand to new destinations while maintaining our standard of excellence.",
      icon: <FaStar />
    }
  ];

  return (
    <TimelineSection>
      <div className="container">
        <div className="timeline-header" data-aos="fade-up">
          <h2 className="section-title">Our Journey</h2>
          <p className="section-subtitle">The evolution of Luxor Holiday Home Stays</p>
          <div className="divider">
            <span></span>
            <div className="diamond"></div>
            <span></span>
          </div>
        </div>

        <div className="timeline-container">
          {milestones.map((milestone, index) => (
            <div 
              key={index} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 100}
            >
              <div className="timeline-content">
                <div className="year-badge">{milestone.year}</div>
                <div className="milestone-icon">{milestone.icon}</div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </div>
          ))}
          
          <div className="timeline-line"></div>
        </div>
      </div>
    </TimelineSection>
  );
};

const TimelineSection = styled.section`
  padding: 100px 0;

  position: relative;
  color: #fff;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 1;
  }
  
  .timeline-header {
    text-align: center;
    margin-bottom: 70px;
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      color: #D4AF37;
      margin: 0 0 20px;
      font-weight: 700;
      
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
    }
    
    .section-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 20px;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      
      span {
        height: 1px;
        width: 60px;
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5));
        
        &:last-child {
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent);
        }
      }
      
      .diamond {
        width: 10px;
        height: 10px;
        background: #D4AF37;
        margin: 0 15px;
        transform: rotate(45deg);
      }
    }
  }
  
  .timeline-container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .timeline-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    top: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      rgba(212, 175, 55, 0) 0%,
      rgba(212, 175, 55, 0.5) 15%, 
      rgba(212, 175, 55, 0.5) 85%, 
      rgba(212, 175, 55, 0) 100%);
      
    @media (max-width: 768px) {
      left: 30px;
    }
  }
  
  .timeline-item {
    position: relative;
    width: 50%;
    margin-bottom: 70px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.left {
      left: 0;
      padding-right: 40px;
      
      &:after {
        content: '';
        position: absolute;
        top: 15px;
        right: -6px;
        width: 12px;
        height: 12px;
        background: #D4AF37;
        border-radius: 50%;
        z-index: 1;
        box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.3);
      }
    }
    
    &.right {
      left: 50%;
      padding-left: 40px;
      
      &:after {
        content: '';
        position: absolute;
        top: 15px;
        left: -6px;
        width: 12px;
        height: 12px;
        background: #D4AF37;
        border-radius: 50%;
        z-index: 1;
        box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.3);
      }
    }
    
    @media (max-width: 768px) {
      width: 100%;
      left: 0;
      padding-left: 60px;
      padding-right: 20px;
      
      &.left, &.right {
        left: 0;
        padding-left: 60px;
        padding-right: 20px;
      }
      
      &.left:after, &.right:after {
        left: 24px;
        right: auto;
      }
    }
  }
  
  .timeline-content {
    background: rgba(25, 25, 25, 0.8);
    border-radius: 10px;
    padding: 30px;
    position: relative;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 175, 55, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border-color: rgba(212, 175, 55, 0.3);
      
      .year-badge {
        background: #D4AF37;
        color: #000;
      }
      
      .milestone-icon {
        transform: scale(1.2) rotate(360deg);
      }
    }
    
    .year-badge {
      position: absolute;
      top: -15px;
      background: rgba(212, 175, 55, 0.8);
      padding: 5px 15px;
      font-weight: 700;
      border-radius: 20px;
      transition: all 0.3s ease;
      
      .left & {
        left: 20px;
      }
      
      .right & {
        left: 20px;
      }
    }
    
    .milestone-icon {
      font-size: 2rem;
      margin-bottom: 15px;
      margin-top: 10px;
      transition: all 0.5s ease;
      transform-origin: center;
      display: inline-block;
    }
    
    h3 {
      font-family: 'Playfair Display', serif;
      color: #D4AF37;
      margin: 0 0 15px;
      font-size: 1.5rem;
    }
    
    p {
      margin: 0;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

export default Timeline;
