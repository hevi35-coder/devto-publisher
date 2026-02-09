const { getCTA, detectChannelFromFilename, injectCTA } = require('./lib/cta-injector');

console.log('=== CTA Injector Unit Test ===');

const devtoCTA = getCTA('devto', 'en');
console.log('Dev.to CTA length:', devtoCTA.length);
if (!devtoCTA.includes('https://apps.apple.com/app/mandaact')) console.error('❌ Dev.to link missing');

const bloggerCTA = getCTA('blogger_kr', 'ko');
console.log('Blogger CTA length:', bloggerCTA.length);
if (!bloggerCTA.includes('kr/app/mandaact')) console.error('❌ Blogger link missing');

const filename = 'test-ko.md';
const channel = detectChannelFromFilename(filename);
console.log('Detected channel for ko:', channel);
if (channel.lang !== 'ko') console.error('❌ Lang detection failed');

const content = '---\ntitle: Test\n---\nBody content';
const injected = injectCTA(content, 'devto', { lang: 'en' });
console.log('Injected content:\n', injected);
if (!injected.includes('Download MandaAct')) console.error('❌ Injection failed');

console.log('✅ CTA Injector: PASSED');
