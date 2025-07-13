import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styled from 'styled-components';

// Assume you'll add this image to your assets
import founderImage from '../../assets/About/owner.jpg'; // Update with the correct path to your founder image

const PersonalIntro = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <IntroSection>
      <div className="container">
        <div className="content-wrapper">
          <div className="image-container" data-aos="fade-right">
            <div className="golden-frame">
              <img src={founderImage} alt="Founder" className="founder-image" />
            </div>
            <div className="experience-badge">
              <span className="years">15</span>
              <span className="text">Years of Excellence</span>
            </div>
          </div>

          <div className="text-container" data-aos="fade-left">
            <div className="section-heading">
              <h4 className="subtitle">About the Founder</h4>
              <h2 className="title">The Visionary Behind <span className="highlight">Luxor Holiday Homes</span></h2>
            </div>
            
            <div className="divider">
              <span className="diamond"></span>
            </div>
            
            <p className="intro-paragraph">
              Welcome to Luxor Holiday Home Stays, where luxury meets comfort in the most beautiful locations of Chennai and Pondicherry. I'm <strong>Gunaseelan Neelakandan</strong>, the founder and curator of these exceptional villa experiences.
            </p>
            
            <p className="philosophy">
              My journey began with a simple vision: to create spaces where memories are made, where families connect, and where travelers find their home away from home. Each of our properties has been personally selected and crafted to offer the perfect blend of opulence and warmth.
            </p>
            
            <p className="commitment">
              What sets Luxor Holiday Home Stays apart is our unwavering commitment to personalized service. We don't just offer accommodations; we create experiences. From the moment you inquire about a stay to the day you depart, our team is dedicated to exceeding your expectations.
            </p>
            
            <div className="signature-block">
              <div className="signature">Rajesh Kumar</div>
              <div className="designation">Founder & CEO</div>
            </div>
            
            <div className="awards-section">
              <div className="award">
                <div className="award-icon">🏆</div>
                <div className="award-details">
                  <h5>Excellence in Hospitality</h5>
                  <p>Tourism Board of India, 2024</p>
                </div>
              </div>
              <div className="award">
                <div className="award-icon">🌟</div>
                <div className="award-details">
                  <h5>Luxury Villa Provider</h5>
                  <p>Travel & Leisure Awards, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntroSection>
  );
};

const IntroSection = styled.section`
  padding: 100px 0;

  color: #fff;
  overflow: hidden;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #D4AF37, transparent);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #D4AF37, transparent);
  }
  
  .container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .image-container {
    position: relative;
    
    .golden-frame {
      position: relative;
      padding: 15px;
      background: linear-gradient(135deg, #D4AF37 0%, #F2CE5F 50%, #D4AF37 100%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transform: rotate(-2deg);
      transition: all 0.5s ease;
      
      &:hover {
        transform: rotate(0deg);
      }
      
      &:before {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
    
    .founder-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      display: block;
      transform: rotate(2deg);
      transition: all 0.5s ease;
      filter: brightness(0.95);
      
      &:hover {
        transform: rotate(0deg);
        filter: brightness(1);
      }
    }
    
    .experience-badge {
      position: absolute;
      bottom: -30px;
      right: -20px;
      width: 130px;
      height: 130px;
      background: #D4AF37;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #000;
      
      .years {
        font-size: 3.2rem;
        font-weight: 700;
        line-height: 1;
      }
      
      .text {
        font-size: 0.8rem;
        text-transform: uppercase;
        text-align: center;
        max-width: 80%;
        line-height: 1;
      }
    }
  }
  
  .text-container {
    .section-heading {
      margin-bottom: 25px;
      
      .subtitle {
        color: #D4AF37;
        font-size: 1.1rem;
        margin: 0 0 10px;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      
      .title {
        font-size: 2.5rem;
        line-height: 1.2;
        margin: 0;
        font-weight: 700;
        font-family: 'Playfair Display', serif;
        
        .highlight {
          color: #D4AF37;
          position: relative;
          display: inline-block;
          
          &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -5px;
            width: 100%;
            height: 2px;
            background: #D4AF37;
          }
        }
      }
    }
    
    .divider {
      margin: 30px 0;
      position: relative;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent);
      
      .diamond {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #D4AF37;
        transform: rotate(45deg);
        left: calc(50% - 6px);
        top: -6px;
      }
    }
    
    p {
      margin-bottom: 20px;
      font-size: 1.05rem;
      line-height: 1.8;
      color: #e0e0e0;
      
      &.intro-paragraph {
        font-size: 1.1rem;
        font-weight: 300;
      }
      
      strong {
        color: #D4AF37;
        font-weight: 600;
      }
    }
    
    .signature-block {
      margin: 40px 0;
      
      .signature {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem;
        color: #D4AF37;
        margin-bottom: 5px;
        font-style: italic;
      }
      
      .designation {
        font-size: 0.9rem;
        color: #ccc;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
    
    .awards-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 30px;
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
      
      .award {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border-left: 3px solid #D4AF37;
        
        .award-icon {
          font-size: 2rem;
        }
        
        .award-details {
          h5 {
            margin: 0 0 5px;
            font-size: 1rem;
            font-weight: 600;
            color: #D4AF37;
          }
          
          p {
            margin: 0;
            font-size: 0.85rem;
            color: #ccc;
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
    
    .text-container {
      .section-heading {
        .title {
          font-size: 2rem;
        }
      }
    }
    
    .image-container {
      .founder-image {
        height: 400px;
      }
      
      .experience-badge {
        width: 100px;
        height: 100px;
        
        .years {
          font-size: 2.5rem;
        }
        
        .text {
          font-size: 0.7rem;
        }
      }
    }
  }
  
  @media (max-width: 576px) {
    .image-container {
      .founder-image {
        height: 350px;
      }
    }
  }
`;

export default PersonalIntro;
