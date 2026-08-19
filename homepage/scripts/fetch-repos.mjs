import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const USERNAME = 'Halcyonsong'
const TOKEN = process.env.GITHUB_TOKEN || ''
const OUTPUT = `${__dirname}/../public/repos.json`

async function main() {
  const headers: Record<string, string> = {}
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`
  }

  console.log(`Fetching repos for ${USERNAME}...`)
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=created&direction=asc&per_page=100`,
    { headers },
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`HTTP ${res.status}: ${body.message || res.statusText}`)
  }

  const repos = await res.json()
  const data = repos
    .filter((r: any) => !r.fork)
    .map((r: any) => ({
      name: r.name,
      description: r.description || 'No description',
      created_at: r.created_at,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
    }))

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, JSON.stringify(data, null, 2))
  console.log(`Saved ${data.length} repos to ${OUTPUT}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
