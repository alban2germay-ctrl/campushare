// ==============================================================================
// 🎒 CampuShare — Script de Capture Automatique Headless (Playwright)
// Fichier : scripts/capture_previews.js
// Rôle : Démarre un navigateur Chromium invisible, prend les photos de l'iPhone,
//        du Desktop et de la Roadmap, et les enregistre dans .github/previews/.
// ==============================================================================

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capturePreviews() {
  const outputDir = path.join(__dirname, '..', '.github', 'previews');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Lancement de Chromium headless pour captures automatiques...');
  const browser = await chromium.launch();

  try {
    // 1. CAPTURE SMARTPHONE : iPhone 15 Pro (390 x 844 px)
    console.log('📱 Capture iPhone 15 Pro en cours...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1800); // Laisser React 18, Babel et Lucide s'hydrater
    await mobilePage.screenshot({
      path: path.join(outputDir, 'latest-iphone.png'),
      fullPage: false
    });
    console.log('✅ latest-iphone.png générée avec succès.');

    // 2. CAPTURE BANC D'ESSAI DESKTOP (1280 x 800 px)
    console.log('🖥️ Capture Desktop Studio en cours...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1800);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'latest-desktop.png'),
      fullPage: false
    });
    console.log('✅ latest-desktop.png générée avec succès.');

    // 3. CAPTURE PORTAIL ROADMAP & HUB GITHUB (1280 x 850 px)
    console.log('🗺️ Capture Roadmap Hub en cours...');
    const roadmapPage = await desktopContext.newPage();
    await roadmapPage.goto('http://127.0.0.1:3000/roadmap.html', { waitUntil: 'networkidle' });
    await roadmapPage.waitForTimeout(1800);
    await roadmapPage.screenshot({
      path: path.join(outputDir, 'latest-roadmap.png'),
      fullPage: false
    });
    console.log('✅ latest-roadmap.png générée avec succès.');

    console.log('🎉 Toutes les captures automatiques sont prêtes dans .github/previews/ !');
  } finally {
    await browser.close();
  }
}

capturePreviews().catch((err) => {
  console.error('❌ Erreur lors de la capture automatique :', err);
  process.exit(1);
});
