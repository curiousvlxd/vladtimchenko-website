import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export const DEFAULT_LIGHTHOUSE_OUT_DIR = 'performance'

export const MOBILE_REPORT_NAME = 'lighthouse-mobile.report.json'
export const DESKTOP_REPORT_NAME = 'lighthouse-desktop.report.json'
export const MOBILE_IMAGE_NAME = 'lighthouse-mobile.png'
export const DESKTOP_IMAGE_NAME = 'lighthouse-desktop.png'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARD_TEMPLATE_PATH = path.join(__dirname, 'templates', 'lighthouse-card.html')

let cardTemplatePromise = null

function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`
}

function formatMs(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '0 ms'
  }

  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)} s`
  }

  return `${Math.round(ms)} ms`
}

function sumBy(items, key) {
  return (items || []).reduce((sum, item) => sum + (Number(item?.[key]) || 0), 0)
}

function findLcpNodeLabel(report) {
  const lcpBreakdown = report.audits['lcp-breakdown-insight']
  const node = lcpBreakdown?.details?.items?.find((item) => item?.type === 'node')
  return node?.nodeLabel || node?.snippet || 'n/a'
}

export function extractSummary(report) {
  const audits = report.audits || {}
  const performanceScore = Math.round((report.categories?.performance?.score || 0) * 100)

  const resourceSummaryItems = audits['resource-summary']?.details?.items || []
  const thirdPartyRow = resourceSummaryItems.find((item) => item?.resourceType === 'third-party')
  const scriptRow = resourceSummaryItems.find((item) => item?.resourceType === 'script')
  const fontRow = resourceSummaryItems.find((item) => item?.resourceType === 'font')

  const renderBlockingItems = audits['render-blocking-insight']?.details?.items || []
  const renderBlockingSavingsMs = sumBy(renderBlockingItems, 'wastedMs')
  const unusedJsSavingsBytes = Number(audits['unused-javascript']?.details?.overallSavingsBytes || 0)

  const longestChainDurationMs = audits['network-dependency-tree-insight']?.details?.items?.find(
    (item) => item?.value?.type === 'network-tree'
  )?.value?.longestChain?.duration

  const mainThreadItems = audits['mainthread-work-breakdown']?.details?.items || []
  const mainThreadMs = sumBy(mainThreadItems, 'duration')

  const bottlenecks = []
  if (renderBlockingSavingsMs > 0) {
    bottlenecks.push(`Render-blocking chain: ~${formatMs(renderBlockingSavingsMs)} potential savings`)
  }
  if (unusedJsSavingsBytes > 0) {
    bottlenecks.push(`Unused JavaScript: ${formatBytes(unusedJsSavingsBytes)}`)
  }
  if (Number.isFinite(longestChainDurationMs) && longestChainDurationMs > 0) {
    bottlenecks.push(`Network dependency longest chain: ${formatMs(longestChainDurationMs)}`)
  }
  if (mainThreadMs > 0) {
    bottlenecks.push(`Main thread work: ${formatMs(mainThreadMs)}`)
  }

  return {
    score: performanceScore,
    metrics: {
      FCP: audits['first-contentful-paint']?.displayValue || 'n/a',
      LCP: audits['largest-contentful-paint']?.displayValue || 'n/a',
      TBT: audits['total-blocking-time']?.displayValue || 'n/a',
      CLS: audits['cumulative-layout-shift']?.displayValue || 'n/a',
      TTFB: audits['server-response-time']?.displayValue || 'n/a',
      TTI: audits['interactive']?.displayValue || 'n/a'
    },
    transfer: {
      script: scriptRow ? formatBytes(scriptRow.transferSize) : 'n/a',
      font: fontRow ? formatBytes(fontRow.transferSize) : 'n/a',
      thirdParty: thirdPartyRow ? formatBytes(thirdPartyRow.transferSize) : 'n/a'
    },
    lcpElement: findLcpNodeLabel(report),
    bottlenecks: bottlenecks.slice(0, 4)
  }
}

function scoreColor(score) {
  if (score >= 90) return '#22C55E'
  if (score >= 75) return '#18B7A4'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export async function buildCardHtml({ mode, url, summary, generated }) {
  return buildCardHtmlFromTemplate({ mode, url, summary, generated })
}

async function getCardTemplate() {
  if (!cardTemplatePromise) {
    cardTemplatePromise = fs.readFile(CARD_TEMPLATE_PATH, 'utf8')
  }
  return cardTemplatePromise
}

function replaceToken(source, token, value) {
  return source.split(`{{${token}}}`).join(value)
}

async function buildCardHtmlFromTemplate({ mode, url, summary, generated }) {
  let html = await getCardTemplate()

  const ringColor = scoreColor(summary.score)
  const scoreFill = Math.min(100, Math.max(0, summary.score))
  const bottlenecks = summary.bottlenecks.length
    ? summary.bottlenecks.map((line) => `<li>${escapeHtml(line)}</li>`).join('')
    : '<li>No high-impact bottlenecks were detected in this run.</li>'

  const replacements = {
    MODE: escapeHtml(mode),
    RING_COLOR: ringColor,
    SCORE_FILL: String(scoreFill),
    SCORE: String(summary.score),
    FCP: escapeHtml(summary.metrics.FCP),
    LCP: escapeHtml(summary.metrics.LCP),
    TBT: escapeHtml(summary.metrics.TBT),
    TTFB: escapeHtml(summary.metrics.TTFB),
    TTI: escapeHtml(summary.metrics.TTI),
    CLS: escapeHtml(summary.metrics.CLS),
    LCP_ELEMENT: escapeHtml(summary.lcpElement),
    BOTTLENECKS: bottlenecks,
    URL: escapeHtml(url),
    GENERATED: escapeHtml(generated)
  }

  for (const [token, value] of Object.entries(replacements)) {
    html = replaceToken(html, token, value)
  }

  return html
}

async function runCommand(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    })
    child.once('error', reject)
    child.once('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`))
    })
  })
}

export async function runLighthouseReport({ url, outputPath, desktop = false }) {
  const args = [
    '--yes',
    'lighthouse',
    url,
    '--only-categories=performance',
    '--output=json',
    `--output-path=${outputPath}`,
    '--chrome-flags=--headless=new',
    '--quiet'
  ]

  if (desktop) {
    args.push('--preset=desktop')
  }

  await runCommand(getNpxCommand(), args)
}

async function renderCard(browser, payload, outputPath) {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1
  })
  const html = await buildCardHtml(payload)
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.screenshot({ path: outputPath, type: 'png' })
  await page.close()
}

export async function generateLighthouseCards({ targetUrl, outDir, generatedAt, logger = console }) {
  if (!targetUrl) {
    throw new Error('targetUrl is required')
  }

  const resolvedOutDir = path.resolve(outDir || DEFAULT_LIGHTHOUSE_OUT_DIR)
  const timestamp = generatedAt || new Date().toISOString()

  await fs.mkdir(resolvedOutDir, { recursive: true })

  const mobileReportPath = path.join(resolvedOutDir, MOBILE_REPORT_NAME)
  const desktopReportPath = path.join(resolvedOutDir, DESKTOP_REPORT_NAME)
  const mobileImagePath = path.join(resolvedOutDir, MOBILE_IMAGE_NAME)
  const desktopImagePath = path.join(resolvedOutDir, DESKTOP_IMAGE_NAME)

  logger.log(`Running Lighthouse mobile for ${targetUrl}`)
  await runLighthouseReport({ url: targetUrl, outputPath: mobileReportPath, desktop: false })

  logger.log(`Running Lighthouse desktop for ${targetUrl}`)
  await runLighthouseReport({ url: targetUrl, outputPath: desktopReportPath, desktop: true })

  const mobileReport = JSON.parse(await fs.readFile(mobileReportPath, 'utf8'))
  const desktopReport = JSON.parse(await fs.readFile(desktopReportPath, 'utf8'))

  const mobileSummary = extractSummary(mobileReport)
  const desktopSummary = extractSummary(desktopReport)

  const browser = await chromium.launch({ headless: true })
  try {
    await renderCard(
      browser,
      { mode: 'Mobile', url: targetUrl, summary: mobileSummary, generated: timestamp },
      mobileImagePath
    )
    await renderCard(
      browser,
      { mode: 'Desktop', url: targetUrl, summary: desktopSummary, generated: timestamp },
      desktopImagePath
    )
  } finally {
    await browser.close()
  }

  return {
    outDir: resolvedOutDir,
    files: {
      mobileReport: mobileReportPath,
      desktopReport: desktopReportPath,
      mobileImage: mobileImagePath,
      desktopImage: desktopImagePath
    }
  }
}
