// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 𝑩𝑶𝑻 - 𝑯𝑬𝑳𝑷𝑬𝑹 𝑳𝑰𝑩𝑹𝑨𝑹𝒀
// ═══════════════════════════════════════════════════════════

const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ─── 𝑻𝑬𝑿𝑻 𝑫𝑬𝑪𝑶𝑹𝑨𝑻𝑰𝑶𝑵𝑺 ───
const decorations = {
    line: '━'.repeat(30),
    doubleLine: '═'.repeat(30),
    starLine: '✦'.repeat(15),
    diamond: '💎',
    crown: '👑',
    sparkles: '✨',
    fire: '🔥',
    heart: '💖',
    rose: '🌹',
    moon: '🌙',
    sun: '☀️',
    star: '⭐'
};

// ─── 𝑭𝑶𝑹𝑴𝑨𝑻 𝑻𝑬𝑿𝑻 ───
function formatText(text, style = 'normal') {
    const styles = {
        normal: text,
        bold: `*${text}*`,
        italic: `_${text}_`,
        strike: `~${text}~`,
        code: `\`\`\`${text}\`\`\``,
        quote: `> ${text}`
    };
    return styles[style] || text;
}

// ─── 𝑴𝑰𝑲𝑶 𝑯𝑬𝑨𝑫𝑬𝑹 ───
function mikoHeader(title) {
    return `${decorations.doubleLine}\n${decorations.crown} *${title}* ${decorations.crown}\n${decorations.doubleLine}`;
}

// ─── 𝑴𝑰𝑲𝑶 𝑭𝑶𝑶𝑻𝑬𝑹 ───
function mikoFooter() {
    return `\n${decorations.starLine}\n🤖 *𝑴𝑰𝑲𝑶* | 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 *𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿*\n${decorations.starLine}`;
}

// ─── 𝑹𝑨𝑵𝑫𝑶𝑴 𝑰𝑴𝑨𝑮𝑬 ───
function randomImage() {
    return config.botImages[Math.floor(Math.random() * config.botImages.length)];
}

// ─── 𝑺𝑬𝑵𝑫 𝑩𝑼𝑻𝑻𝑶𝑵𝑺 ───
async function sendButtons(sock, jid, text, buttons, options = {}) {
    try {
        const buttonMessage = {
            text: text,
            footer: options.footer || `𝑴𝑰𝑲𝑶 𝑩𝒐𝒕 © ${config.botVersion}`,
            buttons: buttons.map(btn => ({
                buttonId: btn.id || btn.params?.id || 'btn_' + Math.random().toString(36).substr(2, 9),
                buttonText: { displayText: btn.params?.display_text || btn.displayText || 'Button' },
                type: 1
            })),
            headerType: 1,
            ...options
        };
        return await sock.sendMessage(jid, buttonMessage);
    } catch (e) {
        console.error('Button send error:', e);
        return await sock.sendMessage(jid, { text: text });
    }
}

// ─── 𝑺𝑬𝑵𝑫 𝑰𝑵𝑻𝑬𝑹𝑨𝑪𝑻𝑰𝑽𝑬 𝑩𝑼𝑻𝑻𝑶𝑵𝑺 ───
async function sendInteractiveButtons(sock, jid, text, buttons, options = {}) {
    try {
        const msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: text
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: options.footer || `𝑴𝑰𝑲𝑶 𝑩𝒐𝒕 © ${config.botVersion}`
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: options.title || '𝑴𝑰𝑲𝑶',
                            subtitle: options.subtitle || '',
                            hasMediaAttachment: !!options.image,
                            ...(options.image ? {
                                imageMessage: {
                                    url: options.image
                                }
                            } : {})
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: buttons.map(btn => ({
                                name: btn.name,
                                buttonParamsJson: JSON.stringify(btn.params)
                            }))
                        })
                    })
                }
            }
        }, {});

        return await sock.relayMessage(jid, msg.message, { 
            messageId: msg.key.id,
            ...options
        });
    } catch (e) {
        console.error('Interactive button error:', e);
        return await sock.sendMessage(jid, { text: text });
    }
}

// ─── 𝑺𝑬𝑵𝑫 𝑪𝑨𝑹𝑶𝑼𝑺𝑬𝑳 ───
async function sendCarousel(sock, jid, text, cards, options = {}) {
    try {
        const carouselCards = cards.map((card, index) => ({
            title: card.title || `𝑪𝒂𝒓𝒅 ${index + 1}`,
            image: { url: card.image || randomImage() },
            caption: card.caption || ''
        }));

        return await sock.sendMessage(jid, {
            text: text,
            footer: options.footer || `𝑴𝑰𝑲𝑶 𝑩𝒐𝒕 © ${config.botVersion}`,
            cards: carouselCards,
            viewOnce: true,
            mentions: options.mentions || [],
            newsletter: config.newsletter,
            ...options
        });
    } catch (e) {
        console.error('Carousel error:', e);
        return await sock.sendMessage(jid, { text: text });
    }
}

// ─── 𝑺𝑬𝑵𝑫 𝑾𝑰𝑻𝑯 𝑵𝑬𝑾𝑺𝑳𝑬𝑻𝑻𝑬𝑹 ───
async function sendWithNewsletter(sock, jid, content, options = {}) {
    try {
        return await sock.sendMessage(jid, {
            ...content,
            newsletter: config.newsletter,
            mentions: options.mentions || [],
            ...options
        });
    } catch (e) {
        return await sock.sendMessage(jid, content);
    }
}

// ─── 𝑺𝑬𝑵𝑫 𝑴𝑬𝑫𝑰𝑨 ───
async function sendMedia(sock, jid, type, url, caption = '', options = {}) {
    try {
        const mediaTypes = {
            image: { image: { url }, caption },
            video: { video: { url }, caption },
            audio: { audio: { url }, mimetype: 'audio/mp4' },
            document: { document: { url }, caption, mimetype: options.mimetype || 'application/pdf' }
        };

        return await sock.sendMessage(jid, {
            ...mediaTypes[type],
            newsletter: config.newsletter,
            ...options
        });
    } catch (e) {
        console.error('Media send error:', e);
        return await sock.sendMessage(jid, { text: `❌ فشل في إرسال الميديا` });
    }
}

// ─── 𝑭𝑶𝑹𝑾𝑨𝑹𝑫 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 ───
async function forwardMessage(sock, jid, message, options = {}) {
    try {
        return await sock.sendMessage(jid, { 
            forward: message,
            newsletter: config.newsletter,
            ...options
        });
    } catch (e) {
        console.error('Forward error:', e);
    }
}

// ─── 𝑹𝑬𝑷𝑳𝒀 ───
async function reply(sock, jid, text, quoted, options = {}) {
    try {
        return await sock.sendMessage(jid, {
            text: text,
            newsletter: config.newsletter,
            ...options
        }, { quoted });
    } catch (e) {
        return await sock.sendMessage(jid, { text: text });
    }
}

// ─── 𝑹𝑬𝑨𝑪𝑻 ───
async function react(sock, jid, key, emoji) {
    try {
        return await sock.sendMessage(jid, {
            react: { text: emoji, key }
        });
    } catch (e) {
        console.error('React error:', e);
    }
}

// ─── 𝑭𝑬𝑻𝑪𝑯 𝑱𝑺𝑶𝑵 ───
async function fetchJson(url, options = {}) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...options.headers
            },
            timeout: 30000,
            ...options
        });
        return response.data;
    } catch (e) {
        console.error('Fetch error:', e.message);
        return null;
    }
}

// ─── 𝑭𝑬𝑻𝑪𝑯 𝑩𝑼𝑭𝑭𝑬𝑹 ───
async function fetchBuffer(url, options = {}) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...options.headers
            },
            timeout: 30000,
            ...options
        });
        return Buffer.from(response.data);
    } catch (e) {
        console.error('Buffer fetch error:', e.message);
        return null;
    }
}

// ─── 𝑮𝑬𝑻 𝑮𝑹𝑶𝑼𝑷 𝑨𝑫𝑴𝑰𝑵𝑺 ───
async function getGroupAdmins(sock, jid) {
    try {
        const groupMetadata = await sock.groupMetadata(jid);
        return groupMetadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);
    } catch (e) {
        return [];
    }
}

// ─── 𝑰𝑺 𝑨𝑫𝑴𝑰𝑵 ───
async function isAdmin(sock, jid, userId) {
    const admins = await getGroupAdmins(sock, jid);
    return admins.includes(userId);
}

// ─── 𝑰𝑺 𝑩𝑶𝑻 𝑨𝑫𝑴𝑰𝑵 ───
async function isBotAdmin(sock, jid) {
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    return await isAdmin(sock, jid, botId);
}

// ─── 𝑰𝑺 𝑫𝑬𝑽𝑬𝑳𝑶𝑷𝑬𝑹 ───
function isDeveloper(userId) {
    return config.developers.includes(userId);
}

// ─── 𝑻𝑰𝑴𝑬 𝑭𝑶𝑹𝑴𝑨𝑻 ───
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

// ─── 𝑹𝑨𝑵𝑫𝑶𝑴 𝑬𝑳𝑬𝑴𝑬𝑵𝑻 ───
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─── 𝑪𝑨𝑷𝑰𝑻𝑨𝑳𝑰𝒁𝑬 ───
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── 𝑵𝑼𝑴𝑩𝑬𝑹 𝑭𝑶𝑹𝑴𝑨𝑻 ───
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── 𝑷𝑹𝑶𝑮𝑹𝑬𝑺𝑺 𝑩𝑨𝑹 ───
function progressBar(current, total, size = 20) {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((size * current) / total);
    const empty = size - filled;
    return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percentage}%`;
}

// ─── 𝑺𝑰𝒁𝑬 𝑭𝑶𝑹𝑴𝑨𝑻 ───
function formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

module.exports = {
    decorations,
    formatText,
    mikoHeader,
    mikoFooter,
    randomImage,
    sendButtons,
    sendInteractiveButtons,
    sendCarousel,
    sendWithNewsletter,
    sendMedia,
    forwardMessage,
    reply,
    react,
    fetchJson,
    fetchBuffer,
    getGroupAdmins,
    isAdmin,
    isBotAdmin,
    isDeveloper,
    formatTime,
    pickRandom,
    capitalize,
    formatNumber,
    progressBar,
    formatSize
};
