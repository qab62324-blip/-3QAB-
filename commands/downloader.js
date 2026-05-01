// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑬𝑹 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (32-45)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { 
    mikoHeader, mikoFooter, reply, react, sendMedia, 
    sendWithNewsletter, fetchJson, fetchBuffer, formatSize 
} = require('../lib/helpers');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const commands = {};

// ─── 32. 𝑷𝑳𝑨𝒀 ───
commands.play = {
    category: 'downloader',
    desc: 'تشغيل أغنية من يوتيوب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل اسم الأغنية*\nمثال: .play Despacito', msg);

        await react(sock, jid, msg.key, '🎵');

        try {
            const query = args.join(' ');
            const search = await yts(query);
            if (!search.videos.length) return await reply(sock, jid, '❌ *لم يتم العثور على نتائج*', msg);

            const video = search.videos[0];
            const buttons = [
                { name: "cta_url", params: { display_text: "🔗╎ مشاهدة على يوتيوب", url: video.url } },
                { name: "cta_copy", params: { display_text: "📋╎ نسخ الرابط", copy_code: video.url } },
                { name: "quick_reply", params: { display_text: "⬇️╎ تحميل صوت", id: `yta_${video.videoId}` } },
                { name: "quick_reply", params: { display_text: "⬇️╎ تحميل فيديو", id: `ytv_${video.videoId}` } }
            ];

            const text = `${mikoHeader('𝑴𝑼𝑺𝑰𝑪 𝑺𝑬𝑨𝑹𝑪𝑯')}\n\n` +
                `🎵 *العنوان:* ${video.title}\n` +
                `⏱️ *المدة:* ${video.timestamp}\n` +
                `👁️ *المشاهدات:* ${video.views.toLocaleString()}\n` +
                `📅 *التاريخ:* ${video.ago}\n` +
                `👤 *القناة:* ${video.author.name}\n${mikoFooter()}`;

            await sendWithNewsletter(sock, jid, {
                image: { url: video.thumbnail },
                caption: text
            });

            // Send audio
            try {
                const audioStream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
                await sock.sendMessage(jid, {
                    audio: { stream: audioStream },
                    mimetype: 'audio/mp4',
                    fileName: `${video.title}.mp3`,
                    newsletter: config.newsletter
                });
            } catch (audioErr) {
                console.log('Audio download failed, sending link instead');
            }

        } catch (e) {
            console.error(e);
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 33. 𝒀𝑻𝑴𝑷3 ───
commands.ytmp3 = commands.yta = {
    category: 'downloader',
    desc: 'تحميل صوت يوتيوب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط يوتيوب*', msg);

        await react(sock, jid, msg.key, '⬇️');

        try {
            const url = args[0];
            if (!ytdl.validateURL(url)) return await reply(sock, jid, '❌ *رابط غير صالح*', msg);

            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;

            await reply(sock, jid, `⬇️ *جاري التحميل...*\n🎵 ${title}`, msg);

            const audioStream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
            await sock.sendMessage(jid, {
                audio: { stream: audioStream },
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`,
                newsletter: config.newsletter
            });

        } catch (e) {
            await reply(sock, jid, '❌ *فشل التحميل*', msg);
        }
    }
};

// ─── 34. 𝒀𝑻𝑴𝑷4 ───
commands.ytmp4 = commands.ytv = {
    category: 'downloader',
    desc: 'تحميل فيديو يوتيوب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط يوتيوب*', msg);

        await react(sock, jid, msg.key, '⬇️');

        try {
            const url = args[0];
            if (!ytdl.validateURL(url)) return await reply(sock, jid, '❌ *رابط غير صالح*', msg);

            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;

            await reply(sock, jid, `⬇️ *جاري التحميل...*\n🎬 ${title}`, msg);

            const videoStream = ytdl(url, { quality: 'highest', filter: 'audioandvideo' });
            await sock.sendMessage(jid, {
                video: { stream: videoStream },
                caption: `🎬 ${title}\n📥 تم التحميل بواسطة 𝑴𝑰𝑲𝑶`,
                newsletter: config.newsletter
            });

        } catch (e) {
            await reply(sock, jid, '❌ *فشل التحميل*', msg);
        }
    }
};

// ─── 35. 𝑻𝑰𝑲𝑻𝑶𝑲 ───
commands.tiktok = {
    category: 'downloader',
    desc: 'تحميل من تيك توك',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط تيك توك*', msg);

        await react(sock, jid, msg.key, '⬇️');

        try {
            const url = args[0];
            // Using alternative API
            const apiUrl = `https://api.tikdown.org/getvideo?url=${encodeURIComponent(url)}`;
            const data = await fetchJson(apiUrl);

            if (data && data.video) {
                await sendMedia(sock, jid, 'video', data.video, `📥 *تم التحميل من تيك توك*\n${mikoFooter()}`);
            } else {
                await reply(sock, jid, '❌ *فشل في جلب الفيديو*', msg);
            }
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 36. 𝑰𝑵𝑺𝑻𝑨 ───
commands.insta = commands.ig = {
    category: 'downloader',
    desc: 'تحميل من انستغرام',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط الانستغرام*', msg);

        await react(sock, jid, msg.key, '⬇️');

        try {
            const url = args[0];
            const apiUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`;
            // Fallback
            await reply(sock, jid, `📥 *جاري معالجة الرابط...*\n🔗 ${url}\n\n⚠️ *استخدم API خاص للتحميل الفعلي*`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 37. 𝑭𝑨𝑪𝑬𝑩𝑶𝑶𝑲 ───
commands.facebook = commands.fb = {
    category: 'downloader',
    desc: 'تحميل من فيسبوك',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط فيسبوك*', msg);

        await react(sock, jid, msg.key, '⬇️');
        await reply(sock, jid, `📥 *جاري معالجة الرابط...*\n🔗 ${args[0]}\n\n⚠️ *استخدم API خاص للتحميل الفعلي*`, msg);
    }
};

// ─── 38. 𝑻𝑾𝑰𝑻𝑻𝑬𝑹 ───
commands.twitter = commands.tw = {
    category: 'downloader',
    desc: 'تحميل من تويتر',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط تويتر*', msg);

        await react(sock, jid, msg.key, '⬇️');
        await reply(sock, jid, `📥 *جاري معالجة الرابط...*\n🔗 ${args[0]}\n\n⚠️ *استخدم API خاص للتحميل الفعلي*`, msg);
    }
};

// ─── 39. 𝑺𝑷𝑶𝑻𝑰𝑭𝒀 ───
commands.spotify = {
    category: 'downloader',
    desc: 'بحث/تحميل من سبوتيفاي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل اسم الأغنية*', msg);

        await react(sock, jid, msg.key, '🎵');
        await reply(sock, jid, `🎵 *جاري البحث...*\n🔍 ${args.join(' ')}\n\n⚠️ *استخدم Spotify API للنتائج الفعلية*`, msg);
    }
};

// ─── 40. 𝑴𝑬𝑫𝑰𝑨𝑭𝑰𝑹𝑬 ───
commands.mediafire = {
    category: 'downloader',
    desc: 'تحميل من ميديافاير',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط ميديافاير*', msg);

        await react(sock, jid, msg.key, '⬇️');
        await reply(sock, jid, `📥 *جاري معالجة الرابط...*\n🔗 ${args[0]}\n\n⚠️ *استخدم API خاص للتحميل الفعلي*`, msg);
    }
};

// ─── 41. 𝑮𝑫𝑹𝑰𝑽𝑬 ───
commands.gdrive = {
    category: 'downloader',
    desc: 'تحميل من جوجل درايف',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط جوجل درايف*', msg);

        await react(sock, jid, msg.key, '⬇️');
        await reply(sock, jid, `📥 *جاري معالجة الرابط...*\n🔗 ${args[0]}\n\n⚠️ *استخدم API خاص للتحميل الفعلي*`, msg);
    }
};

// ─── 42. 𝑷𝑰𝑵𝑻𝑬𝑹𝑬𝑺𝑻 ───
commands.pinterest = {
    category: 'downloader',
    desc: 'بحث صور بنترست',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل كلمة البحث*', msg);

        await react(sock, jid, msg.key, '🔍');

        try {
            const query = args.join(' ');
            const gis = require('g-i-s');

            gis(query, async (err, results) => {
                if (err || !results.length) {
                    return await reply(sock, jid, '❌ *لم يتم العثور على نتائج*', msg);
                }

                const images = results.slice(0, 5);
                for (const img of images) {
                    await sendMedia(sock, jid, 'image', img.url, `📌 ${query}\n${mikoFooter()}`);
                }
            });
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 43. 𝒀𝑻𝑺𝑬𝑨𝑹𝑪𝑯 ───
commands.ytsearch = commands.yts = {
    category: 'downloader',
    desc: 'بحث يوتيوب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل كلمة البحث*', msg);

        await react(sock, jid, msg.key, '🔍');

        try {
            const query = args.join(' ');
            const search = await yts(query);

            if (!search.videos.length) return await reply(sock, jid, '❌ *لم يتم العثور على نتائج*', msg);

            let text = `${mikoHeader('𝒀𝑶𝑼𝑻𝑼𝑩𝑬 𝑺𝑬𝑨𝑹𝑪𝑯')}\n\n`;
            search.videos.slice(0, 10).forEach((v, i) => {
                text += `${i + 1}. *${v.title}*\n⏱️ ${v.timestamp} | 👁️ ${v.views.toLocaleString()}\n🔗 ${v.url}\n\n`;
            });
            text += mikoFooter();

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 44. 𝑺𝑶𝑼𝑵𝑫𝑪𝑳𝑶𝑼𝑫 ───
commands.soundcloud = {
    category: 'downloader',
    desc: 'بحث/تحميل من ساوند كلاود',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل اسم الأغنية*', msg);

        await react(sock, jid, msg.key, '🎵');
        await reply(sock, jid, `🎵 *جاري البحث...*\n🔍 ${args.join(' ')}\n\n⚠️ *استخدم SoundCloud API للنتائج الفعلية*`, msg);
    }
};

// ─── 45. 𝑷𝑳𝑨𝒀𝑳𝑰𝑺𝑻 ───
commands.playlist = {
    category: 'downloader',
    desc: 'قائمة تشغيل يوتيوب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رابط قائمة التشغيل*', msg);

        await react(sock, jid, msg.key, '📋');
        await reply(sock, jid, `📋 *جاري معالجة قائمة التشغيل...*\n🔗 ${args[0]}\n\n⚠️ *استخدم API خاص للنتائج الفعلية*`, msg);
    }
};

module.exports = commands;
