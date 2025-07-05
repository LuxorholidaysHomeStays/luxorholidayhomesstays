import React from 'react';

const Partners = () => {
  const partnerCategories = [
    {
      title: "Property Owners",
      description: "Join our network of luxury villa owners and benefit from our global reach and marketing expertise.",
      benefits: [
        "Access to high-value clients worldwide",
        "Professional property management services",
        "Marketing and promotion of your property",
        "Dedicated account manager",
        "Competitive commission structure"
      ],
      image: "/images/property-owners.jpg"
    },
    {
      title: "Travel Agencies",
      description: "Partner with us to offer your clients exclusive access to our curated collection of luxury villas.",
      benefits: [
        "Competitive commission rates",
        "Access to our complete villa portfolio",
        "Dedicated travel agent portal",
        "Marketing materials and support",
        "Priority booking for your clients"
      ],
      image: "/images/travel-agencies.jpg"
    },
    {
      title: "Concierge Services",
      description: "Enhance your clients' experience with our premium concierge services and exclusive partnerships.",
      benefits: [
        "Seamless integration with villa bookings",
        "Exclusive experiences and activities",
        "Transportation and logistics support",
        "Personal chef and catering services",
        "Special event planning assistance"
      ],
      image: "/images/concierge.jpg"
    },
    {
      title: "Corporate Partners",
      description: "Create memorable corporate retreats and incentive trips with our luxury villa collection.",
      benefits: [
        "Specialized corporate packages",
        "Team-building activities and experiences",
        "Meeting and event spaces",
        "Customized catering options",
        "Dedicated corporate account manager"
      ],
      image: "/images/corporate.jpg"
    }
  ];

  const testimonials = [
    {
      quote: "Partnering with this villa booking platform has transformed our business. The quality of clients and the support we receive is exceptional.",
      author: "Maria Sanchez",
      role: "Property Owner",
      location: "Marbella, Spain",
      image: "/images/testimonial1.jpg"
    },
    {
      quote: "As a travel agency, we've seen a significant increase in client satisfaction since partnering with this platform. The villas are truly exceptional.",
      author: "James Wilson",
      role: "Travel Agent",
      location: "London, UK",
      image: "/images/testimonial2.jpg"
    },
    {
      quote: "The team is incredibly professional and responsive. Our corporate clients are always impressed with the quality of the villas and service.",
      author: "Sophia Chen",
      role: "Corporate Event Planner",
      location: "Singapore",
      image: "/images/testimonial3.jpg"
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-semibold mb-6">Partner With Us</h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Join our network of partners and collaborate with the leading luxury villa booking platform. Together, we can create exceptional experiences for travelers worldwide.
          </p>
          <button className="mt-8 px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-lg">
            Become a Partner
          </button>
        </div>
      </header>

      {/* Partner Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">Partnership Opportunities</h2>
          <div className="space-y-20">
            {partnerCategories.map((category, index) => (
              <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                  <img 
                    src={category.image || "/placeholder.svg"} 
                    alt={category.title} 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </div>
                <div className={`order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                  <h3 className="text-2xl font-semibold mb-4">{category.title}</h3>
                  <p className="text-gray-700 mb-6">{category.description}</p>
                  <h4 className="font-medium mb-4">Benefits:</h4>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">Partner Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image || "/placeholder.svg"} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.author}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">Partnership Process</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Initial Consultation",
                description: "Schedule a call with our partnership team to discuss your needs and opportunities."
              },
              {
                step: "2",
                title: "Proposal & Agreement",
                description: "Receive a customized partnership proposal and review our agreement terms."
              },
              {
                step: "3",
                title: "Onboarding",
                description: "Complete our streamlined onboarding process with dedicated support from our team."
              },
              {
                step: "4",
                title: "Active Partnership",
                description: "Begin your active partnership with ongoing support and regular performance reviews."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-semibold mb-6">Ready to Partner With Us?</h2>
                <p className="text-gray-700 mb-8">
                  Fill out the form and our partnership team will contact you within 24 hours to discuss the next steps.
                </p>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block mb-2 font-medium">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label htmlFor="partnerType" className="block mb-2 font-medium">Partnership Type</label>
                    <select 
                      id="partnerType" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="">Select partnership type</option>
                      <option value="property">Property Owner</option>
                      <option value="agency">Travel Agency</option>
                      <option value="concierge">Concierge Service</option>
                      <option value="corporate">Corporate Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Tell us about your partnership interests"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="bg-gray-100 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <p className="flex items-start">
                    <span className="font-medium w-24">Email:</span>
                    <span className="text-gray-700">partners@villasbooking.com</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-24">Phone:</span>
                    <span className="text-gray-700">+1-800-PARTNER (800-727-8637)</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-24">Address:</span>
                    <span className="text-gray-700">
                      123 Luxury Lane<br />
                      Suite 500<br />
                      Miami, FL 33139<br />
                      United States
                    </span>
                  </p>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Partnership Team Hours</h3>
                  <p className="text-gray-700">Monday - Friday: 9am - 6pm EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;