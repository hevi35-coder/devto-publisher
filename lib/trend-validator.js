/**
 * Trend Validator - AI-based topic freshness verification
 * 
 * Uses GPT-4o to validate if a topic is current and identifies
 * potentially outdated references that should be avoided or replaced.
 */

const client = require('./ai-client');

/**
 * Validate topic trend relevance
 * @param {object} topic - Topic object with title, rationale, angle
 * @returns {Promise<object>} Validation result with score and recommendations
 */
async function validateTrend(topic) {
    console.log('🔍 Trend Validator: Checking topic freshness...');

    const prompt = `
You are a 2026 developer trends expert. Your job is to validate if a proposed blog topic is currently relevant and identify any potentially outdated references.

## Topic to Validate
**Title**: ${topic.title}
**Rationale**: ${topic.rationale || 'N/A'}
**Angle**: ${topic.angle || 'N/A'}

## Validation Tasks
1. **Relevance Check**: Is this topic currently trending or evergreen in 2026?
2. **Outdated Risk Detection**: What tools/frameworks/concepts mentioned might be outdated?
3. **Replacement Suggestions**: For each outdated item, suggest a 2026 alternative.

## Known Outdated References (2026)
- Midjourney → Flux, Nanobanana, or "AI image generators" (generic)
- Create React App → Vite, Next.js
- Heroku free tier → Railway, Render, Fly.io
- Twitter API → "social media APIs" (generic) due to restrictions
- GPT-3 → GPT-4o, Claude, Gemini

## Output Format (JSON)
{
    "isRelevant": true,
    "confidenceScore": 85,
    "reasoning": "Why this topic is/isn't relevant in 2026",
    "outdatedRisks": [
        {
            "term": "Midjourney",
            "risk": "Specific tool that may date the content",
            "replacement": "AI image generators like Flux or Nanobanana"
        }
    ],
    "suggestedReplacements": {
        "Midjourney": "AI image generators",
        "Heroku": "modern PaaS like Railway"
    },
    "evergreenScore": 70,
    "recommendations": [
        "Use generic terms for tools when possible",
        "Focus on concepts rather than specific products"
    ]
}
`;

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const result = JSON.parse(response.choices[0].message.content);

        console.log(`   ✅ Relevance: ${result.isRelevant ? 'Current' : 'Outdated'} (${result.confidenceScore}%)`);

        if (result.outdatedRisks && result.outdatedRisks.length > 0) {
            console.log(`   ⚠️  Outdated risks detected: ${result.outdatedRisks.length}`);
            result.outdatedRisks.forEach(risk => {
                console.log(`      - "${risk.term}" → "${risk.replacement}"`);
            });
        }

        return {
            success: true,
            ...result
        };

    } catch (error) {
        console.error('❌ Trend validation failed:', error.message);
        return {
            success: false,
            isRelevant: true,  // Default to accepting on failure
            confidenceScore: 50,
            reasoning: 'Validation failed, proceeding with caution',
            outdatedRisks: [],
            suggestedReplacements: {},
            error: error.message
        };
    }
}

/**
 * Build avoidance instructions for draft generation prompt
 * @param {object} validationResult - Result from validateTrend()
 * @returns {string} Instructions to inject into draft prompt
 */
function buildAvoidanceInstructions(validationResult) {
    if (!validationResult.success || !validationResult.outdatedRisks?.length) {
        return '';
    }

    let instructions = '\n## IMPORTANT: Trend Awareness\n';
    instructions += 'The following terms may be outdated. Use the suggested alternatives:\n\n';

    for (const [oldTerm, newTerm] of Object.entries(validationResult.suggestedReplacements)) {
        instructions += `- ❌ Do NOT mention "${oldTerm}" → ✅ Use "${newTerm}" instead\n`;
    }

    if (validationResult.recommendations?.length) {
        instructions += '\n### Additional Recommendations:\n';
        validationResult.recommendations.forEach(rec => {
            instructions += `- ${rec}\n`;
        });
    }

    return instructions;
}

/**
 * Check if topic should be rejected based on validation
 * @param {object} validationResult - Result from validateTrend()
 * @param {number} threshold - Minimum confidence score (default: 40)
 * @returns {boolean} True if topic should be rejected
 */
function shouldRejectTopic(validationResult, threshold = 40) {
    return !validationResult.isRelevant && validationResult.confidenceScore < threshold;
}

module.exports = {
    validateTrend,
    buildAvoidanceInstructions,
    shouldRejectTopic
};
