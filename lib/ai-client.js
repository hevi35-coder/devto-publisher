/**
 * Shared OpenAI client for GitHub Models.
 * Used by select_topic.js and generate_draft.js.
 */

const OpenAI = require('openai');
const config = require('../config');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_MODELS_TOKEN;

if (!GITHUB_TOKEN) {
    console.error("❌ Error: GITHUB_MODELS_TOKEN is missing in .env");
    process.exit(1);
}

const client = new OpenAI({
    baseURL: config.ai.baseURL,
    apiKey: GITHUB_TOKEN
});

module.exports = client;
