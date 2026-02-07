/**
 * Centralized configuration for the Dev.to Publisher project.
 * Eliminates hardcoded values scattered across scripts.
 */

const path = require('path');

module.exports = {
    github: {
        username: 'hevi35-coder',
        repo: 'devto-publisher',
        branch: 'main',
        get rawBaseUrl() {
            return `https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch}`;
        },
        get assetBaseUrl() {
            return `${this.rawBaseUrl}/assets/`;
        }
    },
    paths: {
        context: path.join(__dirname, '../../MyObsidianVault/30_Technical/MandaAct_Context.md'),
        queue: path.join(__dirname, 'TOPIC_QUEUE.md'),
        archive: path.join(__dirname, 'ARCHIVE.md'),
        drafts: path.join(__dirname, 'drafts'),
        covers: path.join(__dirname, 'assets', 'images', 'covers')
    },
    ai: {
        baseURL: 'https://models.inference.ai.azure.com',
        model: 'gpt-4o'
    }
};
