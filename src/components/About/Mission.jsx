import React, { useEffect } from 'react';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaCompass, FaEye, FaCheckCircle, FaLightbulb, FaHandshake, FaLeaf, FaUsers } from 'react-icons/fa';

const Mission = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <MissionSection>
      <div className="container">
        <div className="mission-heading" data-aos="fade-down">
          <span className="subtitle">Our Purpose</span>
          <h2 className="title">Mission & Vision</h2>
          <div className="divider">
            <div className="line"></div>
            <div className="diamond"></div>
            <div className="line"></div>
          </div>
        </div>

        <div className="content-grid">
          <div className="mission-box" data-aos="fade-right">
            <div className="icon-box">
              <div className="icon">
                <FaCompass className="mission-icon" />
              </div>
            </div>
            <div className="content">
              <h3>Our Mission</h3>
              <p>
                To elevate the standard of luxury accommodations by offering meticulously curated villas 
                that combine opulent comfort with authentic local experiences. We strive to create 
                unforgettable memories for our guests through impeccable service, attention to detail,
                and a deep commitment to exceeding expectations.
              </p>
              
              <ul className="mission-points">
                <li>
                  <span className="point-icon"><FaCheckCircle /></span>
                  <span className="point-text">Creating unparalleled guest experiences</span>
                </li>
                <li>
                  <span className="point-icon"><FaCheckCircle /></span>
                  <span className="point-text">Offering personalized luxury accommodations</span>
                </li>
                <li>
                  <span className="point-icon"><FaCheckCircle /></span>
                  <span className="point-text">Setting new standards in hospitality excellence</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="vision-box" data-aos="fade-left">
            <div className="icon-box">
              <div className="icon">
                <FaEye className="vision-icon" />
              </div>
            </div>
            <div className="content">
              <h3>Our Vision</h3>
              <p>
                To be the premier provider of luxury villa experiences in Chennai and Pondicherry, 
                recognized internationally for our distinctive properties, exceptional service, 
                and dedication to creating meaningful connections between travelers and destinations.
              </p>
              
              <div className="vision-statement">
                <p>
                  "We envision a world where luxury travel is not just about lavish amenities, 
                  but about transformative experiences that enrich lives and create lasting memories."
                </p>
                <div className="quote-author">— Gunaseelan Neelakandan, Founder & Managing Director</div>
              </div>
            </div>
          </div>
          
          {/* <div className="values-box" data-aos="fade-up">
            <h3 className="values-title">Core Values</h3>
            
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon"><FaLightbulb /></div>
                <h4>Excellence</h4>
                <p>We pursue excellence in every detail, from property selection to guest service.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon"><FaHandshake /></div>
                <h4>Authenticity</h4>
                <p>We celebrate local culture and provide genuine experiences.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon"><FaLeaf /></div>
                <h4>Innovation</h4>
                <p>We continuously evolve our offerings to exceed expectations.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon"><FaUsers /></div>
                <h4>Responsibility</h4>
                <p>We operate with integrity and respect for communities and the environment.</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </MissionSection>
  );
};

const MissionSection = styled.section`
  padding: 100px 0;

  color: #fff;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  .mission-heading {
    text-align: center;
    margin-bottom: 60px;
    
    .subtitle {
      display: block;
      font-size: 1.1rem;
      color: #D4AF37;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      margin: 0 0 20px;
      color: black;
      font-weight: 700;
    }
    
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin: 0 auto;
      width: 100%;
      max-width: 300px;
      
      .line {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
        flex: 1;
      }
      
      .diamond {
        width: 12px;
        height: 12px;
        background-color: #D4AF37;
        transform: rotate(45deg);
      }
    }
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "mission vision"
      "values values";
    gap: 40px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      grid-template-areas: 
        "mission"
        "vision"
        "values";
    }
  }
  
  .mission-box {
    grid-area: mission;
    background: linear-gradient(45deg, rgba(25, 25, 25, 0.9), rgba(15, 15, 15, 0.9));
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    display: flex;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 175, 55, 0.1);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: #D4AF37;
    }
    
    .icon-box {
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background: rgba(212, 175, 55, 0.05);
      
      .icon {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #D4AF37;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        
        i {
          font-size: 2rem;
          color: #000;
        }
      }
    }
    
    .content {
      padding: 30px;
      flex: 1;
      
      h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        color: #D4AF37;
        margin: 0 0 20px;
      }
      
      p {
        line-height: 1.7;
        margin-bottom: 25px;
        color: #e0e0e0;
      }
      
      .mission-points {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          
          .point-icon {
            color: #D4AF37;
            font-size: 1.2rem;
            margin-right: 15px;
            display: flex;
            align-items: center;
          }
          
          .point-text {
            flex: 1;
            line-height: 1.5;
          }
        }
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      
      .icon-box {
        padding: 20px;
        
        .icon {
          width: 50px;
          height: 50px;
          
          i {
            font-size: 1.5rem;
          }
        }
      }
      
      &:before {
        width: 100%;
        height: 3px;
      }
    }
  }
  
  .vision-box {
    grid-area: vision;
    background: linear-gradient(45deg, rgba(15, 15, 15, 0.9), rgba(25, 25, 25, 0.9));
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    display: flex;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 175, 55, 0.1);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 3px;
      height: 100%;
      background: #D4AF37;
    }
    
    .icon-box {
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background: rgba(212, 175, 55, 0.05);
      
      .icon {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #D4AF37;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        
        i {
          font-size: 2rem;
          color: #000;
        }
      }
    }
    
    .content {
      padding: 30px;
      flex: 1;
      
      h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        color: #D4AF37;
        margin: 0 0 20px;
      }
      
      p {
        line-height: 1.7;
        margin-bottom: 25px;
        color: #e0e0e0;
      }
      
      .vision-statement {
        background: rgba(212, 175, 55, 0.05);
        border-left: 3px solid #D4AF37;
        padding: 20px;
        margin-top: 20px;
        
        p {
          font-style: italic;
          margin-bottom: 10px;
          font-size: 1.1rem;
          color: #fff;
        }
        
        .quote-author {
          text-align: right;
          font-size: 0.9rem;
          color: #D4AF37;
        }
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      
      .icon-box {
        padding: 20px;
        
        .icon {
          width: 50px;
          height: 50px;
          
          i {
            font-size: 1.5rem;
          }
        }
      }
      
      &:before {
        width: 100%;
        height: 3px;
        top: auto;
        bottom: 0;
      }
    }
  }
  
  .values-box {
    grid-area: values;
    margin-top: 20px;
    
    .values-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: #D4AF37;
      margin-bottom: 40px;
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 2px;
        background: #D4AF37;
      }
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      
      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
    
    .value-item {
      background: rgba(25, 25, 25, 0.6);
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      border: 1px solid rgba(212, 175, 55, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        border-color: rgba(212, 175, 55, 0.3);
        
        .value-icon {
          color: #D4AF37;
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
        }
      }
      
      .value-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 2.2rem;
        color: #D4AF37;
        transition: all 0.3s ease;
        filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
      }
      
      h4 {
        font-size: 1.3rem;
        margin: 0 0 15px;
        color: #D4AF37;
      }
      
      p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #e0e0e0;
        margin: 0;
      }
    }
  }
`;

export default Mission;
