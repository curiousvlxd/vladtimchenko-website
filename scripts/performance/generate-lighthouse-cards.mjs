#!/usr/bin/env node

import process from 'node:process'
import { DEFAULT_LIGHTHOUSE_OUT_DIR, generateLighthouseCards } from './lighthouse-cards-lib.mjs'

const targetUrl = process.argv[2] || process.env.LIGHTHOUSE_URL || process.env.BASE_URL
const outDir = process.argv[3] || process.env.LIGHTHOUSE_OUT_DIR || DEFAULT_LIGHTHOUSE_OUT_DIR
const generatedAt = new Date().toISOString()

if (!targetUrl) {
  console.error('Usage: node scripts/performance/generate-lighthouse-cards.mjs <url> [outDir]')
  process.exit(1)
}

async function main() {
  const result = await generateLighthouseCards({
    targetUrl,
    outDir,
    generatedAt,
    logger: console
  })

  console.log(`Saved reports to ${result.outDir}`)
  console.log(`- ${result.files.mobileReport.split(/[\\/]/).pop()}`)
  console.log(`- ${result.files.desktopReport.split(/[\\/]/).pop()}`)
  console.log(`- ${result.files.mobileImage.split(/[\\/]/).pop()}`)
  console.log(`- ${result.files.desktopImage.split(/[\\/]/).pop()}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
