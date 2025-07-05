import React, { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: "/images/villa1.jpg", alt: "Luxury villa with swimming pool aerial view" },
    { id: 2, src: "/images/villa2.jpg", alt: "Interior view of luxury villa living room" },
    { id: 3, src: "/images/villa3.jpg", alt: "Modern villa with infinity pool" },
    { id: 4, src: "/images/villa4.jpg", alt: "Beachfront villa with palm trees" },
    { id: 5, src: "/images/villa5.jpg", alt: "Villa with garden and pool" },
    { id: 6, src: "/images/villa6.jpg", alt: "Luxury villa exterior with landscaping" },
    { id: 7, src: "/images/villa7.jpg", alt: "Villa bedroom with ocean view" },
    { id: 8, src: "/images/villa8.jpg", alt: "Villa kitchen and dining area" },
    { id: 9, src: "/images/villa9.jpg", alt: "Villa bathroom with jacuzzi" },
    { id: 10, src: "/images/villa10.jpg", alt: "Villa terrace with outdoor furniture" },
    { id: 11, src: "/images/villa11.jpg", alt: "Villa garden with palm trees" },
    { id: 12, src: "/images/villa12.jpg", alt: "Villa with private beach access" },
    { id: 13, src: "/images/villa13.jpg", alt: "Villa with mountain view" },
    { id: 14, src: "/images/villa14.jpg", alt: "Villa with sunset view" },
    { id: 15, src: "/images/villa15.jpg", alt: "Villa with outdoor dining area" },
    { id: 16, src: "/images/villa16.jpg", alt: "Villa with private garden" },
    { id: 17, src: "/images/villa17.jpg", alt: "Villa with swimming pool at night" },
    { id: 18, src: "/images/villa18.jpg", alt: "Villa with luxury interior" },
    { id: 19, src: "/images/villa19.jpg", alt: "Villa with panoramic view" },
    { id: 20, src: "/images/villa20.jpg", alt: "Villa with modern architecture" },
    { id: 21, src: "/images/villa21.jpg", alt: "Villa with tropical garden" },
    { id: 22, src: "/images/villa22.jpg", alt: "Villa with beachfront view" },
    { id: 23, src: "/images/villa23.jpg", alt: "Villa with luxury pool" },
    { id: 24, src: "/images/villa24.jpg", alt: "Villa interior design" },
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="py-6 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold text-center">Gallery</h1>
          <p className="text-center text-gray-600 mt-2">Explore our beautiful villas and properties</p>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div 
              key={image.id} 
              className="overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]"
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.src || "/placeholder.svg"} 
                alt={image.alt} 
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={closeLightbox}
            >
              &times;
            </button>
            <img 
              src={selectedImage.src || "/placeholder.svg"} 
              alt={selectedImage.alt} 
              className="max-h-[90vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;