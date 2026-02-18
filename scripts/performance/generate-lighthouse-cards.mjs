#!/usr/bin/env node

import fs from 'node:fs/promises'
import process from 'node:process'
import { DEFAULT_LIGHTHOUSE_OUT_DIR, generateLighthouseCards } from './lighthouse-cards-lib.mjs'

function looksLikeUrl(value) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

function parseCliArgs(argv) {
  const firstArg = argv[2]
  const secondArg = argv[3]

  if (looksLikeUrl(firstArg)) {
    return {
      targetUrl: firstArg,
      outDir: secondArg
    }
  }

  return {
    targetUrl: process.env.LIGHTHOUSE_URL || process.env.BASE_URL,
    outDir: firstArg
  }
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

const { targetUrl: targetUrlArg, outDir: outDirArg } = parseCliArgs(process.argv)
const outDir = outDirArg || process.env.LIGHTHOUSE_OUT_DIR || DEFAULT_LIGHTHOUSE_OUT_DIR
const mobileManifest = process.env.LIGHTHOUSE_MOBILE_MANIFEST
const desktopManifest = process.env.LIGHTHOUSE_DESKTOP_MANIFEST
const mobileReportPath = process.env.LIGHTHOUSE_MOBILE_REPORT_PATH
const desktopReportPath = process.env.LIGHTHOUSE_DESKTOP_REPORT_PATH
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
    targetUrlArg ||
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
      '(requires LIGHTHOUSE_MOBILE_MANIFEST/LIGHTHOUSE_DESKTOP_MANIFEST or *_REPORT_PATH envs)'
  )
  process.exit(1)
})
