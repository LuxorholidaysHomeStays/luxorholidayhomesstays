import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaChevronLeft, FaChevronRight, FaQuoteRight, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "Our stay at Amrith Palace Villa exceeded all expectations. The attention to detail, the luxurious amenities, and the breathtaking views made our family vacation truly unforgettable. The staff was incredibly attentive without being intrusive.",
      property: "Amrith Palace Villa",
      date: "May 2025"
    },
    {
      id: 2,
      name: "Rahul Mehta",
      location: "Bangalore",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "I've stayed at many luxury properties around the world, and Luxor Holiday Homes truly stands among the best. The East Coast Villa offered the perfect blend of privacy, luxury, and authentic local experiences. Will definitely be returning!",
      property: "East Coast Villa",
      date: "February 2025"
    },
    {
      id: 3,
      name: "Aisha Patel",
      location: "Delhi",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      text: "We chose Luxor for our company retreat, and it was the perfect decision. The villa was spacious enough for our team of 12, yet felt intimate and cozy. The private pool and garden area became our favorite spot for brainstorming sessions.",
      property: "Lavish Villa 2",
      date: "March 2025"
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Hyderabad",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      rating: 5,
      text: "The Ram Water Villa provided the perfect romantic getaway for our anniversary. The beachfront location, private dining arrangements, and the thoughtful surprise champagne setup arranged by the Luxor team made it a celebration to remember.",
      property: "Ram Water Villa",
      date: "January 2025"
    },
    {
      id: 5,
      name: "Meera Krishnan",
      location: "Chennai",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg",
      rating: 5,
      text: "As a local from Chennai, I wanted a special place to host my parents' 40th anniversary. The Empire Anand Villa was perfect - luxurious yet homely. The management went above and beyond to accommodate our requests for the celebration.",
      property: "Empire Anand Villa",
      date: "April 2025"
    }
  ];

  // State for testimonial slider
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swipe left
      handleNext();
    }

    if (touchStart - touchEnd < -150) {
      // Swipe right
      handlePrev();
    }
  };

  return (
    <TestimonialsSection>
      <GoldBackgroundPattern />
      <div className="container">
        <SectionHeader data-aos="fade-up">
          <h2 className="title">Guest Experiences</h2>
          <p className="subtitle">What our valued guests say about their stay with us</p>
        </SectionHeader>

        <TestimonialsSlider 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <SliderWrapper style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id}>
                <div className="testimonial-content">
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star"><FaStar /></span>
                    ))}
                  </div>
                  
                  <blockquote>"{testimonial.text}"</blockquote>
                  
                  <div className="property-tag">
                    <span>{testimonial.property}</span>
                    <span className="date">{testimonial.date}</span>
                  </div>
                </div>
                
                <div className="testimonial-author">
                  <div className="avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </TestimonialCard>
            ))}
          </SliderWrapper>
          
          <SliderControls>
            <button className="prev" onClick={handlePrev} aria-label="Previous testimonial">
              <FaChevronLeft />
            </button>
            
            <div className="dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button className="next" onClick={handleNext} aria-label="Next testimonial">
              <FaChevronRight />
            </button>
          </SliderControls>
        </TestimonialsSlider>
        
        <CallToAction data-aos="fade-up">
          <h3>Ready to Experience Luxor?</h3>
          <p>Join our distinguished guests in discovering the perfect blend of luxury, comfort, and authentic experiences.</p>
          <button className="cta-button">Book Your Stay</button>
        </CallToAction>
      </div>
    </TestimonialsSection>
  );
};

const TestimonialsSection = styled.section`
  padding: 100px 0;

  position: relative;
  color: #fff;
  overflow: hidden;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const GoldBackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  
  .title {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    color: #D4AF37;
    margin: 0 0 20px;
    position: relative;
    display: inline-block;
    font-weight: 700;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 2px;
      background: linear-gradient(to right, transparent, #D4AF37, transparent);
    }
    
    @media (max-width: 768px) {
      font-size: 2.3rem;
    }
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 20px 0 0;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const TestimonialsSlider = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto 80px;
  overflow: hidden;
  border-radius: 10px;
`;

const SliderWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
`;

const TestimonialCard = styled.div`
  flex: 0 0 100%;
  padding: 40px;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(10, 10, 10, 0.9));
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(212, 175, 55, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  .testimonial-content {
    flex: 1;
    margin-bottom: 30px;
    
    .rating {
      margin-bottom: 20px;
      
      .star {
        font-size: 1.2rem;
        margin-right: 5px;
        color: #D4AF37;
        display: inline-flex;
        align-items: center;
      }
    }
    
    blockquote {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #f5f5f5;
      margin: 0 0 20px;
      font-style: italic;
      position: relative;
      padding: 0 20px;
      
      &:before {
        content: '"';
        font-family: Georgia, serif;
        font-size: 3rem;
        color: rgba(212, 175, 55, 0.3);
        position: absolute;
        left: -10px;
        top: -20px;
      }
    }
    
    .property-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      font-size: 0.9rem;
      color: #D4AF37;
      font-weight: 600;
      
      .date {
        color: rgba(255, 255, 255, 0.6);
        font-weight: normal;
      }
    }
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(212, 175, 55, 0.1);
    padding-top: 20px;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #D4AF37;
      margin-right: 15px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .author-info {
      h4 {
        margin: 0 0 5px;
        font-size: 1.1rem;
        color: #fff;
      }
      
      p {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    
    .testimonial-content {
      blockquote {
        font-size: 1rem;
      }
    }
  }
`;

const SliderControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #D4AF37;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:focus {
      outline: none;
    }
  }
  
  .prev, .next {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.3);
    
    i {
      font-size: 1rem;
    }
    
    &:hover {
      background: rgba(212, 175, 55, 0.2);
    }
  }
  
  .dots {
    display: flex;
    align-items: center;
    margin: 0 15px;
    
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 5px;
      padding: 0;
      transition: all 0.3s ease;
      
      &.active {
        background: #D4AF37;
        transform: scale(1.3);
      }
    }
  }
`;

const CallToAction = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(20, 20, 20, 0.6);
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: #D4AF37;
    margin: 0 0 20px;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 30px;
  }
  
  .cta-button {
    background: #D4AF37;
    border: none;
    color: #000;
    padding: 15px 35px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    
    &:hover {
      background: #E5C158;
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    
    h3 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 1rem;
    }
    
    .cta-button {
      padding: 12px 30px;
      font-size: 1rem;
    }
  }
`;

export default Testimonials;
