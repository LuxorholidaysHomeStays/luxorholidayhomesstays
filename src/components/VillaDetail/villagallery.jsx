import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Grid3X3, X, Maximize2 } from "lucide-react"

export default function VillaGallery({ villa }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const thumbnailStripRef = useRef(null)

  const images = villa?.images && villa.images.length > 0 ? villa.images : ["/placeholder.svg"]

  const nextImage = (e) => {
    if (e) e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    if (e) e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openModal = (index) => {
    setModalImageIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const nextModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal()
      } else if (e.key === "ArrowRight") {
        nextModalImage()
      } else if (e.key === "ArrowLeft") {
        prevModalImage()
      }
    }

    // Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen, nextModalImage, prevModalImage])

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (isModalOpen && thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.querySelector(`[data-index="${modalImageIndex}"]`)
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [modalImageIndex, isModalOpen])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-[320px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
        {/* Hero Image */}
        <div
          className="lg:col-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => openModal(currentImageIndex)}
        >
          <img
            src={images[currentImageIndex] || images[0]}
            alt={villa?.name || "Villa"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Expand Hint on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-black/70 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Click to preview
            </span>
          </div>

          {/* Navigation Arrows on Hero */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center border border-gray-200 transition-all duration-200 hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center border border-gray-200 transition-all duration-200 hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs sm:text-sm px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Grid (Desktop / Tablet) */}
        <div className="hidden lg:grid col-span-2 grid-cols-2 gap-3">
          {images.slice(1, 5).map((image, index) => {
            const actualIndex = index + 1
            const isLast = index === 3 && images.length > 5

            return (
              <div
                key={actualIndex}
                className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-200"
                onClick={() => openModal(actualIndex)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${villa?.name || "Villa"} - Photo ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                />

                {/* Show More Overlay on Last Thumbnail */}
                {isLast && (
                  <div className="absolute inset-0 bg-black/60 hover:bg-black/70 flex flex-col items-center justify-center transition-all duration-300">
                    <span className="text-white text-2xl font-bold text-center">
                      +{images.length - 4}
                    </span>
                    <span className="text-white text-xs font-medium tracking-wide mt-1">
                      More Photos
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* View All Photos Button */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => openModal(0)}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-gray-50 border border-gray-300 hover:border-[#D4AF37] rounded-xl transition-all duration-200 text-sm sm:text-base font-semibold text-gray-800 hover:text-[#D4AF37] active:scale-95"
        >
          <Grid3X3 className="h-4 w-4 text-[#D4AF37]" />
          <span>View All {images.length} Photos</span>
        </button>
      </div>

      {/* Interactive Center Lightbox Popup Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6"
          onClick={closeModal}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between w-full max-w-7xl mx-auto pb-3 text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm sm:text-base text-gray-100 truncate max-w-[200px] sm:max-w-md">
                {villa?.name || "Villa Gallery"}
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-300">
                {modalImageIndex + 1} of {images.length}
              </span>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all duration-200 hover:rotate-90 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Main Stage */}
          <div
            className="relative flex-1 flex items-center justify-center min-h-0 py-2 sm:py-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={prevModalImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-30 cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Centered Image */}
            <div className="relative max-h-full max-w-full flex items-center justify-center px-2">
              <img
                src={images[modalImageIndex]}
                alt={`${villa?.name || "Villa"} - ${modalImageIndex + 1}`}
                className="max-h-[60vh] sm:max-h-[70vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl border border-white/10 shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={nextModalImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-30 cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div
            className="w-full max-w-5xl mx-auto pt-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={thumbnailStripRef}
              className="flex items-center gap-2 overflow-x-auto py-2 px-2 scrollbar-none justify-start sm:justify-center"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  data-index={idx}
                  type="button"
                  onClick={() => setModalImageIndex(idx)}
                  className={`relative flex-shrink-0 w-14 h-11 sm:w-18 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                    modalImageIndex === idx
                      ? "border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105 opacity-100"
                      : "opacity-40 hover:opacity-80 border border-white/10"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
