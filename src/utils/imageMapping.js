import roomImg11 from '../assets/roomImg11.png';
import roomImg12 from '../assets/roomImg12.png';
import roomImg13 from '../assets/roomImg13.png';
import roomImg14 from '../assets/roomImg14.png';
import roomImg21 from '../assets/roomImg21.png';
import roomImg22 from '../assets/roomImg22.png';
import roomImg23 from '../assets/roomImg23.png';
import roomImg24 from '../assets/roomImg24.png';


// Map image filenames to imported assets
const imageMap = {
  'roomImg11.png': roomImg11,
  'roomImg12.png': roomImg12,
  'roomImg13.png': roomImg13,
  'roomImg14.png': roomImg14,
  'roomImg21.png': roomImg21,
  'roomImg22.png': roomImg22,
  'roomImg23.png': roomImg23,
  'roomImg24.png': roomImg24,
};

// Function to get image from filename
export const getImageByFilename = (filename) => {
  console.log(`Getting image for filename: ${filename}`);
  
  // Handle case where image path contains directories
  const simpleFilename = filename.split('/').pop();
  
  if (!imageMap[simpleFilename]) {
    console.warn(`Image not found for: ${filename}`);
    return '';
  }
  
  return imageMap[simpleFilename];
};