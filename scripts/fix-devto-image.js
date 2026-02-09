require('dotenv').config();
const axios = require('axios');

async function main() {
    const apiKey = process.env.DEVTO_API_KEY;

    // Get article list
    const res = await axios.get('https://dev.to/api/articles/me/all', {
        headers: { 'api-key': apiKey }
    });

    const article = res.data.find(a => a.title.includes('9x9 Framework'));
    if (!article) {
        console.log('Article not found');
        return;
    }

    console.log('Found article:', article.id, article.title);
    console.log('Current cover image:', article.cover_image);

    // Update with cache-busting URL
    const timestamp = Date.now();
    const newCoverUrl = 'https://raw.githubusercontent.com/hevi35-coder/content-publisher/main/assets/images/covers/the-9x9-framework-for-mastering-ai-tools-without-overwhelm-cover.png?v=' + timestamp;

    console.log('New cover URL:', newCoverUrl);

    // Update article
    const updateRes = await axios.put('https://dev.to/api/articles/' + article.id, {
        article: {
            main_image: newCoverUrl
        }
    }, {
        headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
        }
    });

    console.log('Updated! New cover:', updateRes.data.cover_image);
}

main().catch(e => console.error(e.message));
