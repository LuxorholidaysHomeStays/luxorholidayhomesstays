import React, { useEffect, useState, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const VILLA_COLLECTIONS = [
  {
    id: 'amrithPalace',
    name: 'Amrith Palace',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/AmrithPalace/AP${i + 1}.jpg`,
      villa: 'Amrith Palace',
      tag: 'Heritage Luxury'
    }))
  },
  {
    id: 'eastCoastVilla',
    name: 'East Coast Villa',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/eastcoastvilla/EC${i + 1}.jpg`,
      villa: 'East Coast Villa',
      tag: 'Beachfront Living'
    }))
  },
  {
    id: 'lavishVilla1',
    name: 'Lavish Villa 1',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/LavishVilla 1/lvone${i + 1}.jpg`,
      villa: 'Lavish Villa 1',
      tag: 'Private Haven'
    }))
  },
  {
    id: 'lavishVilla2',
    name: 'Lavish Villa 2',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/LavishVilla 2/lvtwo${i + 1}.jpg`,
      villa: 'Lavish Villa 2',
      tag: 'Grand Estate'
    }))
  },
  {
    id: 'anandVilla',
    name: 'Anand Villa',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/empireanandvillasamudra/anandvilla${i + 1}.jpg`,
      villa: 'Empire Anand Villa',
      tag: 'Royal Samudra'
    }))
  },
  {
    id: 'hermesVilla',
    name: 'Hermes Villa',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/hermesvilla/hermes${i + 1}.jpg`,
      villa: 'Hermes Villa 4Bhk',
      tag: 'Beach House Luxury'
    }))
  },
  {
    id: 'ramNewWaterVilla',
    name: 'Ram New Water Villa',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/ramnewwatervilla/ramnew${i + 1}.jpg`,
      villa: 'Ram New Water Villa 5Bhk',
      tag: 'Coastal Sanctuary'
    }))
  },
  {
    id: 'rooftopVilla',
    name: 'Rooftop Villa',
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/rooftopvilla/rooftop${i + 1}.jpg`,
      villa: 'Rooftop Villa 2Bhk',
      tag: 'Rooftop Pool Retreat'
    }))
  }
];

const ALL_IMAGES = VILLA_COLLECTIONS.flatMap(col => col.images);

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      disable: 'mobile'
    });
  }, []);

  const filteredImages = activeFilter === 'all'
    ? ALL_IMAGES
    : (VILLA_COLLECTIONS.find(col => col.id === activeFilter)?.images || []);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = useCallback((direction) => {
    if (selectedIndex === null) return;
    if (direction === 'next') {
      setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    } else {
      setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, navigateLightbox]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white text-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EE] border border-[#C4A454]/30 text-[#B58E3E] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-3">
            Our Luxury Collection
          </h2>
          <div className="w-20 sm:w-24 h-0.5 bg-[#C4A454] mx-auto mb-4 rounded-full" />
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Explore our exquisite villas through this curated visual showcase of architectural elegance and comfort.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white border border-black'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            All Properties ({ALL_IMAGES.length})
          </button>

          {VILLA_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveFilter(col.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeFilter === col.id
                  ? 'bg-black text-white border border-black'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {filteredImages.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              data-aos="fade-up"
              data-aos-delay={(index % 6) * 60}
              onClick={() => openLightbox(index)}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[4/3] cursor-pointer hover:border-[#C4A454]/60 transition-all duration-300"
            >
              <img
                src={item.url}
                alt={`${item.villa} photo`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Bottom Gradient & Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                <div className="self-end">
                  <div className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">
                    {item.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                    {item.villa}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between text-white z-20 pointer-events-none">
            <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm font-medium text-gray-300">
              <span className="text-[#C4A454] font-semibold">{selectedIndex + 1}</span> / {filteredImages.length}
            </div>

            <button
              onClick={closeLightbox}
              className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-2 sm:left-6 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-2 sm:right-6 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div
            className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedIndex]?.url}
              alt="Enlarged villa view"
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10"
            />
            <div className="mt-3 text-center">
              <p className="text-white font-serif font-semibold text-base sm:text-lg">
                {filteredImages[selectedIndex]?.villa}
              </p>
              <span className="text-xs sm:text-sm text-gray-400">
                {filteredImages[selectedIndex]?.tag}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
