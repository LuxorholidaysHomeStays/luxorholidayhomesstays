"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, X, ArrowDown } from "lucide-react"
import { useNavigate, useParams, useLocation } from "react-router-dom"

// Props are documented here for reference:
// images?: string[]
// villaName?: string
// isOpen?: boolean
// onClose?: () => void
// backTo?: string
// villa?: any

// Villa image collections (same as VillaDetail)
import AP1 from "/AmrithPalace/AP1.jpg"
import AP2 from "/AmrithPalace/AP2.jpg"
import AP3 from "/AmrithPalace/AP3.jpg"
import AP4 from "/AmrithPalace/AP4.jpg"
import AP5 from "/AmrithPalace/AP5.jpg"
import AP6 from "/AmrithPalace/AP6.jpg"
import AP7 from "/AmrithPalace/AP7.jpg"
import AP8 from "/AmrithPalace/AP8.jpg"
import AP9 from "/AmrithPalace/AP9.jpg"
import AP10 from "/AmrithPalace/AP10.jpg"
import AP11 from "/AmrithPalace/AP11.jpg"
import AP12 from "/AmrithPalace/AP12.jpg"
import AP13 from "/AmrithPalace/AP13.jpg"
import AP14 from "/AmrithPalace/AP14.jpg"
import AP15 from "/AmrithPalace/AP15.jpg"
import AP16 from "/AmrithPalace/AP16.jpg"
import AP17 from "/AmrithPalace/AP17.jpg"
import AP18 from "/AmrithPalace/AP18.jpg"
import AP19 from "/AmrithPalace/AP19.jpg"
import AP20 from "/AmrithPalace/AP20.jpg"
import AP21 from "/AmrithPalace/AP21.jpg"
import AP22 from "/AmrithPalace/AP22.jpg"
import AP23 from "/AmrithPalace/AP23.jpg"
import AP24 from "/AmrithPalace/AP24.jpg"
import AP25 from "/AmrithPalace/AP25.jpg"
import AP26 from "/AmrithPalace/AP26.jpg"
import AP27 from "/AmrithPalace/AP27.jpg"
import AP28 from "/AmrithPalace/AP28.jpg"
import AP29 from "/AmrithPalace/AP29.jpg"
import AP30 from "/AmrithPalace/AP30.jpg"

// East Coast Villa Images
import EC1 from "/eastcoastvilla/EC1.jpg"
import EC2 from "/eastcoastvilla/EC2.jpg"
import EC3 from "/eastcoastvilla/EC3.jpg"
import EC4 from "/eastcoastvilla/EC4.jpg"
import EC5 from "/eastcoastvilla/EC5.jpg"
import EC6 from "/eastcoastvilla/EC6.jpg"
import EC7 from "/eastcoastvilla/EC7.jpg"
import EC8 from "/eastcoastvilla/EC8.jpg"
import EC9 from "/eastcoastvilla/EC9.jpg"
import EC10 from "/eastcoastvilla/EC10.jpg"
import EC11 from "/eastcoastvilla/EC11.jpg"
import EC12 from "/eastcoastvilla/EC12.jpg"
import EC13 from "/eastcoastvilla/EC13.jpg"
import EC14 from "/eastcoastvilla/EC14.jpg"
import EC15 from "/eastcoastvilla/EC15.jpg"

// Empire Anand Villa Samudra Images
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
import anandvilla2 from "/empireanandvillasamudra/anandvilla2.jpg"
import anandvilla3 from "/empireanandvillasamudra/anandvilla3.jpg"
import anandvilla4 from "/empireanandvillasamudra/anandvilla4.jpg"
import anandvilla5 from "/empireanandvillasamudra/anandvilla5.jpg"
import anandvilla6 from "/empireanandvillasamudra/anandvilla6.jpg"
import anandvilla7 from "/empireanandvillasamudra/anandvilla7.jpg"
import anandvilla8 from "/empireanandvillasamudra/anandvilla8.jpg"
import anandvilla9 from "/empireanandvillasamudra/anandvilla9.jpg"
import anandvilla10 from "/empireanandvillasamudra/anandvilla10.jpg"
import anandvilla11 from "/empireanandvillasamudra/anandvilla11.jpg"
import anandvilla12 from "/empireanandvillasamudra/anandvilla12.jpg"
import anandvilla13 from "/empireanandvillasamudra/anandvilla13.jpg"
import anandvilla14 from "/empireanandvillasamudra/anandvilla14.jpg"
import anandvilla15 from "/empireanandvillasamudra/anandvilla15.jpg"
import anandvilla16 from "/empireanandvillasamudra/anandvilla16.jpg"

// Ram Water Villa Images
import RW1 from "/ramwatervilla/RW1.jpg"
import RW2 from "/ramwatervilla/RW2.jpg"
import RW3 from "/ramwatervilla/RW3.jpg"
import RW4 from "/ramwatervilla/RW4.jpg"
import RW5 from "/ramwatervilla/RW5.jpg"
import RW6 from "/ramwatervilla/RW6.jpg"
import RW7 from "/ramwatervilla/RW7.jpg"
import RW8 from "/ramwatervilla/RW8.jpg"
import RW9 from "/ramwatervilla/RW9.jpg"
import RW10 from "/ramwatervilla/RW10.jpg"
import RW11 from "/ramwatervilla/RW11.jpg"
import RW13 from "/ramwatervilla/RW13.jpg"
import RW14 from "/ramwatervilla/RW14.jpg"
import RW15 from "/ramwatervilla/RW15.jpg"
import RW16 from "/ramwatervilla/RW16.jpg"
import RW17 from "/ramwatervilla/RW17.jpg"
import RW18 from "/ramwatervilla/RW18.jpg"
import RW19 from "/ramwatervilla/RW19.jpg"

// LavishVilla 1 Images
import lvone2 from "/LavishVilla 1/lvone2.jpg"
import lvone3 from "/LavishVilla 1/lvone3.jpg"
import lvone4 from "/LavishVilla 1/lvone4.jpg"
import lvone5 from "/LavishVilla 1/lvone5.jpg"
import lvone6 from "/LavishVilla 1/lvone6.jpg"
import lvone7 from "/LavishVilla 1/lvone7.jpg"
import lvone8 from "/LavishVilla 1/lvone8.jpg"
import lvone9 from "/LavishVilla 1/lvone9.jpg"
import lvone10 from "/LavishVilla 1/lvone10.jpg"
import lvone11 from "/LavishVilla 1/lvone11.jpg"
import lvone12 from "/LavishVilla 1/lvone12.jpg"
import lvone13 from "/LavishVilla 1/lvone13.jpg"
import lvone14 from "/LavishVilla 1/lvone14.jpg"
import lvone15 from "/LavishVilla 1/lvone15.jpg"
import lvone16 from "/LavishVilla 1/lvone16.jpg"
import lvone17 from "/LavishVilla 1/lvone17.jpg"
import lvone18 from "/LavishVilla 1/lvone18.jpg"
import lvone19 from "/LavishVilla 1/lvone19.jpg"
import lvone20 from "/LavishVilla 1/lvone20.jpg"
import lvone21 from "/LavishVilla 1/lvone21.jpg"
import lvone22 from "/LavishVilla 1/lvone22.jpg"

// LavishVilla 2 Images
import lvtwo1 from "/LavishVilla 2/lvtwo1.jpg"
import lvtwo2 from "/LavishVilla 2/lvtwo2.jpg"
import lvtwo3 from "/LavishVilla 2/lvtwo3.jpg"
import lvtwo4 from "/LavishVilla 2/lvtwo4.jpg"
import lvtwo5 from "/LavishVilla 2/lvtwo5.jpg"
import lvtwo6 from "/LavishVilla 2/lvtwo6.jpg"
import lvtwo7 from "/LavishVilla 2/lvtwo7.jpg"
import lvtwo8 from "/LavishVilla 2/lvtwo8.jpg"
import lvtwo9 from "/LavishVilla 2/lvtwo9.jpg"
import lvtwo10 from "/LavishVilla 2/lvtwo10.jpg"
import lvtwo11 from "/LavishVilla 2/lvtwo11.jpg"
import lvtwo12 from "/LavishVilla 2/lvtwo12.jpg"
import lvtwo13 from "/LavishVilla 2/lvtwo13.jpg"
import lvtwo14 from "/LavishVilla 2/lvtwo14.jpg"
import lvtwo15 from "/LavishVilla 2/lvtwo15.jpg"
import lvtwo16 from "/LavishVilla 2/lvtwo16.jpg"
import lvtwo17 from "/LavishVilla 2/lvtwo17.jpg"
import lvtwo18 from "/LavishVilla 2/lvtwo18.jpg"
import lvtwo19 from "/LavishVilla 2/lvtwo19.jpg"
import lvtwo20 from "/LavishVilla 2/lvtwo20.jpg"
import lvtwo21 from "/LavishVilla 2/lvtwo21.jpg"
import lvtwo22 from "/LavishVilla 2/lvtwo22.jpg"

// LavishVilla 3 Images
import lvthree1 from "/LavishVilla 3/lvthree1.jpg"
import lvthree2 from "/LavishVilla 3/lvthree2.jpg"
import lvthree3 from "/LavishVilla 3/lvthree3.jpg"
import lvthree4 from "/LavishVilla 3/lvthree4.jpg"
import lvthree5 from "/LavishVilla 3/lvthree5.jpg"
import lvthree6 from "/LavishVilla 3/lvthree6.jpg"
import lvthree7 from "/LavishVilla 3/lvthree7.jpg"
import lvthree8 from "/LavishVilla 3/lvthree8.jpg"
import lvthree9 from "/LavishVilla 3/lvthree9.jpg"
import lvthree10 from "/LavishVilla 3/lvthree10.jpg"
import lvthree12 from "/LavishVilla 3/lvthree12.jpg"
import lvthree13 from "/LavishVilla 3/lvthree13.jpg"
import lvthree14 from "/LavishVilla 3/lvthree14.jpg"
import lvthree15 from "/LavishVilla 3/lvthree15.jpg"
import lvthree16 from "/LavishVilla 3/lvthree16.jpg"
import lvthree17 from "/LavishVilla 3/lvthree17.jpg"
import lvthree18 from "/LavishVilla 3/lvthree18.jpg"

// Villa image collections
const villaImageCollections = {
"Amrith Palace": [
AP1,
AP2,
AP3,
AP4,
AP5,
AP6,
AP7,
AP8,
AP9,
AP10,
AP11,
AP12,
AP13,
AP14,
AP15,
AP16,
AP17,
AP18,
AP19,
AP20,
AP21,
AP22,
AP23,
AP24,
AP25,
AP26,
AP27,
AP28,
AP29,
AP30,
],
"East Coast Villa": [EC1, EC2, EC3, EC4, EC5, EC6, EC7, EC8, EC9, EC10, EC11, EC12, EC13, EC14, EC15],
"Ram Water Villa": [
RW1,
RW2,
RW3,
RW4,
RW5,
RW6,
RW7,
RW8,
RW9,
RW10,
RW11,
RW13,
RW14,
RW15,
RW16,
RW17,
RW18,
RW19,
],
"Empire Anand Villa Samudra": [
anandvilla1,
anandvilla2,
anandvilla3,
anandvilla4,
anandvilla5,
anandvilla6,
anandvilla7,
anandvilla8,
anandvilla9,
anandvilla10,
anandvilla11,
anandvilla12,
anandvilla13,
anandvilla14,
anandvilla15,
anandvilla16,
],
"Lavish Villa 1": [
lvone2,
lvone3,
lvone4,
lvone5,
lvone6,
lvone7,
lvone8,
lvone9,
lvone10,
lvone11,
lvone12,
lvone13,
lvone14,
lvone15,
lvone16,
lvone17,
lvone18,
lvone19,
lvone20,
lvone21,
lvone22,
],
"Lavish Villa 2": [
lvtwo1,
lvtwo2,
lvtwo3,
lvtwo4,
lvtwo5,
lvtwo6,
lvtwo7,
lvtwo8,
lvtwo9,
lvtwo10,
lvtwo11,
lvtwo12,
lvtwo13,
lvtwo14,
lvtwo15,
lvtwo16,
lvtwo17,
lvtwo18,
lvtwo19,
lvtwo20,
lvtwo21,
lvtwo22,
],
"Lavish Villa 3": [
lvthree1,
lvthree2,
lvthree3,
lvthree4,
lvthree5,
lvthree6,
lvthree7,
lvthree8,
lvthree9,
lvthree10,
lvthree12,
lvthree13,
lvthree14,
lvthree15,
lvthree16,
lvthree17,
lvthree18,
],
}

const PhotoGallery = ({ images: propImages, villaName: propVillaName, isOpen, onClose, backTo, villa }) => {
const navigate = useNavigate()
const { villaname } = useParams()
const location = useLocation()

const [isLoading, setIsLoading] = useState(true)
const [selectedImageIndex, setSelectedImageIndex] = useState(0)
const [viewMode, setViewMode] = useState("gallery")
const [sourceRoute, setSourceRoute] = useState("")

// If component is used as modal (with props), use those, otherwise use URL params
const isModal = propImages && propVillaName && isOpen !== undefined

// Decode villa name from URL
const decodedVillaName = decodeURIComponent(villaname || "")

// Store source route when component mounts
useEffect(() => {
  if (isModal) {
    // For modal usage, set source route from backTo prop or default to rooms
    setSourceRoute(backTo || "/rooms")
  } else {
    // For URL-based usage, extract the referring path from location state if available
    if (location.state?.from) {
      setSourceRoute(location.state.from)
    } else {
      // Default to allrooms route with the villa name as parameter if no specific source
      setSourceRoute(`/rooms/${villaname}`)
    }
  }
}, [location.state, villaname, isModal, backTo])

// Get images from props (modal) or location state or villa collections
const getVillaImages = () => {
  // If modal usage, use prop images
  if (isModal && propImages) {
    return propImages
  }

  // First check if we have images passed directly via location state
  if (location.state?.images) {
    return location.state.images
  }

  // Try to match villa name with collections
  const matchedCollection = Object.keys(villaImageCollections).find(
    (key) =>
      key.toLowerCase().includes(decodedVillaName.toLowerCase()) ||
      decodedVillaName.toLowerCase().includes(key.toLowerCase()),
  )

  if (matchedCollection) {
    return villaImageCollections[matchedCollection]
  }

  // Default fallback
  return villaImageCollections["Empire Anand Villa Samudra"]
}

const images = getVillaImages()
const villaName = isModal ? propVillaName : (location.state?.villaName || decodedVillaName)

useEffect(() => {
setSelectedImageIndex(0)
}, [images])

useEffect(() => {
if (images.length > 0) {
setIsLoading(true)
const timer = setTimeout(() => {
setIsLoading(false)
}, 800)
return () => clearTimeout(timer)
}
}, [images])

// Add this effect to clean up body styles when unmounting
useEffect(() => {
  // When component mounts, prevent scrolling on the body
  document.body.style.overflow = 'hidden';
  
  // When component unmounts, restore scrolling
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };
}, []);

const handleBackClick = () => {
  // Restore body scroll before navigating
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  
  if (isModal && onClose) {
    // For modal usage, call the onClose callback
    onClose()
  } else {
    // For URL-based usage, navigate to the source route
    if (sourceRoute) {
      navigate(sourceRoute)
    } else {
      // Fallback to previous page if no specific source route is known
      navigate(-1)
    }
  }
}

const getGalleryRows = (imgs) => {
if (!Array.isArray(imgs) || imgs.length === 0) return []

const rows = []
let i = 0
let big = true

while (i < imgs.length) {
if (big) {
rows.push([imgs[i]])
i += 1
} else {
const remainingImages = imgs.slice(i, i + 3)
if (remainingImages.length > 0) {
rows.push(remainingImages)
}
i += 3
}
big = !big
}
return rows
}

const galleryRows = getGalleryRows(images)

// If not open (modal usage), don't render
if (isModal && !isOpen) {
  return null
}

const content = (
<div className={`fixed top-[3rem] md:top-[4rem] left-0 right-0 bottom-0 bg-white z-50 flex flex-col ${viewMode === "split" ? "h-[50vh]" : ""}`}>
{/* Header */}
<div className="w-full bg-white border-b border-gray-200">
<div className="max-w-4xl mx-auto flex items-center justify-between p-4">
<div>
<button
onClick={handleBackClick}
className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
>
<ChevronLeft className="h-5 w-5" />
<span className="font-medium">Back</span>
</button>
</div>
<div className="text-center flex-1">
<h2 className="font-semibold text-gray-900">{villaName} Photos</h2>
</div>
<div className="flex items-center gap-4">

<button
onClick={handleBackClick}
className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
>
<X className="h-5 w-5" />
<span className="font-medium">Close</span>
</button>
</div>
</div>
</div>

{/* Main Content Area */}
<div className="max-h-[85vh] overflow-y-auto bg-gray-50">
<div className="max-w-5xl mx-auto p-6">
{isLoading ? (
<div className="flex items-center justify-center h-[60vh]">
<div className="text-center text-gray-900">
<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
<p className="text-lg font-medium">Loading photos...</p>
</div>
</div>
) : (
<div className="space-y-8">
{/* Alternating Gallery Rows */}
{galleryRows.map((row, rowIdx) => (
<div key={rowIdx} className={`flex gap-6 ${row.length === 1 ? "" : "justify-between"}`}>
{row.length === 1 ? (
// Big image
<div                className={`flex-1 relative cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group ${
                selectedImageIndex === rowIdx * 4 ? "ring-4 ring-[#D4AF37]" : ""
                }`}
style={{ minHeight: "420px", maxHeight: "500px" }}
onClick={() => setSelectedImageIndex(rowIdx * 4)}
>
<img
src={row[0] || "/placeholder.svg"}
alt={`${villaName} ${rowIdx * 4 + 1}`}                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                const target = e.target
                target.onerror = null
                target.src = "/placeholder.svg"
                }}
/>                {selectedImageIndex === rowIdx * 4 && <div className="absolute inset-0 bg-[#D4AF37]/10"></div>}
</div>
) : (
// Three small images
row.map((img, idx) => {
const imgIdx = rowIdx * 4 - 3 + idx
return (
<div
key={imgIdx}                className={`flex-1 relative cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group ${
                selectedImageIndex === imgIdx ? "ring-4 ring-[#D4AF37]" : ""
                }`}
style={{ minHeight: "180px", maxHeight: "220px" }}
onClick={() => setSelectedImageIndex(imgIdx)}
>
<img
src={img || "/placeholder.svg"}
alt={`${villaName} ${imgIdx + 1}`}
className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-200"
onError={(e) => {
const target = e.target
target.onerror = null
target.src = "/placeholder.svg"
}}
/>                {selectedImageIndex === imgIdx && <div className="absolute inset-0 bg-[#D4AF37]/10"></div>}
</div>
)
})
)}
</div>
))}

{/* Image counter */}
<div className="text-center text-gray-500 text-sm">
{selectedImageIndex + 1} of {images.length} photos
</div>

{/* No images message */}
{images.length <= 1 && images[0] === "/placeholder.svg" && (
<div className="text-center py-10">
<p className="text-gray-500">No photos available for this property.</p>
</div>
)}
</div>
)}
</div>
</div>

{/* Bottom action bar */}
{viewMode === "split" && (
<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center backdrop-blur-sm">
Scroll down to see villa details
</div>
)}

{/* Add a floating button to view villa details if we came from a specific villa */}
{sourceRoute && sourceRoute.includes('/villa/') && (
<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
  <button 
    onClick={() => navigate(sourceRoute)}
    className="bg-[#D4AF37] hover:bg-[#E5C048] text-black font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
  >
    <span>View Villa Details</span>
  </button>
</div>
)}
</div>
)

// Return content wrapped in modal overlay if used as modal, otherwise return as-is
return isModal ? (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="w-full h-full bg-white overflow-hidden">
      {content}
    </div>
  </div>
) : content

}

export default PhotoGallery
