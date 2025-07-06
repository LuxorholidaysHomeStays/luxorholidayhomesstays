// Import villa images
import AP1 from "/AmrithPalace/AP8.jpg"
import EC1 from "/eastcoastvilla/EC1.jpg"
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
import RW1 from "/ramwatervilla/RW1.jpg"
import LAV1 from "/LavishVilla 1/lvone18.jpg"
import LAV2 from "/LavishVilla 2/lvtwo22.jpg"
import LAV3 from "/LavishVilla 3/lvthree5.jpg"

// Villa image mapping for each villa type
const villaImageMap = {
  "Amrith Palace": AP1,
  "East Coast Villa": EC1,
  "Empire Anand Villa Samudra": anandvilla1,
  "Ram Water Villa": RW1,
  "Lavish Villa I": LAV1,
  "Lavish Villa II": LAV2,
  "Lavish Villa III": LAV3,
  "default": AP1  // Default image if no match found
};

// Helper function to find the appropriate villa image
export const getVillaImage = (villaName) => {
  if (!villaName) return villaImageMap.default;
  
  // Direct match
  if (villaImageMap[villaName]) {
    return villaImageMap[villaName];
  }
  
  // Case insensitive partial match
  const lowerName = villaName.toLowerCase();
  if (lowerName.includes('amrith') || lowerName.includes('palace')) {
    return villaImageMap["Amrith Palace"];
  } else if (lowerName.includes('east') || lowerName.includes('coast')) {
    return villaImageMap["East Coast Villa"];
  } else if (lowerName.includes('empire') || lowerName.includes('anand') || lowerName.includes('samudra')) {
    return villaImageMap["Empire Anand Villa Samudra"];
  } else if (lowerName.includes('ram') || lowerName.includes('water')) {
    return villaImageMap["Ram Water Villa"];
  } else if (lowerName.includes('lavish') && lowerName.includes('i')) {
    return villaImageMap["Lavish Villa I"];
  } else if (lowerName.includes('lavish') && lowerName.includes('ii')) {
    return villaImageMap["Lavish Villa II"];
  } else if (lowerName.includes('lavish') && lowerName.includes('iii')) {
    return villaImageMap["Lavish Villa III"];
  }
  
  return villaImageMap.default;
};