import { SNIPPETS } from '../lib/snippets'

const BASE = 'https://studiovault-next.vercel.app'

function generateSitemap(snippets) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE}/fixer</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${snippets.map(s => `
  <url>
    <loc>${BASE}/scripts/${s.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  res.write(generateSitemap(SNIPPETS))
  res.end()
  return { props: {} }
}
