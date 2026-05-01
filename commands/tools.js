// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑻𝑶𝑶𝑳𝑺 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (46-60)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { 
    mikoHeader, mikoFooter, reply, react, sendMedia, 
    sendInteractiveButtons, fetchJson, fetchBuffer, randomImage 
} = require('../lib/helpers');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const commands = {};

// ─── 46. 𝑺𝑻𝑰𝑪𝑲𝑬𝑹 ───
commands.sticker = commands.s = {
    category: 'tools',
    desc: 'تحويل صورة/فيديو لملصق',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted && !msg.message.imageMessage && !msg.message.videoMessage) {
            return await reply(sock, jid, '❌ *أرسل صورة أو فيديو أو رد على رسالة*', msg);
        }

        await react(sock, jid, msg.key, '🎨');

        try {
            const mediaMsg = quoted || msg.message;
            const type = mediaMsg.imageMessage ? 'image' : mediaMsg.videoMessage ? 'video' : null;
            if (!type) return await reply(sock, jid, '❌ *نوع الميديا غير مدعوم*', msg);

            const stream = await sock.downloadMediaMessage(mediaMsg);
            await sock.sendMessage(jid, {
                sticker: stream,
                mimetype: type === 'image' ? 'image/webp' : 'video/webp',
                newsletter: config.newsletter
            });

            await react(sock, jid, msg.key, '✅');
        } catch (e) {
            console.error(e);
            await reply(sock, jid, '❌ *فشل في إنشاء الملصق*', msg);
        }
    }
};

// ─── 47. 𝑻𝑶𝑰𝑴𝑨𝑮𝑬 ───
commands.toimg = {
    category: 'tools',
    desc: 'تحويل ملصق لصورة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.stickerMessage) {
            return await reply(sock, jid, '❌ *رد على ملصق*', msg);
        }

        await react(sock, jid, msg.key, '🖼️');

        try {
            const stream = await sock.downloadMediaMessage(quoted);
            await sock.sendMessage(jid, {
                image: stream,
                caption: `🖼️ *تم التحويل*\n${mikoFooter()}`,
                newsletter: config.newsletter
            });
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 48. 𝑻𝑶𝑴𝑷3 ───
commands.tomp3 = {
    category: 'tools',
    desc: 'تحويل فيديو لصوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.videoMessage) {
            return await reply(sock, jid, '❌ *رد على فيديو*', msg);
        }

        await react(sock, jid, msg.key, '🎵');

        try {
            const stream = await sock.downloadMediaMessage(quoted);
            await sock.sendMessage(jid, {
                audio: stream,
                mimetype: 'audio/mp4',
                fileName: 'audio.mp3',
                newsletter: config.newsletter
            });
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 49. 𝑹𝑬𝑽𝑬𝑹𝑺𝑬 ───
commands.reverse = {
    category: 'tools',
    desc: 'عكس النص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*', msg);

        const reversed = args.join(' ').split('').reverse().join('');
        await reply(sock, jid, `🔄 *النص المعكوس:*\n${reversed}`, msg);
    }
};

// ─── 50. 𝑩𝑨𝑺𝑬64 ───
commands.base64 = {
    category: 'tools',
    desc: 'تشفير/فك تشفير Base64',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*\nمثال: .base64 encode مرحبا', msg);

        const action = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        if (action === 'encode') {
            const encoded = Buffer.from(text).toString('base64');
            await reply(sock, jid, `🔐 *التشفير:*\n${encoded}`, msg);
        } else if (action === 'decode') {
            try {
                const decoded = Buffer.from(text, 'base64').toString('utf8');
                await reply(sock, jid, `🔓 *فك التشفير:*\n${decoded}`, msg);
            } catch {
                await reply(sock, jid, '❌ *نص غير صالح*', msg);
            }
        } else {
            await reply(sock, jid, '📌 *الاستخدام:* .base64 encode/decode نص', msg);
        }
    }
};

// ─── 51. 𝑸𝑹 ───
commands.qr = {
    category: 'tools',
    desc: 'إنشاء QR Code',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*', msg);

        await react(sock, jid, msg.key, '📱');

        try {
            const text = args.join(' ');
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
            await sendMedia(sock, jid, 'image', qrUrl, `📱 *QR Code لـ:* ${text}\n${mikoFooter()}`);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 52. 𝑺𝑪𝑹𝑬𝑬𝑵𝑺𝑯𝑶𝑻 ───
commands.ss = commands.screenshot = {
    category: 'tools',
    desc: 'لقطة شاشة لموقع',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل الرابط*', msg);

        await react(sock, jid, msg.key, '📸');

        try {
            const url = args[0];
            const ssUrl = `https://image.thum.io/get/width/1200/crop/800/${url}`;
            await sendMedia(sock, jid, 'image', ssUrl, `📸 *لقطة شاشة لـ:* ${url}\n${mikoFooter()}`);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 53. 𝑺𝑯𝑶𝑹𝑻 ───
commands.short = {
    category: 'tools',
    desc: 'اختصار الروابط',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل الرابط*', msg);

        try {
            const url = args[0];
            const data = await fetchJson(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);

            if (data && data.shorturl) {
                const buttons = [
                    { name: "cta_copy", params: { display_text: "📋╎ نسخ الرابط المختصر", copy_code: data.shorturl } },
                    { name: "cta_url", params: { display_text: "🔗╎ فتح الرابط", url: data.shorturl } }
                ];
                await sendInteractiveButtons(sock, jid, 
                    `${mikoHeader('𝑼𝑹𝑳 𝑺𝑯𝑶𝑹𝑻𝑬𝑵𝑬𝑹')}\n\n` +
                    `🔗 *الرابط الأصلي:* ${url}\n` +
                    `✂️ *الرابط المختصر:* ${data.shorturl}\n${mikoFooter()}`, buttons);
            } else {
                await reply(sock, jid, '❌ *فشل في الاختصار*', msg);
            }
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 54. 𝑰𝑷 ───
commands.ip = {
    category: 'tools',
    desc: 'معلومات IP',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const ip = args[0] || '';

        try {
            const data = await fetchJson(`https://ipapi.co/${ip}/json/`);
            if (data.error) return await reply(sock, jid, '❌ *IP غير صالح*', msg);

            const text = `${mikoHeader('𝑰𝑷 𝑰𝑵𝑭𝑶')}\n\n` +
                `🌐 *IP:* ${data.ip}\n` +
                `🏙️ *المدينة:* ${data.city}\n` +
                `📍 *المنطقة:* ${data.region}\n` +
                `🇺🇸 *الدولة:* ${data.country_name}\n` +
                `📮 *الرمز البريدي:* ${data.postal}\n` +
                `🌍 *القارة:* ${data.continent_code}\n` +
                `💰 *العملة:* ${data.currency}\n` +
                `📞 *رمز الاتصال:* +${data.country_calling_code}\n` +
                `⏰ *المنطقة الزمنية:* ${data.timezone}\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 55. 𝑾𝑯𝑶𝑰𝑺 ───
commands.whois = {
    category: 'tools',
    desc: 'معلومات النطاق',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النطاق*', msg);

        try {
            const domain = args[0];
            const data = await fetchJson(`https://rdap.org/domain/${domain}`);

            const text = `${mikoHeader('𝑾𝑯𝑶𝑰𝑺')}\n\n` +
                `🌐 *النطاق:* ${domain}\n` +
                `📅 *الإنشاء:* ${data.events?.find(e => e.eventAction === 'registration')?.eventDate || 'غير معروف'}\n` +
                `🔄 *التحديث:* ${data.events?.find(e => e.eventAction === 'last update')?.eventDate || 'غير معروف'}\n` +
                `🏢 *الجهة المسجلة:* ${data.entities?.[0]?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'غير معروف'}\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, `🌐 *معلومات النطاق:* ${args[0]}\n\n⚠️ *استخدم WHOIS API للبيانات الدقيقة*`, msg);
        }
    }
};

// ─── 56. 𝑷𝑨𝑺𝑺𝑾𝑶𝑹𝑫 ───
commands.password = commands.pass = {
    category: 'tools',
    desc: 'توليد كلمة مرور',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const length = parseInt(args[0]) || 12;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const buttons = [
            { name: "cta_copy", params: { display_text: "📋╎ نسخ كلمة المرور", copy_code: password } }
        ];

        await sendInteractiveButtons(sock, jid, 
            `${mikoHeader('𝑷𝑨𝑺𝑺𝑾𝑶𝑹𝑫 𝑮𝑬𝑵𝑬𝑹𝑨𝑻𝑶𝑹')}\n\n` +
            `🔐 *كلمة المرور:* ||${password}||\n` +
            `📏 *الطول:* ${length}\n${mikoFooter()}`, buttons);
    }
};

// ─── 57. 𝑭𝑨𝑲𝑬𝑫𝑨𝑻𝑨 ───
commands.fakedata = {
    category: 'tools',
    desc: 'بيانات وهمية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        const firstNames = ['أحمد', 'محمد', 'علي', 'خالد', 'عمر', 'فاطمة', 'عائشة', 'مريم', 'نورة', 'سارة'];
        const lastNames = ['الفلاني', 'العلاني', 'الحسني', 'الراشدي', 'المهندس', 'الطبيب', 'الكعبي', 'الشامسي'];
        const cities = ['الرياض', 'جدة', 'الدمام', 'أبوظبي', 'دبي', 'الدوحة', 'المنامة', 'الكويت'];
        const jobs = ['مهندس', 'طبيب', 'محاسب', 'مدير', 'معلم', 'مبرمج', 'مصمم', 'محامي'];

        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const age = Math.floor(Math.random() * 40) + 20;
        const city = cities[Math.floor(Math.random() * cities.length)];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const phone = `+${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        const email = `${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 999)}@email.com`;

        const text = `${mikoHeader('𝑭𝑨𝑲𝑬 𝑫𝑨𝑻𝑨')}\n\n` +
            `👤 *الاسم:* ${name}\n` +
            `🎂 *العمر:* ${age}\n` +
            `🏙️ *المدينة:* ${city}\n` +
            `💼 *الوظيفة:* ${job}\n` +
            `📞 *الهاتف:* ${phone}\n` +
            `📧 *البريد:* ${email}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 58. 𝑴𝑶𝑹𝑺𝑬 ───
commands.morse = {
    category: 'tools',
    desc: 'ترجمة مورس',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*', msg);

        const morseCode = {
            'ا': '.-', 'ب': '-...', 'ت': '-', 'ث': '-.-.', 'ج': '.---', 'ح': '....', 'خ': '---',
            'د': '-..', 'ذ': '--..', 'ر': '.-.', 'ز': '---.', 'س': '...', 'ش': '----', 'ص': '-.-.',
            'ض': '...-', 'ط': '..-', 'ظ': '-.--', 'ع': '.-.-', 'غ': '--.', 'ف': '..-.', 'ق': '--.-',
            'ك': '-.-', 'ل': '.-..', 'م': '--', 'ن': '-.', 'ه': '..', 'و': '.--', 'ي': '..-..',
            ' ': ' / ', 'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
            'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--',
            'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
            'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..', '1': '.----',
            '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', '0': '-----'
        };

        const text = args.join(' ').toLowerCase();
        let morse = '';
        for (const char of text) {
            morse += (morseCode[char] || char) + ' ';
        }

        await reply(sock, jid, `📡 *ترجمة مورس:*\n${morse}`, msg);
    }
};

// ─── 59. 𝑩𝑰𝑵𝑨𝑹𝒀 ───
commands.binary = {
    category: 'tools',
    desc: 'ترجمة ثنائية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*\nمثال: .binary encode مرحبا', msg);

        const action = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        if (action === 'encode') {
            const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            await reply(sock, jid, `💻 *الترميز الثنائي:*\n${binary}`, msg);
        } else if (action === 'decode') {
            try {
                const decoded = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                await reply(sock, jid, `💻 *فك الترميز:*\n${decoded}`, msg);
            } catch {
                await reply(sock, jid, '❌ *نص ثنائي غير صالح*', msg);
            }
        } else {
            await reply(sock, jid, '📌 *الاستخدام:* .binary encode/decode نص', msg);
        }
    }
};

// ─── 60. 𝑬𝑵𝑪𝑶𝑫𝑬 ───
commands.encode = {
    category: 'tools',
    desc: 'تشفير النصوص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*', msg);

        const text = args.join(' ');
        const rot13 = text.replace(/[a-zA-Z]/g, char => {
            const code = char.charCodeAt(0);
            const base = code < 97 ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
        });

        await reply(sock, jid, `🔐 *ROT13:*\n${rot13}`, msg);
    }
};

module.exports = commands;
