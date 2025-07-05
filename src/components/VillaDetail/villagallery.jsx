
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function VillaGallery({ villa }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % villa.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + villa.images.length) % villa.images.length)
  }

  const handleMorePhotosClick = () => {
    const villaNameForRoute = villa.name.toLowerCase().replace(/\s+/g, "-")
    navigate(`/photogallery/${villaNameForRoute}`, {
      state: { 
        images: villa.images, 
        villaName: villa.name, 
        from: `/villa/${villa._id || villa.id}`  // Add source route to return to this villa detail page
      },
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-[350px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
        {/* Hero Image */}
        <div className="lg:col-span-2 relative group">
          <img
            src={villa.images[currentImageIndex] || villa.images[0]}
            alt={villa.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {villa.images.length}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {villa.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setCurrentImageIndex(index + 1)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${villa.name} - Image ${index + 2}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              />

              {/* Show More Overlay on Last Image */}
              {index === 3 && villa.images.length > 5 && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/80 to-[#BFA181]/80 flex items-center justify-center transition-all duration-300 group-hover:from-[#D4AF37]/60 group-hover:to-[#BFA181]/60">
                  <div className="text-white text-center">
                    <div className="text-xl font-bold mb-1">+{villa.images.length - 5}</div>
                    <div className="text-sm opacity-90">More Photos</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View All Photos Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleMorePhotosClick}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-[#BFA181]/10 border-2 border-gray-200 hover:border-[#D4AF37] rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 font-medium text-gray-700 hover:text-[#D4AF37]"
        >
          <Grid3X3 className="h-4 w-4" />
          View All {villa.images.length} Photos
        </button>
      </div>
    </div>
  )
}
