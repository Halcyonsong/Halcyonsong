import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const USERNAME = 'Halcyonsong'
const TOKEN = process.env.GITHUB_TOKEN || ''
const REPOS_OUTPUT = `${__dirname}/../public/repos.json`
const CONTRIB_OUTPUT = `${__dirname}/../public/contributions.json`

async function fetchRepos(headers) {
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
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description || 'No description',
      created_at: r.created_at,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
    }))

  mkdirSync(dirname(REPOS_OUTPUT), { recursive: true })
  writeFileSync(REPOS_OUTPUT, JSON.stringify(data, null, 2))
  console.log(`Saved ${data.length} repos to ${REPOS_OUTPUT}`)
}

async function fetchContributions(headers) {
  if (!TOKEN) {
    console.log('Skipping contributions: no GITHUB_TOKEN set')
    return
  }

  console.log(`Fetching contributions for ${USERNAME}...`)
  const today = new Date()
  const oneYearAgo = new Date(today)
  oneYearAgo.setDate(oneYearAgo.getDate() - 365)
  const from = oneYearAgo.toISOString()
  const to = today.toISOString()

  const query = `
    query {
      user(login: "${USERNAME}") {
        contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`Contributions fetch failed: HTTP ${res.status}`)
    console.error(text)
    return
  }

  const json = await res.json()
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) {
    console.error('No contribution data in response')
    return
  }

  const days = []
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
      })
    }
  }

  const output = {
    total: calendar.totalContributions,
    days,
  }

  mkdirSync(dirname(CONTRIB_OUTPUT), { recursive: true })
  writeFileSync(CONTRIB_OUTPUT, JSON.stringify(output, null, 2))
  console.log(`Saved ${days.length} days of contributions (total: ${output.total}) to ${CONTRIB_OUTPUT}`)
}

async function main() {
  const headers = {}
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`
  }

  await fetchRepos(headers)
  await fetchContributions(headers)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
