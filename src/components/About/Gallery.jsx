import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaSearch, FaExpand } from 'react-icons/fa';

// Import all images - limiting to 5 images per villa as requested
const VILLA_IMAGES = {
  amrithPalace: Array.from({ length: 5 }, (_, i) => `/AmrithPalace/AP${i + 1}.jpg`),
  eastCoastVilla: Array.from({ length: 5 }, (_, i) => `/eastcoastvilla/EC${i + 1}.jpg`),
  lavishVilla1: Array.from({ length: 5 }, (_, i) => `/LavishVilla 1/lvone${i + 1}.jpg`),
  lavishVilla2: Array.from({ length: 5 }, (_, i) => `/LavishVilla 2/lvtwo${i + 1}.jpg`),
  anandVilla: Array.from({ length: 5 }, (_, i) => `/empireanandvillasamudra/anandvilla${i + 1}.jpg`),
//   ramWaterVilla: Array.from({ length: 5 }, (_, i) => `/ramwatervilla/rwv${i + 1}.jpg`)
  // Removed villa images 26-30 as requested
};

const Gallery = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  // State for the gallery
  const [filter, setFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Get all images for display
  const allImages = Object.values(VILLA_IMAGES).flat();
  
  // Get filtered images
  const getFilteredImages = () => {
    if (filter === 'all') return allImages;
    return VILLA_IMAGES[filter] || [];
  };

  // Handle image click for lightbox
  const handleImageClick = (image) => {
    setActiveImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Navigate through lightbox
  const navigateLightbox = (direction) => {
    const currentImages = getFilteredImages();
    const currentIndex = currentImages.indexOf(activeImage);
    
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % currentImages.length;
      setActiveImage(currentImages[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      setActiveImage(currentImages[prevIndex]);
    }
  };

  return (
    <GallerySection>
      <div className="container">
        <div className="gallery-header" data-aos="fade-up">
          <h2 className="title">Our Luxury Collection</h2>
          <p className="subtitle">Explore our exquisite villas through these captivating images</p>
        </div>
        
        <FilterContainer data-aos="fade-up">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Properties
          </button>
          <button 
            className={filter === 'amrithPalace' ? 'active' : ''} 
            onClick={() => setFilter('amrithPalace')}
          >
            Amrith Palace
          </button>
          <button 
            className={filter === 'eastCoastVilla' ? 'active' : ''} 
            onClick={() => setFilter('eastCoastVilla')}
          >
            East Coast Villa
          </button>
          <button 
            className={filter === 'lavishVilla1' ? 'active' : ''} 
            onClick={() => setFilter('lavishVilla1')}
          >
            Lavish Villa 1
          </button>
          <button 
            className={filter === 'anandVilla' ? 'active' : ''} 
            onClick={() => setFilter('anandVilla')}
          >
            Anand Villa
          </button>
        </FilterContainer>
        
        <GalleryGrid>
          {getFilteredImages().map((image, index) => (
            <GalleryItem 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={index % 6 * 100}
              onClick={() => handleImageClick(image)}
            >
              <img src={image} alt={`Luxury Villa ${index + 1}`} />
              <div className="overlay">
                <FaExpand className="search-icon" />
              </div>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </div>
      
      {lightboxOpen && (
        <Lightbox>
          <div className="lightbox-content">
            <button className="close" onClick={closeLightbox}>×</button>
            <button className="nav prev" onClick={() => navigateLightbox('prev')}>‹</button>
            <div className="image-container">
              <img src={activeImage} alt="Enlarged view" />
            </div>
            <button className="nav next" onClick={() => navigateLightbox('next')}>›</button>
          </div>
          <div className="lightbox-backdrop" onClick={closeLightbox}></div>
        </Lightbox>
      )}
    </GallerySection>
  );
};

const GallerySection = styled.section`
  padding: 100px 0;
  position: relative;
  color: #333;
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .gallery-header {
    text-align: center;
    margin-bottom: 50px;
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      color: #D4AF37;
      margin: 0 0 20px;
      position: relative;
      display: inline-block;
      
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
        font-size: 2.5rem;
      }
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: rgba(0, 0, 0, 0.8);
      margin: 20px 0 0;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  
  button {
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #333;
    padding: 10px 20px;
    margin: 0 10px 10px 0;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    
    &:hover, &.active {
      background: #D4AF37;
      color: #000;
    }
    
    &:focus {
      outline: none;
    }
    
    @media (max-width: 768px) {
      padding: 8px 16px;
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-gap: 10px;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  height: 250px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:nth-child(3n+1) {
    grid-column: span 2;
    
    @media (max-width: 992px) {
      grid-column: auto;
    }
  }
  
  &:nth-child(4n) {
    grid-row: span 2;
    
    @media (max-width: 992px) {
      grid-row: auto;
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .search-icon {
      color: #D4AF37;
      font-size: 2rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
  
  &:hover {
    img {
      transform: scale(1.1);
    }
    
    .overlay {
      opacity: 1;
      
      .search-icon {
        opacity: 1;
      }
    }
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .lightbox-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
  }
  
  .lightbox-content {
    position: relative;
    z-index: 10;
    width: 90%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border: 5px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
      }
    }
    
    .close {
      position: absolute;
      top: -40px;
      right: 0;
      background: transparent;
      border: none;
      color: #D4AF37;
      font-size: 2.5rem;
      cursor: pointer;
      z-index: 11;
      
      &:focus {
        outline: none;
      }
    }
    
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(212, 175, 55, 0.2);
      border: none;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #fff;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(212, 175, 55, 0.5);
      }
      
      &:focus {
        outline: none;
      }
      
      &.prev {
        left: 20px;
      }
      
      &.next {
        right: 20px;
      }
    }
  }
`;

export default Gallery;
