/**
 * Asset Verifier - Checks availability of remote assets
 * 
 * Used to verify that GitHub Raw images are accessible before publishing.
 */
const axios = require('axios');

/**
 * Wait for a URL to become available (return 200 OK)
 * @param {string} url - The URL to check
 * @param {object} options - Options for polling
 * @returns {Promise<boolean>} True if available, false if timeout
 */
async function waitForUrl(url, options = {}) {
    const {
        timeout = 60000, // 60 seconds total timeout
        interval = 2000, // 2 seconds between checks
        silent = false
    } = options;

    if (!url.startsWith('http')) {
        // Not a remote URL, nothing to check
        return true;
    }

    const startTime = Date.now();
    let attempts = 0;

    if (!silent) console.log(`🔍 [Asset Verifier] Checking availability: ${url}`);

    while (Date.now() - startTime < timeout) {
        attempts++;
        try {
            const response = await axios.head(url, { validateStatus: null });

            if (response.status === 200) {
                if (!silent) console.log(`✅ [Asset Verifier] Asset available (Attempt ${attempts})`);
                return true;
            }
        } catch (error) {
            // Network error, ignore and retry
        }

        // Wait for interval
        await new Promise(resolve => setTimeout(resolve, interval));

        if (!silent && attempts % 5 === 0) {
            process.stdout.write('.');
        }
    }

    console.warn(`⚠️ [Asset Verifier] Timeout waiting for asset: ${url}`);
    return false;
}

module.exports = { waitForUrl };
