// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑭𝑼𝑵 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (61-75)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { 
    mikoHeader, mikoFooter, reply, react, sendMedia, 
    sendInteractiveButtons, fetchJson, pickRandom, randomImage 
} = require('../lib/helpers');

const commands = {};

// ─── 61. 𝑴𝑬𝑴𝑬 ───
commands.meme = {
    category: 'fun',
    desc: 'ميم عشوائي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        await react(sock, jid, msg.key, '😂');

        try {
            const data = await fetchJson('https://meme-api.com/gimme');
            if (data && data.url) {
                await sendMedia(sock, jid, 'image', data.url, 
                    `😂 *${data.title}*\n👤 r/${data.subreddit}\n👍 ${data.ups}\n${mikoFooter()}`);
            } else {
                await reply(sock, jid, '😂 *جاري البحث عن ميم...*\n⚠️ *جرب مرة أخرى*', msg);
            }
        } catch (e) {
            await reply(sock, jid, '😂 *جاري البحث عن ميم...*', msg);
        }
    }
};

// ─── 62. 𝑱𝑶𝑲𝑬 ───
commands.joke = {
    category: 'fun',
    desc: 'نكتة عشوائية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const jokes = [
            "😂 *واحد قال لصاحبه:*\n- ليه مش بتجيب عربية؟\n- قاله: عشان مش عارف أسوق!\n- قاله: يا عم خدها وقعد فيها!",
            "🤣 *واحد راح للدكتور:*\n- يا دكتور أنا بحلم إني بقى طيارة!\n- الدكتور: طيب متنام على السرير!\n- قاله: لأ يا دكتور، أنا خايف أطير!",
            "😅 *واحد سأل صاحبه:*\n- إنت ليه بتلبس نظارة سودا؟\n- قاله: عشان العالم مظلم!",
            "🤪 *واحد دخل محل:*\n- عندكم تلاجة؟\n- آه!\n- طيب حطوا فيها شوية فاكهة!",
            "😆 *واحد قال لمراته:*\n- أنا هسافر!\n- قالتله: خدني معاك!\n- قالها: لا، المكان خطر!\n- قالتله: طيب خد أمك!",
            "🤭 *واحد راح يشتري سمك:*\n- السمك ده طازة؟\n- آه طبعاً!\n- طيب ليه عينه مفتوحة؟\n- عشان شافك!",
            "😄 *واحد سأل تاني:*\n- إنت بتشتغل إيه؟\n- أنا بشتغل نجار!\n- طيب ليه مش بتنجر؟",
            "🙃 *واحد قال لصاحبه:*\n- أنا بحبك!\n- قاله: أنا كمان!\n- لا، أنا بحبك زي أخويا!",
            "😁 *واحد دخل مطعم:*\n- عندكم فراخ مشوية؟\n- آه!\n- طيب خليها تروح تتشمس!",
            "🤡 *واحد قال لصاحبه:*\n- إنت ليه دايماً متأخر؟\n- قاله: عشان الساعة بتيجي متأخرة!"
        ];
        await reply(sock, jid, pickRandom(jokes), msg);
    }
};

// ─── 63. 𝑫𝑨𝑹𝑬 ───
commands.dare = {
    category: 'fun',
    desc: 'تحدي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const dares = [
            "🔥 *تحدي:*\nأرسل رسالة لآخر شخص كلمته تقوله "أنا بحبك"!",
            "💪 *تحدي:*\nغيّر صورتك الشخصية لمدة ساعة!",
            "😎 *تحدي:*\nاكتب اسمك بالعكس 10 مرات!",
            "🎯 *تحدي:*\nلا تستخدم هاتفك لمدة 30 دقيقة!",
            "🌟 *تحدي:*\nأرسل صورة غريبة في الحالة!",
            "🔮 *تحدي:*\nاتصل بأول شخص في جهات الاتصال وغنِّ له!",
            "🎭 *تحدي:*\nاكتب كل رسالتك القادمة بالعكس!",
            "⚡ *تحدي:*\nلا تتكلم لمدة 10 دقائق!",
            "🎪 *تحدي:*\nارقص أمام المرآة وصوّر!",
            "🎲 *تحدي:*\nأرسل "أنا غبي" لآخر مجموعة!"
        ];
        await reply(sock, jid, pickRandom(dares), msg);
    }
};

// ─── 64. 𝑻𝑹𝑼𝑻𝑯 ───
commands.truth = {
    category: 'fun',
    desc: 'سؤال صريح',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const truths = [
            "🤔 *سؤال صريح:*\nما هو أكثر شيء ندمت عليه في حياتك؟",
            "💭 *سؤال صريح:*\nما هو سرك الأكبر؟",
            "🌟 *سؤال صريح:*\nمن الشخص الذي تكرهه أكثر؟",
            "💔 *سؤال صريح:*\nهل خانك أحد من قبل؟",
            "😳 *سؤال صريح:*\nما هو أغرب حلم رأيته؟",
            "🎭 *سؤال صريح:*\nهل كذبت على أهلك من قبل؟",
            "💰 *سؤال صريح:*\nكم مرة سرقت شيئاً؟",
            "💕 *سؤال صريح:*\nمن كان حبك الأول؟",
            "😅 *سؤال صريح:*\nما هو أكثر موقف محرج حصل لك؟",
            "🤫 *سؤال صريح:*\nهل لديك حساب وهمي؟"
        ];
        await reply(sock, jid, pickRandom(truths), msg);
    }
};

// ─── 65. 𝑹𝑶𝑨𝑺𝑻 ───
commands.roast = {
    category: 'fun',
    desc: 'تنمر لطيف',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const roasts = [
            "🔥 *تنمر لطيف:*\nأنت مثل الواي فاي العام... الكل يتصل بس محدش بيدفع!",
            "⚡ *تنمر لطيف:*\nذكائك مثل البطارية... ينفذ بسرعة!",
            "😂 *تنمر لطيف:*\nأنت مثل الصورة المشوشة... محدش فاهمك!",
            "💀 *تنمر لطيف:*\nوجهك مثل خريطة... فيها طرق وعرة!",
            "🎯 *تنمر لطيف:*\nأنت مثل الإعلان... الكل يتخطاك!",
            "🌚 *تنمر لطيف:*\nنظرتك مثل الكاميرا الأمامية... تخوف!",
            "😆 *تنمر لطيف:*\nأنت مثل الملف المضغوط... محدش يقدر يفهمك!",
            "🤡 *تنمر لطيف:*\nأسلوبك مثل النكت القديمة... محدش يضحك!",
            "💫 *تنمر لطيف:*\nأنت مثل التطبيق المجاني... فيه إعلانات كتير!",
            "🎪 *تنمر لطيف:*\nحظك مثل الطابور... دايماً طويل!"
        ];
        await reply(sock, jid, pickRandom(roasts), msg);
    }
};

// ─── 66. 𝑪𝑶𝑴𝑷𝑳𝑰𝑴𝑬𝑵𝑻 ───
commands.compliment = {
    category: 'fun',
    desc: 'مديح',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const compliments = [
            "🌟 *مديح:*\nأنت نجم يضيء في سماء الحياة!",
            "💖 *مديح:*\nابتسامتك تساوي مليون دولار!",
            "✨ *مديح:*\nأنت شخص رائع بكل معنى الكلمة!",
            "🌸 *مديح:*\nقلبك أجمل من أي وردة!",
            "💎 *مديح:*\nأنت كنز نادر في هذا العالم!",
            "🌙 *مديح:*\nوجودك يجعل العالم أجمل!",
            "🔥 *مديح:*\nأنت مصدر إلهام للجميع!",
            "💫 *مديح:*\nذكائك يفوق الخيال!",
            "🌺 *مديح:*\nأنت أفضل ما حدث لنا!",
            "⭐ *مديح:*\nأنت بطل في عيون الجميع!"
        ];
        await reply(sock, jid, pickRandom(compliments), msg);
    }
};

// ─── 67. 𝑷𝑰𝑪𝑲𝑼𝑷 ───
commands.pickup = {
    category: 'fun',
    desc: 'كلام معسول',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const lines = [
            "💘 *كلام معسول:*\nهل أنت خريطة؟ لأني ضعت في عيونك!",
            "💖 *كلام معسول:*\nهل أنت شمس؟ لأنك تضيء حياتي!",
            "💕 *كلام معسول:*\nهل أنت واي فاي؟ لأني متصل بك!",
            "💗 *كلام معسول:*\nهل أنت قمر؟ لأنك تسحرني!",
            "💝 *كلام معسول:*\nهل أنت مفتاح؟ لأنك فتحت قلبي!",
            "💞 *كلام معسول:*\nهل أنت نجمة؟ لأني أتمنى عليك!",
            "💓 *كلام معسول:*\nهل أنت قهوة؟ لأنك تفوقني!",
            "💟 *كلام معسول:*\nهل أنت موسيقى؟ لأنك تنسيني العالم!",
            "❤️ *كلام معسول:*\nهل أنت كتاب؟ لأني لا أمل من قراءتك!",
            "💜 *كلام معسول:*\nهل أنت حلم؟ لأني لا أريد الاستيقاظ!"
        ];
        await reply(sock, jid, pickRandom(lines), msg);
    }
};

// ─── 68. 𝑺𝑯𝑰𝑷 ───
commands.ship = {
    category: 'fun',
    desc: 'نسبة التوافق',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;

        let person1, person2;
        if (mentioned && mentioned.length >= 2) {
            person1 = mentioned[0];
            person2 = mentioned[1];
        } else if (args.length >= 2) {
            person1 = args[0].includes('@') ? args[0] + '@s.whatsapp.net' : args[0];
            person2 = args[1].includes('@') ? args[1] + '@s.whatsapp.net' : args[1];
        } else {
            return await reply(sock, jid, '❌ *منشن شخصين*\nمثال: .ship @user1 @user2', msg);
        }

        const percentage = Math.floor(Math.random() * 101);
        let emoji = percentage >= 80 ? '💕' : percentage >= 50 ? '💛' : percentage >= 30 ? '💔' : '☠️';
        let comment = percentage >= 80 ? 'زواج قريب! 💍' : percentage >= 50 ? 'فيه أمل! 🌟' : percentage >= 30 ? 'صعب شوي! 😅' : 'انسى الموضوع! 💀';

        const text = `${mikoHeader('𝑺𝑯𝑰𝑷 𝑹𝑨𝑻𝑬')}\n\n` +
            `💑 @${person1.split('@')[0]} + @${person2.split('@')[0]}\n\n` +
            `${emoji} *التوافق:* ${percentage}%\n` +
            `📊 ${'█'.repeat(Math.floor(percentage/10))}${'░'.repeat(10-Math.floor(percentage/10))}\n\n` +
            `💬 *التعليق:* ${comment}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 69. 𝑮𝑨𝒀 ───
commands.gay = {
    category: 'fun',
    desc: 'نسبة المثلية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        let target = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned[0]) target = mentioned[0];

        const percentage = Math.floor(Math.random() * 101);
        const text = `${mikoHeader('𝑮𝑨𝒀 𝑹𝑨𝑻𝑬')}\n\n` +
            `🏳️‍🌈 @${target.split('@')[0]}\n` +
            `📊 *النسبة:* ${percentage}%\n` +
            `${'█'.repeat(Math.floor(percentage/10))}${'░'.repeat(10-Math.floor(percentage/10))}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 70. 𝑺𝑰𝑴𝑷 ───
commands.simp = {
    category: 'fun',
    desc: 'نسبة السمب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        let target = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned[0]) target = mentioned[0];

        const percentage = Math.floor(Math.random() * 101);
        const text = `${mikoHeader('𝑺𝑰𝑴𝑷 𝑹𝑨𝑻𝑬')}\n\n` +
            `🥺 @${target.split('@')[0]}\n` +
            `📊 *نسبة السمب:* ${percentage}%\n` +
            `${'█'.repeat(Math.floor(percentage/10))}${'░'.repeat(10-Math.floor(percentage/10))}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 71. 𝑯𝑶𝑹𝑵𝒀 ───
commands.horny = {
    category: 'fun',
    desc: 'نسبة الشهوة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        let target = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned[0]) target = mentioned[0];

        const percentage = Math.floor(Math.random() * 101);
        const text = `${mikoHeader('𝑯𝑶𝑹𝑵𝒀 𝑹𝑨𝑻𝑬')}\n\n` +
            `🔥 @${target.split('@')[0]}\n` +
            `📊 *النسبة:* ${percentage}%\n` +
            `${'█'.repeat(Math.floor(percentage/10))}${'░'.repeat(10-Math.floor(percentage/10))}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 72. 𝑰𝑸 ───
commands.iq = {
    category: 'fun',
    desc: 'نسبة الذكاء',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        let target = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned[0]) target = mentioned[0];

        const iq = Math.floor(Math.random() * 200);
        const text = `${mikoHeader('𝑰𝑸 𝑻𝑬𝑺𝑻')}\n\n` +
            `🧠 @${target.split('@')[0]}\n` +
            `📊 *نسبة الذكاء:* ${iq}\n` +
            `${'█'.repeat(Math.floor(iq/20))}${'░'.repeat(10-Math.floor(iq/20))}\n` +
            `💡 *التقييم:* ${iq >= 130 ? 'عبقري! 🌟' : iq >= 100 ? 'ذكي! 💪' : iq >= 70 ? 'متوسط! 😊' : 'يحتاج مساعدة! 😅'}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 73. 𝑩𝑬𝑨𝑼𝑻𝒀 ───
commands.beauty = {
    category: 'fun',
    desc: 'نسبة الجمال',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        let target = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned[0]) target = mentioned[0];

        const percentage = Math.floor(Math.random() * 101);
        const text = `${mikoHeader('𝑩𝑬𝑨𝑼𝑻𝒀 𝑹𝑨𝑻𝑬')}\n\n` +
            `💄 @${target.split('@')[0]}\n` +
            `📊 *نسبة الجمال:* ${percentage}%\n` +
            `${'█'.repeat(Math.floor(percentage/10))}${'░'.repeat(10-Math.floor(percentage/10))}\n` +
            `💕 *التقييم:* ${percentage >= 80 ? 'ملاك! 😇' : percentage >= 50 ? 'جميل! 🌸' : 'محتاج فلتر! 📸'}\n${mikoFooter()}`;

        await reply(sock, jid, text, msg);
    }
};

// ─── 74. 𝑳𝑶𝑽𝑬 ───
commands.love = {
    category: 'fun',
    desc: 'رسالة حب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        let target = mentioned && mentioned[0] ? mentioned[0] : args[0] ? args[0] + '@s.whatsapp.net' : null;

        if (!target) return await reply(sock, jid, '❌ *منشن شخص*', msg);

        const messages = [
            "💕 أنت نبض قلبي وروحي!",
            "💖 أحبك أكثر من الكلمات!",
            "💗 أنت حلمي الذي تحقق!",
            "💝 قلبي ينبض باسمك!",
            "💞 أنت نور حياتي!",
            "💓 أحبك إلى الأبد!",
            "❤️ أنت كل شيء لي!",
            "💟 أنت سعادتي!",
            "💜 أحبك بجنون!",
            "🤍 أنت روحي!"
        ];

        await reply(sock, jid, `💕 @${target.split('@')[0]}\n\n${pickRandom(messages)}`, msg);
    }
};

// ─── 75. 𝑯𝑼𝑮 ───
commands.hug = {
    category: 'fun',
    desc: 'عناق',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        let target = mentioned && mentioned[0] ? mentioned[0] : args[0] ? args[0] + '@s.whatsapp.net' : null;

        if (!target) return await reply(sock, jid, '❌ *منشن شخص*', msg);

        const gifs = [
            'https://media.giphy.com/media/od5H3PmEG5lM7fXqyX/giphy.gif',
            'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif',
            'https://media.giphy.com/media/3bqtLDeixTiQ2T4QoA/giphy.gif'
        ];

        await sendMedia(sock, jid, 'video', pickRandom(gifs), 
            `🤗 @${msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0]} يعانق @${target.split('@')[0]}!\n${mikoFooter()}`);
    }
};

module.exports = commands;
