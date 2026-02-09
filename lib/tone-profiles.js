/**
 * Tone Profiles - Channel-specific content styling configuration
 * 
 * Defines how content should be adapted for each publishing platform.
 * Used by the ToneAdapter to transform neutral drafts into channel-optimized content.
 */

const toneProfiles = {
    /**
     * Dev.to - Developer Community (Casual)
     * 주니어/인디 개발자 타겟, 커뮤니티 문화가 친근함 중시
     */
    devto: {
        id: 'devto',
        language: 'en',
        style: 'casual',
        emoji: {
            allowed: true,
            frequency: 'moderate',  // Not every sentence, but OK in headers/transitions
            examples: ['🚀', '💡', '🔥', '✨']
        },
        formatting: {
            codeBlocks: true,
            headers: 'h2',
            maxParagraphLength: 150,  // words
            bulletPoints: true
        },
        voice: {
            personalStory: true,      // "I struggled with..." OK
            firstPerson: true,
            conversational: true
        },
        callToAction: {
            style: 'soft',            // "Check it out" not "BUY NOW"
            placement: 'end'
        },
        seo: {
            titleMaxLength: 60,
            tagsCount: 4,             // Dev.to max
            descriptionLength: 160
        }
    },

    /**
     * Hashnode - Professional Tech Blog
     * 시니어/테크 리더 타겟, 기술적 깊이와 인사이트 중시
     */
    hashnode: {
        id: 'hashnode',
        language: 'en',
        style: 'professional',
        emoji: {
            allowed: false,
            frequency: 'none'
        },
        formatting: {
            codeBlocks: true,
            headers: 'h2',
            maxParagraphLength: 200,
            bulletPoints: true
        },
        voice: {
            personalStory: false,     // Focus on insights, not "my story"
            firstPerson: false,       // Use "we" or passive voice
            conversational: false
        },
        callToAction: {
            style: 'minimal',
            placement: 'end'
        },
        seo: {
            titleMaxLength: 60,
            tagsCount: 5,
            descriptionLength: 160
        }
    },

    /**
     * Blogger (Korean) - General Korean Audience
     * 네이버 블로그와 유사한 기대치, 따뜻하고 정중한 톤
     */
    blogger_kr: {
        id: 'blogger_kr',
        language: 'ko',
        style: 'warm',
        emoji: {
            allowed: false,           // 한국 블로그는 이모지 지양
            frequency: 'none'
        },
        formatting: {
            codeBlocks: false,        // 비개발자 독자 고려
            headers: 'h2',
            maxParagraphLength: 100,
            bulletPoints: true,
            avoidBold: true           // **굵은 글씨** 지양
        },
        voice: {
            personalStory: true,
            firstPerson: true,
            conversational: true,
            honorifics: '~습니다'     // 존댓말
        },
        callToAction: {
            style: 'soft',
            placement: 'end'
        },
        seo: {
            titleMaxLength: 50,
            tagsCount: 10,            // Blogger labels
            descriptionLength: 150
        }
    }
};

/**
 * Get profile by platform ID
 * @param {string} platformId - One of: devto, hashnode, blogger_kr
 * @returns {object} Tone profile configuration
 */
function getProfile(platformId) {
    const profile = toneProfiles[platformId];
    if (!profile) {
        throw new Error(`Unknown platform: ${platformId}. Available: ${Object.keys(toneProfiles).join(', ')}`);
    }
    return profile;
}

/**
 * Get all available profile IDs
 * @returns {string[]} Array of platform IDs
 */
function getAvailableProfiles() {
    return Object.keys(toneProfiles);
}

/**
 * Build prompt instructions from profile
 * @param {string} platformId - Platform to build instructions for
 * @returns {string} Prompt instructions string
 */
function buildPromptInstructions(platformId) {
    const profile = getProfile(platformId);

    let instructions = `## Tone & Style Guide for ${profile.id.toUpperCase()}\n\n`;

    // Language
    instructions += `**Language**: ${profile.language === 'ko' ? 'Korean (한국어)' : 'English'}\n`;

    // Style
    instructions += `**Style**: ${profile.style}\n`;

    // Emoji
    if (profile.emoji.allowed) {
        instructions += `**Emoji**: Allowed (${profile.emoji.frequency} frequency). Examples: ${profile.emoji.examples.join(' ')}\n`;
    } else {
        instructions += `**Emoji**: NOT allowed. Do not use any emoji.\n`;
    }

    // Voice
    instructions += `**Voice**:\n`;
    instructions += `  - Personal stories: ${profile.voice.personalStory ? 'OK' : 'Avoid'}\n`;
    instructions += `  - First person: ${profile.voice.firstPerson ? 'Use "I/my"' : 'Use "we" or passive voice'}\n`;
    if (profile.voice.honorifics) {
        instructions += `  - Honorifics: Use ${profile.voice.honorifics} (formal Korean)\n`;
    }

    // Formatting
    instructions += `**Formatting**:\n`;
    instructions += `  - Code blocks: ${profile.formatting.codeBlocks ? 'Include' : 'Avoid'}\n`;
    instructions += `  - Max paragraph: ~${profile.formatting.maxParagraphLength} words\n`;
    if (profile.formatting.avoidBold) {
        instructions += `  - Avoid **bold** markdown emphasis\n`;
    }

    // CTA
    instructions += `**Call to Action**: ${profile.callToAction.style} style at ${profile.callToAction.placement}\n`;

    // SEO
    instructions += `**SEO Constraints**:\n`;
    instructions += `  - Title: max ${profile.seo.titleMaxLength} characters\n`;
    instructions += `  - Tags: max ${profile.seo.tagsCount}\n`;

    return instructions;
}

module.exports = {
    toneProfiles,
    getProfile,
    getAvailableProfiles,
    buildPromptInstructions
};
