#!/usr/bin/env node

import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import {
  VIEWPORT,
  VIEWPORT_ABOUT,
  DEVICE_SCALE_FACTOR,
  HOME_SECTIONS,
  hideDevtools,
  sleep
} from './doc-screenshots-lib.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000'
const OUT_DIR = process.env.SCREENSHOTS_DIR || __dirname

async function capture(page, outPath) {
  await sleep(600)
  await hideDevtools(page)
  await sleep(200)
  await page.screenshot({ path: outPath, type: 'png' })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR
  })
  const page = await context.newPage()
  let index = 1

  await page.setViewportSize(VIEWPORT_ABOUT)
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main', { timeout: 15000 })
  await page.waitForSelector('[data-section="about"]', { timeout: 5000 })
  const name1 = `${index}-home-about-section.png`
  await capture(page, path.join(OUT_DIR, name1))
  console.log(name1)
  index++

  await page.setViewportSize(VIEWPORT)
  await page.goto(`${BASE_URL}/cv`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main, .cv-page', { timeout: 15000 })
  const name2 = `${index}-home-cv.png`
  await capture(page, path.join(OUT_DIR, name2))
  console.log(name2)
  index++

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main', { timeout: 15000 })
  for (const sectionId of HOME_SECTIONS.slice(1)) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }), sectionId)
    await page.waitForSelector(`[data-section="${sectionId}"]`, { timeout: 5000 })
    const name = `${index}-home-${sectionId}-section.png`
    await capture(page, path.join(OUT_DIR, name))
    console.log(name)
    index++
  }

  await page.goto(`${BASE_URL}/feed`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main, [class*="max-w-4xl"]', { timeout: 15000 })
  const feedListName = `${index}-feed-list.png`
  await capture(page, path.join(OUT_DIR, feedListName))
  console.log(feedListName)
  index++

  const firstPostLink = await page.locator('ul a[href^="/feed/"]').first().getAttribute('href').catch(() => null)
  if (firstPostLink) {
    await page.goto(`${BASE_URL}${firstPostLink}`, { waitUntil: 'networkidle' })
    await page.waitForSelector('main, article, [class*="prose"]', { timeout: 15000 })
    const articleName = `${index}-feed-first-article.png`
    await capture(page, path.join(OUT_DIR, articleName))
    console.log(articleName)
  }

  await browser.close()
  console.log('Screenshots saved to', OUT_DIR)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
