// sitemap-generator.js
import fs from 'fs';
import path from 'path';

/**
 * Generate a sitemap.xml file for the website
 */
const generateSitemap = () => {
  console.log('Generating sitemap.xml...');
  
  // Define your website pages here
  const pages = [
    {
      url: '/',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'weekly',
      priority: '1.0'
    },
    {
      url: '/chennai-villas',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/pondicherry-villas',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/about',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/contact',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/gallery',
      lastMod: new Date().toISOString().split('T')[0],
      changeFreq: 'weekly',
      priority: '0.8'
    }
  ];

  // Add dynamic pages here (e.g., villas)
  // You can fetch this data from your API or database
  
  // Generate sitemap XML content
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>https://luxorholiday.com${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  // Write sitemap to file
  const publicDir = path.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
