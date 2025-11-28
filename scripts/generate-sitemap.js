import { writeFileSync } from 'fs';
import { join } from 'path';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Define the routes for the sitemap
const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/features/journaling', priority: 0.9, changefreq: 'weekly' },
  { path: '/features/analysis', priority: 0.9, changefreq: 'weekly' },
  { path: '/features/reporting', priority: 0.9, changefreq: 'weekly' },
  { path: '/features/playbooks', priority: 0.9, changefreq: 'weekly' },
  { path: '/features/backtesting', priority: 0.9, changefreq: 'weekly' },
  { path: '/features/broker-integration', priority: 0.9, changefreq: 'weekly' },
  { path: '/pricing', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/contact', priority: 0.6, changefreq: 'yearly' },
  { path: '/faq', priority: 0.6, changefreq: 'monthly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.5, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.5, changefreq: 'yearly' },
  { path: '/accessibility', priority: 0.5, changefreq: 'yearly' }
];

// Generate the sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>https://tradezella.com${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write the sitemap to the public directory
const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(sitemapPath, sitemap);

console.log('Sitemap generated successfully at:', sitemapPath);