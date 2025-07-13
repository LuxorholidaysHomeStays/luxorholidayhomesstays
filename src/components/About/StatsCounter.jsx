import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaTrophy, FaHome, FaSmileBeam, FaStar } from 'react-icons/fa';

const StatsCounter = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Stats data
  const stats = [
    {
      value: 15,
      suffix: '+',
      title: 'Years of Excellence',
      icon: <FaTrophy />,
      description: 'Delivering exceptional luxury experiences'
    },
    {
      value: 12,
      suffix: '',
      title: 'Luxury Properties',
      icon: <FaHome />,
      description: 'Handpicked villas across prime locations'
    },
    {
      value: 5000,
      suffix: '+',
      title: 'Happy Guests',
      icon: <FaSmileBeam />,
      description: 'Creating memories and earning smiles'
    },
    {
      value: 98,
      suffix: '%',
      title: 'Satisfaction Rate',
      icon: <FaStar />,
      description: 'Consistent quality and service excellence'
    }
  ];

  // Counter animation hook
  const useCounter = (end, start = 0, duration = 2000) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const [inView, setInView] = useState(false);
    const nodeRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (nodeRef.current) {
        observer.observe(nodeRef.current);
      }

      return () => {
        if (nodeRef.current) {
          observer.disconnect();
        }
      };
    }, []);

    useEffect(() => {
      if (!inView) return;

      let startTime;
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        const currentCount = Math.floor(start + percentage * (end - start));
        
        if (countRef.current !== currentCount) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        if (percentage < 1) {
          requestAnimationFrame(animateCount);
        }
      };

      requestAnimationFrame(animateCount);
    }, [end, start, duration, inView]);

    return { count, nodeRef };
  };

  return (
    <StatsSection>
      <GoldOverlay />
      <div className="container">
        <div className="stats-header" data-aos="fade-down">
          <h2 className="title">Luxor By The Numbers</h2>
          <p className="subtitle">Our achievements reflect our commitment to excellence</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const { count, nodeRef } = useCounter(stat.value);
            
            return (
              <div 
                className="stat-item" 
                key={index} 
                ref={nodeRef}
                data-aos="zoom-in" 
                data-aos-delay={index * 100}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">
                  <span className="number">{count}</span>
                  <span className="suffix">{stat.suffix}</span>
                </div>
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-description">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <DecorativeLine className="top" />
      <DecorativeLine className="bottom" />
    </StatsSection>
  );
};

const StatsSection = styled.section`
  padding: 100px 0;
  
  position: relative;
  overflow: hidden;
  color: #fff;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  .stats-header {
    text-align: center;
    margin-bottom: 60px;
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      color: #D4AF37;
      margin: 0 0 15px;
      font-weight: 700;
      
      @media (max-width: 768px) {
        font-size: 2.2rem;
      }
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
  }
  
  .stats-grid {
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
  
  .stat-item {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 40px 20px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.1);
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      border-color: rgba(212, 175, 55, 0.3);
      
      &:before {
        transform: translateX(0);
      }
      
      .stat-icon {
        transform: scale(1.2);
      }
    }
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(to right, #D4AF37, #F5D76E);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 20px;
      transition: transform 0.3s ease;
    }
    
    .stat-value {
      font-size: 3.5rem;
      font-weight: 700;
      color: #D4AF37;
      line-height: 1;
      margin-bottom: 15px;
      font-family: 'Playfair Display', serif;
      
      .number {
        display: inline-block;
      }
      
      .suffix {
        font-size: 2.5rem;
      }
    }
    
    .stat-title {
      font-size: 1.2rem;
      margin: 0 0 15px;
      color: #fff;
      font-weight: 600;
    }
    
    .stat-description {
      font-size: 0.9rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const GoldOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
`;

const DecorativeLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent);
  
  &.top {
    top: 0;
  }
  
  &.bottom {
    bottom: 0;
  }
`;

export default StatsCounter;
