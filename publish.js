
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');
require('dotenv').config();

const API_KEY = process.env.DEVTO_API_KEY;
const DRAFT_PATH = path.join(__dirname, 'drafts', '2026-02-07-mandaact-1-1-0-update.md');

if (!API_KEY) {
    console.error("❌ Error: DEVTO_API_KEY is missing in .env");
    process.exit(1);
}

async function publishArticle() {
    try {
        const fileContent = fs.readFileSync(DRAFT_PATH, 'utf8');
        const { data, content } = matter(fileContent);

        // Upload images if needed (Skip for now, assuming manual image hosting or existing URLs)
        // For a real production script, we'd upload local images to a host (e.g. Cloudinary/GitHub) 
        // and replace links. For this manual run, we assume the user will handle image hosting 
        // or we use the relative paths if Dev.to supports them (it doesn't support local relative).

        let contentBody = fileContent;

        // 1. Replace Local Asset Links with Remote GitHub Links
        const GITHUB_USERNAME = 'hevi35-coder';
        const REPO_NAME = 'devto-publisher';
        const BRANCH = 'main';
        const BASE_ASSET_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/assets/`;

        // Replace relative paths like "../assets/"
        contentBody = contentBody.replace(/\.\.\/assets\//g, BASE_ASSET_URL);

        // Update frontmatter cover_image if it's local
        let mainImage = data.cover_image;
        if (mainImage && mainImage.startsWith('../assets')) {
            mainImage = mainImage.replace('../assets/', BASE_ASSET_URL);
        }

        // IMPORTANT: Dev.to API requires a 'article' object
        const article = {
            title: data.title,
            body_markdown: contentBody,
            published: true,
            series: data.series,
            tags: data.tags,
            main_image: mainImage
        };

        console.log(`🚀 Publishing: ${article.title}...`);

        const response = await axios.post('https://dev.to/api/articles', { article }, {
            headers: {
                'api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Success! Article published.");
        console.log(`🔗 Link: ${response.data.url}`);

    } catch (error) {
        console.error("❌ Publishing failed:", error.response ? error.response.data : error.message);
    }
}

publishArticle();
