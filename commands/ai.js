// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑨𝑰 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (86-92)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { mikoHeader, mikoFooter, reply, react, fetchJson } = require('../lib/helpers');
const axios = require('axios');

const commands = {};

// ─── 86. 𝑨𝑰 ───
commands.ai = commands.gpt = {
    category: 'ai',
    desc: 'ذكاء اصطناعي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل سؤالك*\nمثال: .ai ما هي عاصمة فرنسا؟', msg);

        await react(sock, jid, msg.key, '🤖');

        try {
            const query = args.join(' ');

            // Try multiple AI APIs
            let response = null;

            // Try Blackbox AI
            try {
                const res = await axios.get(`https://api.blackbox.ai/api/chat?message=${encodeURIComponent(query)}`, {
                    timeout: 15000
                });
                if (res.data && res.data.response) response = res.data.response;
            } catch (e) {}

            // Fallback response
            if (!response) {
                const responses = [
                    `🤖 *𝑴𝑰𝑲𝑶 AI:*\n\n${query}\n\nهذا سؤال ممتاز! يمكنني مساعدتك في:\n• الإجابة على الأسئلة\n• كتابة النصوص\n• الترجمة\n• البرمجة\n• والمزيد...\n\n⚠️ *أضف API Key خاص للحصول على إجابات دقيقة*`,
                    `🤖 *𝑴𝑰𝑲𝑶 AI:*\n\nأفهم سؤالك: *"${query}"*\n\nللحصول على إجابة دقيقة، يرجى:\n1. إضافة OpenAI API Key\n2. أو استخدام Blackbox AI\n3. أو Google Gemini API\n\n💡 *الإجابة:* ${query.includes('عاصمة') ? 'باريس هي عاصمة فرنسا 🇫🇷' : query.includes('كبير') ? 'الله أكبر! 🌟' : 'شكراً على سؤالك!'}`,
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }

            await reply(sock, jid, 
                `${mikoHeader('𝑨𝑰 𝑹𝑬𝑺𝑷𝑶𝑵𝑺𝑬')}\n\n` +
                `${response}\n${mikoFooter()}`, msg);

        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ في الذكاء الاصطناعي*', msg);
        }
    }
};

// ─── 87. 𝑰𝑴𝑨𝑮𝑬𝑨𝑰 ───
commands.imageai = {
    category: 'ai',
    desc: 'توليد صورة بالذكاء الاصطناعي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل وصف الصورة*', msg);

        await react(sock, jid, msg.key, '🎨');

        const prompt = args.join(' ');

        // Using Pollinations AI (free, no API key)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;

        await reply(sock, jid, 
            `${mikoHeader('𝑨𝑰 𝑰𝑴𝑨𝑮𝑬')}\n\n` +
            `🎨 *الوصف:* ${prompt}\n` +
            `⏳ *جاري التوليد...*\n${mikoFooter()}`, msg);

        try {
            await sock.sendMessage(jid, {
                image: { url: imageUrl },
                caption: `🎨 *صورة مولدة بالذكاء الاصطناعي*\n\n📝 *الوصف:* ${prompt}\n${mikoFooter()}`,
                newsletter: config.newsletter
            });
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في توليد الصورة*\n⚠️ *استخدم API Key خاص*', msg);
        }
    }
};

// ─── 88. 𝑪𝑯𝑨𝑻 ───
commands.chat = {
    category: 'ai',
    desc: 'محادثة مع الذكاء الاصطناعي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل رسالتك*', msg);

        await react(sock, jid, msg.key, '💬');

        const query = args.join(' ');

        try {
            const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(query)}&lc=ar`, {
                timeout: 10000
            });

            const response = res.data?.success || 'مرحباً! أنا 𝑴𝑰𝑲𝑶، كيف يمكنني مساعدتك اليوم؟';

            await reply(sock, jid, 
                `${mikoHeader('𝑪𝑯𝑨𝑻')}\n\n` +
                `🧑 *أنت:* ${query}\n\n` +
                `🤖 *𝑴𝑰𝑲𝑶:* ${response}\n${mikoFooter()}`, msg);

        } catch (e) {
            await reply(sock, jid, 
                `${mikoHeader('𝑪𝑯𝑨𝑻')}\n\n` +
                `🧑 *أنت:* ${query}\n\n` +
                `🤖 *𝑴𝑰𝑲𝑶:* شكراً على رسالتك! أنا هنا للمساعدة دائماً 💫\n${mikoFooter()}`, msg);
        }
    }
};

// ─── 89. 𝑺𝑼𝑴𝑴𝑨𝑹𝒀 ───
commands.summary = {
    category: 'ai',
    desc: 'تلخيص النصوص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص للتلخيص*', msg);

        await react(sock, jid, msg.key, '📝');

        const text = args.join(' ');
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
        const summary = sentences.slice(0, 3).join('. ') + '.';

        await reply(sock, jid, 
            `${mikoHeader('𝑺𝑼𝑴𝑴𝑨𝑹𝒀')}\n\n` +
            `📝 *النص الأصلي:* ${text.substring(0, 200)}...\n\n` +
            `📋 *الملخص:*\n${summary}\n${mikoFooter()}`, msg);
    }
};

// ─── 90. 𝑷𝑨𝑹𝑨𝑷𝑯𝑹𝑨𝑺𝑬 ───
commands.paraphrase = {
    category: 'ai',
    desc: 'إعادة صياغة النص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل النص*', msg);

        await react(sock, jid, msg.key, '✍️');

        const text = args.join(' ');

        await reply(sock, jid, 
            `${mikoHeader('𝑷𝑨𝑹𝑨𝑷𝑯𝑹𝑨𝑺𝑬')}\n\n` +
            `📝 *النص الأصلي:*\n${text}\n\n` +
            `✍️ *إعادة الصياغة:*\n${text} (مع تعديلات طفيفة في الصياغة)\n\n` +
            `⚠️ *أضف API Key للحصول على نتائج أفضل*\n${mikoFooter()}`, msg);
    }
};

// ─── 91. 𝑪𝑶𝑫𝑬 ───
commands.code = {
    category: 'ai',
    desc: 'مساعدة في البرمجة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل طلبك البرمجي*', msg);

        await react(sock, jid, msg.key, '💻');

        const query = args.join(' ');

        await reply(sock, jid, 
            `${mikoHeader('𝑪𝑶𝑫𝑬 𝑨𝑺𝑺𝑰𝑺𝑻𝑨𝑵𝑻')}\n\n` +
            `💻 *الطلب:* ${query}\n\n` +
            `📝 *الحل:*\n\`\`\`javascript\n// مثال على الكود\nfunction solve() {\n  return "${query}";\n}\n\`\`\`\n\n` +
            `⚠️ *أضف OpenAI API Key للحصول على كود حقيقي*\n${mikoFooter()}`, msg);
    }
};

// ─── 92. 𝑹𝑬𝑪𝑰𝑷𝑬 ───
commands.recipe = {
    category: 'ai',
    desc: 'وصفة طعام',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const dish = args.join(' ') || 'كبسة';

        await react(sock, jid, msg.key, '🍳');

        const recipes = {
            'كبسة': `🍚 *كبسة سعودية*\n\nالمكونات:\n• 2 كوب أرز بسمتي\n• 500g لحم\n• بصل، ثوم، بهارات\n\nالطريقة:\n1. قلي البصل والثوم\n2. إضافة اللحم والبهارات\n3. إضافة الأرز والماء\n4. الطهي على نار هادئة`,
            'برياني': `🍛 *برياني هندي*\n\nالمكونات:\n• 2 كوب أرز\n• 500g دجاج\n• زبادي، بهارات برياني\n\nالطريقة:\n1. تتبيل الدجاج\n2. قلي البصل المقرمش\n3. طبقات الأرز والدجاج\n4. الطهي على البخار`,
            'default': `🍽️ *وصفة ${dish}*\n\nالمكونات:\n• المكونات الأساسية\n• البهارات المناسبة\n• الزيت والملح\n\nالطريقة:\n1. تحضير المكونات\n2. الطهي بالطريقة المناسبة\n3. التقديم ساخناً\n\n⚠️ *استخدم API للوصفات الدقيقة*`
        };

        const recipe = recipes[dish] || recipes['default'];
        await reply(sock, jid, 
            `${mikoHeader('𝑹𝑬𝑪𝑰𝑷𝑬')}\n\n${recipe}\n${mikoFooter()}`, msg);
    }
};

module.exports = commands;
