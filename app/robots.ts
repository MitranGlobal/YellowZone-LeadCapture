import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/briefing', '/thank-you', '/api/'] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
