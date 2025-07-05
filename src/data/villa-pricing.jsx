// Mock data for villa pricing
export const getVillaPricing = (villaName) => {
  const pricingData = {
    "Luxury Villa": {
      weekday: 15000,
      weekend: 25000,
      maxGuests: 12,
      securityDeposit: 20000,
    },
    "Beach Villa": {
      weekday: 18000,
      weekend: 28000,
      maxGuests: 15,
      securityDeposit: 25000,
    },
    "Mountain Villa": {
      weekday: 12000,
      weekend: 20000,
      maxGuests: 10,
      securityDeposit: 15000,
    },
    "Amrith Palace": {
      weekday: 20000,
      weekend: 35000,
      maxGuests: 20,
      securityDeposit: 30000,
    },
    "East Coast Villa": {
      weekday: 16000,
      weekend: 28000,
      maxGuests: 14,
      securityDeposit: 22000,
    },
    "Empire Anand Villa Samudra": {
      weekday: 18000,
      weekend: 32000,
      maxGuests: 16,
      securityDeposit: 25000,
    },
  }

  return pricingData[villaName] || pricingData["Luxury Villa"]
}

export const getPriceForDate = (date, villaName) => {
  const pricing = getVillaPricing(villaName)
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  return isWeekend ? pricing.weekend : pricing.weekday
}

export const formatPrice = (price) => {
  return `₹${(price / 1000).toFixed(0)}k`
}
