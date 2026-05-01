// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑮𝑬𝑵𝑬𝑹𝑨𝑳 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (1-15)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { 
    mikoHeader, mikoFooter, randomImage, reply, sendInteractiveButtons, 
    sendCarousel, sendWithNewsletter, react, isDeveloper, formatTime, 
    pickRandom, formatSize, fetchJson 
} = require('../lib/helpers');
const os = require('os');
const moment = require('moment-timezone');

const commands = {};

// ─── 1. 𝑺𝑻𝑨𝑹𝑻 / 𝑴𝑬𝑵𝑼 ───
commands.menu = {
    category: 'general',
    desc: 'عرض قائمة الأوامر',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        await react(sock, jid, msg.key, '⏳');

        const image = randomImage();
        const buttons = [
            { name: "single_select", params: { title: "📋 اختر القسم", sections: [{ title: "الأقسام", rows: [
                { title: "🌐 عام", description: "الأوامر العامة", id: "menu_general" },
                { title: "👥 مجموعات", description: "أوامر المجموعات", id: "menu_group" },
                { title: "📥 تحميل", description: "أوامر التحميل", id: "menu_downloader" },
                { title: "🛠️ أدوات", description: "الأدوات والخدمات", id: "menu_tools" },
                { title: "🎮 ترفيه", description: "ألعاب وترفيه", id: "menu_fun" },
                { title: "🎲 ألعاب", description: "ألعاب تفاعلية", id: "menu_games" },
                { title: "🤖 ذكاء", description: "ذكاء اصطناعي", id: "menu_ai" },
                { title: "🕌 دين", description: "أوامر دينية", id: "menu_religion" },
                { title: "💻 تقنية", description: "أوامر تقنية", id: "menu_tech" },
                { title: "👑 مطور", description: "أوامر المطور", id: "menu_owner" }
            ]}] }},
            { name: "cta_url", params: { display_text: "🔗╎ قناة البوت", url: "https://whatsapp.com/channel/0029Vad7XyY0G0XtcdpVAv1X" } },
            { name: "cta_copy", params: { display_text: "📋╎ نسخ الرابط", copy_code: "https://whatsapp.com/channel/0029Vad7XyY0G0XtcdpVAv1X" } },
            { name: "quick_reply", params: { display_text: "📊╎ معلومات البوت", id: "bot_info" } }
        ];

        const menuText = `${mikoHeader('𝑴𝑬𝑵𝑼 𝑷𝑹𝑰𝑵𝑪𝑰𝑷𝑨𝑳')}\n\n` +
            `🌸 *أهلاً* @${sender.split('@')[0]} 🌸\n\n` +
            `🤖 *اسم البوت:* ${config.botName}\n` +
            `📌 *الإصدار:* ${config.botVersion}\n` +
            `⚡ *البادئة:* ${config.prefix.join(' ')}\n` +
            `📊 *الأوامر:* 105 أمر\n\n` +
            `👇 *اختر القسم من القائمة أدناه:*\n${mikoFooter()}`;

        await sendInteractiveButtons(sock, jid, menuText, buttons, { 
            image, 
            title: '𝑴𝑰𝑲𝑶 𝑴𝑬𝑵𝑼',
            mentions: [sender]
        });
        await react(sock, jid, msg.key, '✅');
    }
};

// ─── 2. 𝑷𝑰𝑵𝑮 ───
commands.ping = {
    category: 'general',
    desc: 'اختبار سرعة البوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const start = Date.now();
        await react(sock, jid, msg.key, '🏓');
        const latency = Date.now() - start;

        const text = `${mikoHeader('𝑷𝑰𝑵𝑮 𝑻𝑬𝑺𝑻')}\n\n` +
            `🏓 *البنغ:* ${latency}ms\n` +
            `⚡ *الحالة:* نشط\n` +
            `🤖 *البوت:* ${config.botName}\n` +
            `⏰ *الوقت:* ${moment().tz('Asia/Riyadh').format('HH:mm:ss')}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 3. 𝑺𝑻𝑨𝑻𝑼𝑺 / 𝑩𝑶𝑻𝑰𝑵𝑭𝑶 ───
commands.botinfo = commands.status = {
    category: 'general',
    desc: 'معلومات البوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const uptime = formatTime(process.uptime() * 1000);
        const ram = formatSize(process.memoryUsage().heapUsed);
        const totalRam = formatSize(os.totalmem());
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus().length;

        const text = `${mikoHeader('𝑩𝑶𝑻 𝑰𝑵𝑭𝑶')}\n\n` +
            `🤖 *الاسم:* ${config.botName}\n` +
            `📌 *الإصدار:* ${config.botVersion}\n` +
            `⏱️ *مدة التشغيل:* ${uptime}\n` +
            `💾 *الرام المستخدم:* ${ram}\n` +
            `💿 *إجمالي الرام:* ${totalRam}\n` +
            `💻 *النظام:* ${platform} ${arch}\n` +
            `🖥️ *المعالجات:* ${cpus}\n` +
            `📊 *الأوامر:* 105\n` +
            `👑 *المطور:* 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿\n` +
            `📱 *Node.js:* ${process.version}\n${mikoFooter()}`;

        await sendWithNewsletter(sock, jid, { 
            image: { url: randomImage() }, 
            caption: text 
        });
    }
};

// ─── 4. 𝑶𝑾𝑵𝑬𝑹 ───
commands.owner = {
    category: 'general',
    desc: 'معلومات المطور',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const buttons = [
            { name: "cta_call", params: { display_text: "📞╎ اتصل بالمطور 1", phone_number: "97431298191" } },
            { name: "cta_call", params: { display_text: "📞╎ اتصل بالمطور 2", phone_number: "130391365169264" } },
            { name: "cta_copy", params: { display_text: "📋╎ نسخ رقم 1", copy_code: "97431298191" } },
            { name: "cta_copy", params: { display_text: "📋╎ نسخ رقم 2", copy_code: "130391365169264" } }
        ];

        const text = `${mikoHeader('𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶')}\n\n` +
            `👑 *المطور:* 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿\n\n` +
            `📞 *رقم المطور 1:*\n+974 3129 8191\n\n` +
            `📞 *رقم المطور 2:*\n+1 (303) 913-6516\n\n` +
            `📢 *القناة:* ${config.newsletter.name}\n${mikoFooter()}`;

        await sendInteractiveButtons(sock, jid, text, buttons);
    }
};

// ─── 5. 𝑻𝑰𝑴𝑬 ───
commands.time = {
    category: 'general',
    desc: 'الوقت الحالي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const time = moment().tz('Asia/Riyadh').format('HH:mm:ss');
        const date = moment().tz('Asia/Riyadh').format('YYYY/MM/DD');
        const day = moment().tz('Asia/Riyadh').format('dddd');

        const text = `${mikoHeader('𝑻𝑰𝑴𝑬 & 𝑫𝑨𝑻𝑬')}\n\n` +
            `🕐 *الوقت:* ${time}\n` +
            `📅 *التاريخ:* ${date}\n` +
            `📆 *اليوم:* ${day}\n` +
            `🌍 *المنطقة:* Asia/Riyadh\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 6. 𝑺𝑨𝒀 ───
commands.say = {
    category: 'general',
    desc: 'تكرار النص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص المراد تكراره*', msg);
        await reply(sock, jid, `📢 *${args.join(' ')}*`, msg);
    }
};

// ─── 7. 𝑪𝑨𝑳𝑪 ───
commands.calc = {
    category: 'general',
    desc: 'آلة حاسبة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل المعادلة*\nمثال: .calc 5 + 5', msg);

        try {
            const expression = args.join(' ').replace(/[^0-9+\-*/().\s]/g, '');
            const result = eval(expression);
            const text = `${mikoHeader('𝑪𝑨𝑳𝑪𝑼𝑳𝑨𝑻𝑶𝑹')}\n\n` +
                `📝 *المعادلة:* ${expression}\n` +
                `✅ *النتيجة:* ${result}\n${mikoFooter()}`;
            await reply(sock, jid, text, msg);
        } catch {
            await reply(sock, jid, '❌ *معادلة غير صالحة*', msg);
        }
    }
};

// ─── 8. 𝑼𝑷𝑻𝑰𝑴𝑬 ───
commands.uptime = {
    category: 'general',
    desc: 'مدة تشغيل البوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const uptime = formatTime(process.uptime() * 1000);
        await reply(sock, jid, `⏱️ *مدة التشغيل:* ${uptime}`, msg);
    }
};

// ─── 9. 𝑺𝑷𝑬𝑬𝑫 ───
commands.speed = {
    category: 'general',
    desc: 'سرعة الاستجابة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const start = Date.now();
        await react(sock, jid, msg.key, '⚡');
        const end = Date.now();
        await reply(sock, jid, `⚡ *سرعة الاستجابة:* ${end - start}ms`, msg);
    }
};

// ─── 10. 𝑹𝑼𝑵𝑻𝑰𝑴𝑬 ───
commands.runtime = {
    category: 'general',
    desc: 'وقت التشغيل التفصيلي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const text = `${mikoHeader('𝑹𝑼𝑵𝑻𝑰𝑴𝑬')}\n\n` +
            `📅 *أيام:* ${days}\n` +
            `⏰ *ساعات:* ${hours}\n` +
            `🕐 *دقائق:* ${minutes}\n` +
            `⏱️ *ثواني:* ${seconds}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 11. 𝑺𝑬𝑹𝑽𝑬𝑹 ───
commands.server = {
    category: 'general',
    desc: 'معلومات السيرفر',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const totalMem = formatSize(os.totalmem());
        const freeMem = formatSize(os.freemem());
        const usedMem = formatSize(os.totalmem() - os.freemem());
        const cpuModel = os.cpus()[0].model;

        const text = `${mikoHeader('𝑺𝑬𝑹𝑽𝑬𝑹 𝑰𝑵𝑭𝑶')}\n\n` +
            `💻 *النظام:* ${os.type()}\n` +
            `🖥️ *المنصة:* ${os.platform()} ${os.arch()}\n` +
            `⚙️ *المعالج:* ${cpuModel}\n` +
            `💾 *الرام الكلي:* ${totalMem}\n` +
            `💿 *الرام المستخدم:* ${usedMem}\n` +
            `📀 *الرام المتاح:* ${freeMem}\n` +
            `⏱️ *الوقت المنذ التشغيل:* ${formatTime(os.uptime() * 1000)}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 12. 𝑸𝑼𝑶𝑻𝑬 ───
commands.quote = {
    category: 'general',
    desc: 'اقتباس عشوائي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const quotes = [
            "💫 *النجاح ليس نهائياً، والفشل ليس قاتلاً، إنه الشجاعة للاستمرار التي تهم.*",
            "🌟 *لا تنتظر الفرصة، اصنعها.*",
            "💪 *الطريق إلى النجاح يمر دائماً عبر العمل الجاد.*",
            "🎯 *حلمك لا يمتلك تاريخ انتهاء، خذ نفساً عميقاً وحاول مرة أخرى.*",
            "🔥 *كل يوم هو فرصة جديدة لتصبح أفضل نسخة من نفسك.*",
            "✨ *الإيمان بالنفس هو سر العظمة.*",
            "🌸 *السعادة ليست وجهة، إنها طريقة للعيش.*",
            "💎 *الصبر مفتاح الفرج.*",
            "🌙 *كل ليلة يأتي بعدها فجر جديد.*",
            "⭐ *كن التغيير الذي تريد رؤيته في العالم.*"
        ];
        await reply(sock, jid, pickRandom(quotes), msg);
    }
};

// ─── 13. 𝑭𝑨𝑪𝑻 ───
commands.fact = {
    category: 'general',
    desc: 'حقيقة عشوائية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const facts = [
            "🧠 *العقل البشري يحتوي على حوالي 86 مليار خلية عصبية.*",
            "🌍 *الأرض تدور حول نفسها بسرعة 1670 كم/ساعة.*",
            "🐙 *الأخطوط لها ثلاثة قلوب.*",
            "🍯 *العسل لا يفسد أبداً.*",
            "🦒 *لسان الزرافة أزرق اللون.*",
            "🦋 *الفراشات تتذوق بأرجلها.*",
            "🐘 *الفيل هو الحيوان الوحيد الذي لا يستطيع القفز.*",
            "🌵 *الصبار يمكنه العيش بدون ماء لسنوات.*",
            "🦈 *القرش يستبدل أسنانه باستمرار.*",
            "🐝 *النحلة تنتج ملعقة صغيرة واحدة من العسل في حياتها.*"
        ];
        await reply(sock, jid, pickRandom(facts), msg);
    }
};

// ─── 14. 𝑾𝑬𝑨𝑻𝑯𝑬𝑹 ───
commands.weather = {
    category: 'general',
    desc: 'حالة الطقس',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const city = args.join(' ') || 'Riyadh';

        try {
            const data = await fetchJson(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric&lang=ar`);
            if (!data || data.cod !== 200) {
                return await reply(sock, jid, `🌤️ *حالة الطقس في ${city}*\n\n🌡️ *الحرارة:* معتدلة\n💨 *الرياح:* نشطة\n☁️ *الحالة:* غائم جزئياً\n\n⚠️ *استخدم API Key خاص للبيانات الدقيقة*`, msg);
            }

            const text = `${mikoHeader('𝑾𝑬𝑨𝑻𝑯𝑬𝑹')}\n\n` +
                `🌍 *المدينة:* ${data.name}\n` +
                `🌡️ *الحرارة:* ${data.main.temp}°C\n` +
                `💨 *الرياح:* ${data.wind.speed} m/s\n` +
                `💧 *الرطوبة:* ${data.main.humidity}%\n` +
                `☁️ *الحالة:* ${data.weather[0].description}\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch {
            await reply(sock, jid, `🌤️ *حالة الطقس في ${city}*\n\n🌡️ *الحرارة:* 25°C\n💨 *الرياح:* 10 km/h\n☁️ *الحالة:* مشمس\n\n⚠️ *استخدم API Key خاص للبيانات الدقيقة*`, msg);
        }
    }
};

// ─── 15. 𝑻𝑹𝑨𝑵𝑺𝑳𝑨𝑻𝑬 ───
commands.translate = {
    category: 'general',
    desc: 'ترجمة النصوص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص للترجمة*\nمثال: .translate مرحبا', msg);

        try {
            const text = args.join(' ');
            const translate = require('@vitalets/google-translate-api');
            const result = await translate(text, { to: 'en' });

            const replyText = `${mikoHeader('𝑻𝑹𝑨𝑵𝑺𝑳𝑨𝑻𝑶𝑹')}\n\n` +
                `📝 *النص الأصلي:* ${text}\n\n` +
                `🔄 *الترجمة:* ${result.text}\n` +
                `🌐 *من:* ${result.from.language.iso} → en\n${mikoFooter()}`;

            await reply(sock, jid, replyText, msg);
        } catch {
            await reply(sock, jid, '❌ *حدث خطأ في الترجمة*', msg);
        }
    }
};

module.exports = commands;
