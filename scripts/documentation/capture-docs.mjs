#!/usr/bin/env node

import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
import {
  VIEWPORT,
  VIEWPORT_ABOUT,
  DEVICE_SCALE_FACTOR,
  DEFAULT_BASE_URL,
  DEFAULT_DOCS_OUT_DIR,
  HOME_SECTIONS,
  applyScreenshotLayout,
  saveFinalRoundedScreenshot,
  hideDevtools,
  sleep
} from './doc-screenshots-lib.mjs'

const BASE_URL = process.argv[2] || process.env.BASE_URL || DEFAULT_BASE_URL
const OUT_DIR = process.argv[3] || process.env.DOCS_OUT_DIR || process.env.SCREENSHOTS_DIR || DEFAULT_DOCS_OUT_DIR

async function capture(page, outPath) {
  await sleep(600)
  await hideDevtools(page)
  await applyScreenshotLayout(page)
  await sleep(200)
  const screenshot = await page.screenshot({ type: 'png', omitBackground: true })
  await saveFinalRoundedScreenshot(screenshot, outPath, page.viewportSize())
}

async function gotoReady(page, url, selector) {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForSelector(selector, { timeout: 20000 })
  await page.waitForTimeout(300)
}

async function shot(page, outDir, name, index) {
  const filename = `${index}-${name}.png`
  await capture(page, path.join(outDir, filename))
  console.log(filename)
  return index + 1
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce'
  })
  const page = await context.newPage()

  let index = 1

  await page.setViewportSize(VIEWPORT_ABOUT)
  await gotoReady(page, `${BASE_URL}/`, 'main')
  await page.waitForSelector('[data-section="about"]', { timeout: 8000 })
  index = await shot(page, OUT_DIR, 'home-about-section', index)

  await page.setViewportSize(VIEWPORT)
  await gotoReady(page, `${BASE_URL}/cv`, 'main, .cv-page')
  index = await shot(page, OUT_DIR, 'home-cv', index)

  await gotoReady(page, `${BASE_URL}/`, 'main')
  for (const sectionId of HOME_SECTIONS.slice(1)) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }), sectionId)
    await page.waitForSelector(`[data-section="${sectionId}"]`, { timeout: 8000 })
    index = await shot(page, OUT_DIR, `home-${sectionId}-section`, index)
  }

  await gotoReady(page, `${BASE_URL}/feed`, 'main, [class*="max-w-4xl"]')
  index = await shot(page, OUT_DIR, 'feed-list', index)

  const firstPostLink = await page.locator('ul a[href^="/feed/"]').first().getAttribute('href').catch(() => null)
  if (firstPostLink) {
    await gotoReady(page, `${BASE_URL}${firstPostLink}`, 'main, article, [class*="prose"]')
    index = await shot(page, OUT_DIR, 'feed-first-article', index)
  }

  await browser.close()
  console.log('Screenshots saved to', OUT_DIR)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
