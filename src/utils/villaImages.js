// Import villa images from src/assets for automatic Vite content-hashing & caching
import AP1 from "../assets/villas/AmrithPalace/AP8.jpg"
import EC1 from "../assets/villas/eastcoastvilla/EC1.jpg"
import anandvilla1 from "../assets/villas/empireanandvillasamudra/anandvilla1.jpg"
import RW1 from "../assets/villas/ramwatervilla/RW1.jpg"
import LAV1 from "../assets/villas/LavishVilla 1/lvone18.jpg"
import LAV2 from "../assets/villas/LavishVilla 2/lvtwo22.jpg"
import LAV3 from "../assets/villas/LavishVilla 3/lvthree5.jpg"
import OPAL5 from "../assets/villas/opal/opal5.jpg"

// Villa image mapping for each villa type
const villaImageMap = {
  "Amrith Palace": AP1,
  "East Coast Villa": EC1,
  "Empire Anand Villa Samudra": anandvilla1,
  "Ram Water Villa": RW1,
  "Lavish Villa I": LAV1,
  "Lavish Villa II": LAV2,
  "Lavish Villa III": LAV3,
  "Opal Villa": OPAL5,
  "Opal": OPAL5,
  "default": AP1  // Default image if no match found
};

// Helper function to find the appropriate villa image
export const getVillaImage = (villaName) => {
  if (!villaName) return villaImageMap.default;
  
  // Direct match
  if (villaImageMap[villaName]) {
    return villaImageMap[villaName];
  }
  
  // Case insensitive partial match - check longer Roman numerals first
  const lowerName = villaName.toLowerCase();
  if (lowerName.includes('opal')) {
    return villaImageMap["Opal Villa"];
  } else if (lowerName.includes('amrith') || lowerName.includes('palace')) {
    return villaImageMap["Amrith Palace"];
  } else if (lowerName.includes('east') || lowerName.includes('coast')) {
    return villaImageMap["East Coast Villa"];
  } else if (lowerName.includes('empire') || lowerName.includes('anand') || lowerName.includes('samudra')) {
    return villaImageMap["Empire Anand Villa Samudra"];
  } else if (lowerName.includes('ram') || lowerName.includes('water')) {
    return villaImageMap["Ram Water Villa"];
  } else if (lowerName.includes('lavish') && lowerName.includes('iii')) {
    return villaImageMap["Lavish Villa III"];
  } else if (lowerName.includes('lavish') && lowerName.includes('ii')) {
    return villaImageMap["Lavish Villa II"];
  } else if (lowerName.includes('lavish') && lowerName.includes('i')) {
    return villaImageMap["Lavish Villa I"];
  }
  
  return villaImageMap.default;
};