// Helper functions and collection maps for Villa Images & Fallback Data

export const villaImageCollections = {
  "Amrith Palace": [
    "/AmrithPalace/AP8.jpg", "/AmrithPalace/AP2.jpg", "/AmrithPalace/AP3.jpg", "/AmrithPalace/AP4.jpg",
    "/AmrithPalace/AP5.jpg", "/AmrithPalace/AP6.jpg", "/AmrithPalace/AP7.jpg", "/AmrithPalace/AP1.jpg",
    "/AmrithPalace/AP9.jpg", "/AmrithPalace/AP10.jpg", "/AmrithPalace/AP11.jpg", "/AmrithPalace/AP12.jpg"
  ],
  "East Coast Villa": [
    "/eastcoastvilla/EC1.jpg", "/eastcoastvilla/EC2.jpg", "/eastcoastvilla/EC3.jpg", "/eastcoastvilla/EC4.jpg",
    "/eastcoastvilla/EC5.jpg", "/eastcoastvilla/EC6.jpg", "/eastcoastvilla/EC7.jpg", "/eastcoastvilla/EC8.jpg"
  ],
  "Ram Water Villa": [
    "/ramwatervilla/RW19.jpg", "/ramwatervilla/RW2.jpg", "/ramwatervilla/RW3.jpg", "/ramwatervilla/RW4.jpg",
    "/ramwatervilla/RW5.jpg", "/ramwatervilla/RW6.jpg", "/ramwatervilla/RW7.jpg", "/ramwatervilla/RW8.jpg"
  ],
  "Empire Anand Villa Samudra": [
    "/empireanandvillasamudra/anandvilla1.jpg", "/empireanandvillasamudra/anandvilla2.jpg",
    "/empireanandvillasamudra/anandvilla3.jpg", "/empireanandvillasamudra/anandvilla4.jpg",
    "/empireanandvillasamudra/anandvilla5.jpg", "/empireanandvillasamudra/anandvilla6.jpg"
  ],
  "Lavish Villa I": [
    "/LavishVilla 1/lvone18.jpg", "/LavishVilla 1/lvone2.jpg", "/LavishVilla 1/lvone3.jpg", "/LavishVilla 1/lvone4.jpg",
    "/LavishVilla 1/lvone5.jpg", "/LavishVilla 1/lvone6.jpg", "/LavishVilla 1/lvone7.jpg"
  ],
  "Lavish Villa II": [
    "/LavishVilla 2/lvtwo4.jpg", "/LavishVilla 2/lvtwo2.jpg", "/LavishVilla 2/lvtwo3.jpg", "/LavishVilla 2/lvtwo1.jpg",
    "/LavishVilla 2/lvtwo5.jpg", "/LavishVilla 2/lvtwo6.jpg", "/LavishVilla 2/lvtwo7.jpg"
  ],
  "Lavish Villa III": [
    "/LavishVilla 3/lvthree17.jpg", "/LavishVilla 3/lvthree2.jpg", "/LavishVilla 3/lvthree3.jpg", "/LavishVilla 3/lvthree4.jpg",
    "/LavishVilla 3/lvthree5.jpg", "/LavishVilla 3/lvthree6.jpg"
  ],
  "Opal Villa": [
    "/opal/opal5.jpg", "/opal/opal1.jpg", "/opal/opal2.jpg", "/opal/opal3.jpg",
    "/opal/opal4.jpg", "/opal/opal6.jpg", "/opal/opal7.jpg", "/opal/opal8.jpg",
    "/opal/opal9.jpg", "/opal/opal10.jpg", "/opal/opal11.jpg", "/opal/opal12.jpg",
    "/opal/opal13.jpg", "/opal/opal14.jpg", "/opal/opal15.jpg", "/opal/opal16.jpg",
    "/opal/opal17.jpg", "/opal/opal18.jpg", "/opal/opal19.jpg", "/opal/opal20.jpg",
    "/opal/opal21.jpg", "/opal/opal22.jpg"
  ]
};

export const getBestMatchingVillaImages = (villaName = "") => {
  if (!villaName) return villaImageCollections["Amrith Palace"];

  if (villaImageCollections[villaName]) {
    return villaImageCollections[villaName];
  }

  const lowercase = villaName.toLowerCase().trim();
  for (const [key, imageArray] of Object.entries(villaImageCollections)) {
    if (key.toLowerCase().trim() === lowercase) {
      return imageArray;
    }
  }

  for (const [key, imageArray] of Object.entries(villaImageCollections)) {
    if (lowercase.includes(key.toLowerCase()) || key.toLowerCase().includes(lowercase)) {
      return imageArray;
    }
  }

  const nameKeywords = {
    "opal": "Opal Villa",
    "amrith": "Amrith Palace",
    "palace": "Amrith Palace",
    "east coast": "East Coast Villa",
    "eastcoast": "East Coast Villa",
    "ram water": "Ram Water Villa",
    "ramwater": "Ram Water Villa",
    "empire": "Empire Anand Villa Samudra",
    "anand": "Empire Anand Villa Samudra",
    "samudra": "Empire Anand Villa Samudra",
    "lavish villa 1": "Lavish Villa I",
    "lavish villa i": "Lavish Villa I",
    "lavish villa 2": "Lavish Villa II",
    "lavish villa ii": "Lavish Villa II",
    "lavish villa 3": "Lavish Villa III",
    "lavish villa iii": "Lavish Villa III"
  };

  for (const [keyword, villaKey] of Object.entries(nameKeywords)) {
    if (lowercase.includes(keyword)) {
      return villaImageCollections[villaKey];
    }
  }

  return villaImageCollections["Amrith Palace"];
};

export const createFallbackProperties = () => {
  const fallbackList = [
    {
      name: "Amrith Palace",
      location: "ECR, Chennai",
      price: 25000,
      weekendPrice: 30000,
      bedrooms: 4,
      bathrooms: 4,
      guests: 12,
      rating: 4.9,
      description: "Experience royal luxury at Amrith Palace with private pool, lush green lawn, and spacious oceanview balconies."
    },
    {
      name: "East Coast Villa",
      location: "Mahabalipuram, Chennai",
      price: 18000,
      weekendPrice: 22000,
      bedrooms: 3,
      bathrooms: 3,
      guests: 8,
      rating: 4.8,
      description: "A peaceful seaside sanctuary featuring modern amenities, private garden, and direct beach access."
    },
    {
      name: "Ram Water Villa",
      location: "ECR Road, Kovalam",
      price: 22000,
      weekendPrice: 27000,
      bedrooms: 4,
      bathrooms: 4,
      guests: 10,
      rating: 4.85,
      description: "Luxury waterfront villa with infinity pool, gazebo, BBQ setup, and elegant living spaces."
    },
    {
      name: "Empire Anand Villa Samudra",
      location: "ECR, Chennai",
      price: 28000,
      weekendPrice: 35000,
      bedrooms: 5,
      bathrooms: 5,
      guests: 15,
      rating: 4.95,
      description: "Grand beachside estate ideal for corporate retreats and grand family celebrations."
    },
    {
      name: "Lavish Villa I",
      location: "ECR Beach Road",
      price: 20000,
      weekendPrice: 24000,
      bedrooms: 3,
      bathrooms: 3,
      guests: 8,
      rating: 4.75,
      description: "Cozy lavish stay with private swimming pool and modern indoor games area."
    },
    {
      name: "Lavish Villa II",
      location: "Muttukadu, ECR",
      price: 21000,
      weekendPrice: 25000,
      bedrooms: 4,
      bathrooms: 4,
      guests: 10,
      rating: 4.8,
      description: "Contemporary architectural gem with climate-controlled pool and outdoor dining pavilion."
    },
    {
      name: "Opal Villa",
      location: "ECR, Chennai",
      price: 25000,
      weekendPrice: 35000,
      bedrooms: 4,
      bathrooms: 4,
      guests: 10,
      rating: 4.8,
      description: "Luxurious contemporary villa featuring private pool, elegant living spaces, and top-tier amenities."
    }
  ];

  return fallbackList.map((villa, idx) => {
    const images = getBestMatchingVillaImages(villa.name);
    return {
      id: `fallback-${idx}`,
      _id: `fallback-${idx}`,
      name: villa.name,
      roomType: villa.name,
      hotel: {
        name: villa.name,
        address: villa.location,
        city: villa.location.split(",")[0]?.trim() || "ECR",
      },
      images: images.slice(0, 5),
      allImages: images,
      pricePerNight: villa.price.toLocaleString(),
      pricing: {
        weekday: villa.price.toLocaleString(),
        weekend: villa.weekendPrice.toLocaleString(),
        holiday: Math.round(villa.weekendPrice * 1.2).toLocaleString(),
      },
      description: villa.description,
      amenities: ["Private Pool", "Free WiFi", "AC", "Power Backup", "Garden", "Parking"],
      capacity: villa.guests,
      rating: villa.rating,
      rooms: villa.bedrooms,
      area: "3500 sq ft",
      features: {
        bedrooms: villa.bedrooms,
        bathrooms: villa.bathrooms,
        balcony: "Ocean View",
        speciality: "Private Pool",
      },
    };
  });
};

export const getVillaImage = (villaName) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='32' text-anchor='middle' fill='%23666'%3E${encodeURIComponent(villaName || 'Villa')}%3C/text%3E%3C/svg%3E`;
};

export const getDisplayVillaImage = (villa) => {
  if (villa.mainImage && typeof villa.mainImage === 'string' && villa.mainImage.length > 0) {
    return villa.mainImage;
  }
  return getVillaImage(villa.name);
};

export const formatCompactPrice = (price) => {
  if (!price || isNaN(Number(price))) return "0";
  const num = Number(price);
  if (num >= 1000) {
    return `${Math.round(num / 1000)}k`;
  }
  return `${num}`;
};

export const getAccurateVillaPrice = (villa) => ({
  weekday: Number(villa?.weekdayPrice || villa?.price) || 0,
  weekend: Number(villa?.weekendPrice || villa?.weekendprice) || 0,
});
