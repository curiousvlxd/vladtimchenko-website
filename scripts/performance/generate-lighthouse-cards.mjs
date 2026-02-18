#!/usr/bin/env node

import fs from 'node:fs/promises'
import process from 'node:process'
import { DEFAULT_LIGHTHOUSE_OUT_DIR, generateLighthouseCards } from './lighthouse-cards-lib.mjs'

function looksLikeUrl(value) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

function readOptionValue(args, index, token) {
  const equalsIndex = token.indexOf('=')
  if (equalsIndex !== -1) {
    return { value: token.slice(equalsIndex + 1), nextIndex: index }
  }

  const nextToken = args[index + 1]
  if (!nextToken || nextToken.startsWith('--')) {
    throw new Error(`Option ${token} requires a value`)
  }

  return { value: nextToken, nextIndex: index + 1 }
}

function parseCliArgs(argv) {
  const args = argv.slice(2)
  const positional = []
  const options = {
    targetUrl: null,
    outDir: null,
    mobileManifest: null,
    desktopManifest: null,
    mobileReportPath: null,
    desktopReportPath: null
  }

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index]
    if (!token.startsWith('--')) {
      positional.push(token)
      continue
    }

    const optionName = token.slice(2).split('=')[0]
    const { value, nextIndex } = readOptionValue(args, index, token)
    index = nextIndex

    switch (optionName) {
      case 'url':
        options.targetUrl = value
        break
      case 'out-dir':
        options.outDir = value
        break
      case 'mobile-manifest':
        options.mobileManifest = value
        break
      case 'desktop-manifest':
        options.desktopManifest = value
        break
      case 'mobile-report-path':
        options.mobileReportPath = value
        break
      case 'desktop-report-path':
        options.desktopReportPath = value
        break
      default:
        throw new Error(`Unknown option: --${optionName}`)
    }
  }

  if (positional.length > 0) {
    if (looksLikeUrl(positional[0])) {
      if (!options.targetUrl) {
        options.targetUrl = positional[0]
      }
      if (!options.outDir && positional[1]) {
        options.outDir = positional[1]
      }
    } else if (!options.outDir) {
      options.outDir = positional[0]
    }
  }

  return options
}

function parseManifest(manifestRaw, label) {
  if (!manifestRaw) {
    return null
  }

  let manifest
  try {
    manifest = JSON.parse(manifestRaw)
  } catch {
    throw new Error(`Invalid ${label} manifest JSON`)
  }

  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error(`${label} manifest is empty`)
  }

  const representativeEntry = manifest.find((entry) => entry?.isRepresentativeRun && entry?.jsonPath)
  const firstReportEntry = manifest.find((entry) => entry?.jsonPath)
  const entry = representativeEntry || firstReportEntry

  if (!entry?.jsonPath) {
    throw new Error(`${label} manifest does not include jsonPath`)
  }

  return entry
}

async function readReportFromPath(reportPath, label) {
  if (!reportPath) {
    throw new Error(`${label} report path is not set`)
  }

  const reportSource = await fs.readFile(reportPath, 'utf8')
  return JSON.parse(reportSource)
}

async function loadReport({ manifestRaw, reportPath, label }) {
  const manifestEntry = parseManifest(manifestRaw, label)
  if (manifestEntry?.jsonPath) {
    return readReportFromPath(manifestEntry.jsonPath, label)
  }

  if (reportPath) {
    return readReportFromPath(reportPath, label)
  }

  throw new Error(
    `${label} report source is missing. Set LIGHTHOUSE_${label.toUpperCase()}_MANIFEST or LIGHTHOUSE_${label.toUpperCase()}_REPORT_PATH.`
  )
}

const cli = parseCliArgs(process.argv)
const outDir = cli.outDir || process.env.LIGHTHOUSE_OUT_DIR || DEFAULT_LIGHTHOUSE_OUT_DIR
const mobileManifest = cli.mobileManifest || process.env.LIGHTHOUSE_MOBILE_MANIFEST
const desktopManifest = cli.desktopManifest || process.env.LIGHTHOUSE_DESKTOP_MANIFEST
const mobileReportPath = cli.mobileReportPath || process.env.LIGHTHOUSE_MOBILE_REPORT_PATH
const desktopReportPath = cli.desktopReportPath || process.env.LIGHTHOUSE_DESKTOP_REPORT_PATH
const generatedAt = new Date().toISOString()

async function main() {
  const mobileReport = await loadReport({
    manifestRaw: mobileManifest,
    reportPath: mobileReportPath,
    label: 'mobile'
  })
  const desktopReport = await loadReport({
    manifestRaw: desktopManifest,
    reportPath: desktopReportPath,
    label: 'desktop'
  })

  const targetUrl =
    cli.targetUrl ||
    process.env.LIGHTHOUSE_URL ||
    process.env.BASE_URL ||
    mobileReport.finalUrl ||
    mobileReport.requestedUrl ||
    desktopReport.finalUrl ||
    desktopReport.requestedUrl ||
    'n/a'

  const result = await generateLighthouseCards({
    targetUrl,
    outDir,
    generatedAt,
    mobileReport,
    desktopReport,
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
  console.error(
    'Usage: node scripts/performance/generate-lighthouse-cards.mjs [url] [outDir] ' +
      '[--url <url>] [--out-dir <dir>] [--mobile-report-path <path>] [--desktop-report-path <path>] ' +
      '[--mobile-manifest <json>] [--desktop-manifest <json>]'
  )
  process.exit(1)
})
