import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO component for dynamically updating document head metadata
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Comma separated keywords
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (default: website)
 * @param {string} props.canonicalUrl - Canonical URL (optional)
 */
const SEOHead = ({
  title = 'Luxor Holiday Home Stays | Luxury Villas in Chennai & Pondicherry',
  description = 'Experience premium luxury villa stays in Chennai and Pondicherry with Luxor Holiday Home Stays. Book our exclusive villas with private pools, beachfront views and luxury amenities.',
  keywords = 'luxor, luxor holiday, luxor stay, luxor holiday homestays, luxury villas',
  ogImage = '/AmrithPalace/AP1.jpg',
  ogType = 'website',
  canonicalUrl = ''
}) => {
  const location = useLocation();
  const defaultUrl = 'https://luxorholiday.com';
  const pageUrl = canonicalUrl || `${defaultUrl}${location.pathname}`;

  useEffect(() => {
    // Set page title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', pageUrl, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:image', ogImage.startsWith('http') ? ogImage : `${defaultUrl}${ogImage}`, 'property');
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:url', pageUrl, 'property');
    updateMetaTag('twitter:image', ogImage.startsWith('http') ? ogImage : `${defaultUrl}${ogImage}`, 'property');
    
    // Update canonical URL
    let canonicalElement = document.querySelector("link[rel='canonical']");
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', pageUrl);
    
    // Clean up on unmount
    return () => {
      document.title = 'Luxor Holiday Home Stays';
    };
  }, [title, description, keywords, ogImage, ogType, pageUrl]);

  /**
   * Helper function to update meta tags
   * @param {string} name - Meta tag name or property
   * @param {string} content - Meta tag content
   * @param {string} attribute - Whether to use 'name' or 'property' attribute (default: name)
   */
  const updateMetaTag = (name, content, attribute = 'name') => {
    let metaElement = document.querySelector(`meta[${attribute}='${name}']`);
    
    if (!metaElement) {
      metaElement = document.createElement('meta');
      metaElement.setAttribute(attribute, name);
      document.head.appendChild(metaElement);
    }
    
    metaElement.setAttribute('content', content);
  };

  return null; // This component doesn't render anything
};

export default SEOHead;
