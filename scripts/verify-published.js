/**
 * Verify Published Article
 * 
 * Uses Puppeteer to load a published article and verify:
 * 1. Page loads successfully (200 OK)
 * 2. Cover image loads correctly
 * 3. No broken images in the content
 * 
 * Usage: node scripts/verify-published.js <url>
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function verifyArticle(url) {
    console.log(`\n🤖 [Verifier] Starting verification for: ${url}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport to desktop size
        await page.setViewport({ width: 1280, height: 800 });

        console.log('⏳ Loading page...');
        const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        if (!response.ok()) {
            throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
        }

        // Wait a bit for lazy-loaded images
        await new Promise(r => setTimeout(r, 2000));

        // Evaluate images
        const imageResults = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            // Filter out tracking pixels or tiny icons
            const visibleImages = imgs.filter(img => img.width > 20 && img.height > 20);

            const broken = visibleImages.filter(img => {
                return !img.complete || img.naturalWidth === 0;
            }).map(img => ({
                src: img.src,
                alt: img.alt
            }));

            // Check specifically for cover image candidates (usually large images at the top)
            const coverCandidate = visibleImages.find(img => img.naturalWidth > 600);
            const hasCover = !!coverCandidate;

            return {
                total: imgs.length,
                visible: visibleImages.length,
                broken,
                hasCover
            };
        });

        // Screenshot
        const timestamp = Date.now();
        const screenshotDir = path.join(__dirname, '../.verification');
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

        const filename = `verify-${timestamp}.png`;
        const screenshotPath = path.join(screenshotDir, filename);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report
        console.log('═══════════════════════════════════════');
        console.log('📊 VERIFICATION RESULT');
        console.log('═══════════════════════════════════════');

        if (imageResults.broken.length === 0) {
            console.log('✅ Images: All loaded successfully');
        } else {
            console.log(`❌ Images: ${imageResults.broken.length} broken images found`);
            imageResults.broken.forEach(img => console.log(`   - ${img.src}`));
        }

        if (imageResults.hasCover) {
            console.log('✅ Cover: Likely present (found large image)');
        } else {
            console.log('⚠️ Cover: No large image found (might be missing)');
        }

        console.log(`📸 Screenshot: ${screenshotPath}`);
        console.log('═══════════════════════════════════════\n');

        return imageResults.broken.length === 0;

    } catch (error) {
        console.error(`❌ Verification failed: ${error.message}`);
        return false;
    } finally {
        await browser.close();
    }
}

// CLI Support
if (require.main === module) {
    const url = process.argv[2];
    if (!url) {
        console.log('Usage: node scripts/verify-published.js <url>');
        process.exit(1);
    }
    verifyArticle(url);
}

module.exports = { verifyArticle };
