import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SITE_HOSTNAME = 'https://hivemindsist.dev'

// Map canonical public routes to their source page component files
const PUBLIC_ROUTES: Array<{ route: string; sourceFile: string }> = [
  { route: '/', sourceFile: 'src/pages/website/Home.tsx' },
  { route: '/projects', sourceFile: 'src/pages/website/Projects.tsx' },
  { route: '/join', sourceFile: 'src/pages/website/JoinHiveMind.tsx' },
  { route: '/team', sourceFile: 'src/pages/website/Team.tsx' },
  { route: '/journey', sourceFile: 'src/pages/website/Journey.tsx' },
  { route: '/events', sourceFile: 'src/pages/website/Events.tsx' },
]

/**
 * Extracts the last Git commit date for a source file in YYYY-MM-DD format.
 * Returns undefined if Git history is unavailable or execution fails.
 */
function getGitLastMod(relativeFilePath: string): string | undefined {
  try {
    const fullPath = path.resolve(__dirname, relativeFilePath)
    if (!fs.existsSync(fullPath)) return undefined

    const stdout = execSync(`git log -1 --format="%cI" -- "${fullPath}"`, {
      encoding: 'utf-8',
      cwd: __dirname,
    }).trim()

    if (stdout && stdout.length >= 10) {
      return stdout.substring(0, 10)
    }
  } catch {
    // Fail silently to omit lastmod tag when Git commit date cannot be verified
  }
  return undefined
}

/**
 * Custom Vite plugin to generate clean XML sitemap & robots.txt according to Google SEO guidelines.
 */
function hiveMindSitemapPlugin(): Plugin {
  return {
    name: 'hivemind-sitemap-generator',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }

      // 1. Generate sitemap.xml
      const urlEntries = PUBLIC_ROUTES.map(({ route, sourceFile }) => {
        const fullUrl = route === '/' ? `${SITE_HOSTNAME}/` : `${SITE_HOSTNAME}${route}`
        const lastmod = getGitLastMod(sourceFile)

        let urlXml = `  <url>\n    <loc>${fullUrl}</loc>`
        if (lastmod) {
          urlXml += `\n    <lastmod>${lastmod}</lastmod>`
        }
        urlXml += `\n  </url>`
        return urlXml
      }).join('\n')

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf-8')

      // 2. Generate robots.txt
      const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_HOSTNAME}/sitemap.xml\n`

      fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt, 'utf-8')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    hiveMindSitemapPlugin(),
  ],
})



