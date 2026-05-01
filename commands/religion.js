// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑹𝑬𝑳𝑰𝑮𝑰𝑶𝑵 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (93-97)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { mikoHeader, mikoFooter, reply, react, fetchJson } = require('../lib/helpers');

const commands = {};

// ─── 93. 𝑸𝑼𝑹𝑨𝑵 ───
commands.quran = {
    category: 'religion',
    desc: 'قراءة آية من القرآن',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const surah = args[0] || Math.floor(Math.random() * 114) + 1;
        const ayah = args[1] || 1;

        await react(sock, jid, msg.key, '🕌');

        try {
            const data = await fetchJson(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.asad`);

            if (data && data.data) {
                const text = `${mikoHeader('𝑸𝑼𝑹𝑨𝑵 𝑲𝑨𝑹𝑰𝑴')}\n\n` +
                    `📖 *سورة:* ${data.data.surah.name} (${data.data.surah.englishName})\n` +
                    `🔢 *الآية:* ${data.data.numberInSurah}\n` +
                    `📜 *الجزء:* ${data.data.juz}\n\n` +
                    `🕋 *${data.data.text}*\n\n` +
                    `📋 *التفسير:* ${data.data.surah.englishNameTranslation}\n${mikoFooter()}`;

                await reply(sock, jid, text, msg);
            } else {
                throw new Error('No data');
            }
        } catch (e) {
            // Fallback with sample verses
            const verses = [
                { surah: 'الفاتحة', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', meaning: 'بسم الله الرحمن الرحيم' },
                { surah: 'البقرة', text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', meaning: 'الله لا إله إلا هو الحي القيوم' },
                { surah: 'الإخلاص', text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', meaning: 'قل هو الله أحد' },
                { surah: 'الفلق', text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', meaning: 'قل أعوذ برب الفلق' },
                { surah: 'الناس', text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', meaning: 'قل أعوذ برب الناس' }
            ];

            const verse = verses[Math.floor(Math.random() * verses.length)];
            await reply(sock, jid, 
                `${mikoHeader('𝑸𝑼𝑹𝑨𝑵 𝑲𝑨𝑹𝑰𝑴')}\n\n` +
                `📖 *سورة:* ${verse.surah}\n\n` +
                `🕋 *${verse.text}*\n\n` +
                `💫 *المعنى:* ${verse.meaning}\n${mikoFooter()}`, msg);
        }
    }
};

// ─── 94. 𝑨𝒁𝑨𝑵 ───
commands.azan = {
    category: 'religion',
    desc: 'مواقيت الأذان',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const city = args.join(' ') || 'Mecca';

        await react(sock, jid, msg.key, '🕌');

        try {
            const data = await fetchJson(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=SA&method=4`);

            if (data && data.data) {
                const timings = data.data.timings;
                const text = `${mikoHeader('𝑨𝒁𝑨𝑵 𝑻𝑰𝑴𝑬𝑺')}\n\n` +
                    `🌍 *المدينة:* ${city}\n` +
                    `📅 *التاريخ:* ${data.data.date.readable}\n\n` +
                    `🌅 *الفجر:* ${timings.Fajr}\n` +
                    `☀️ *الشروق:* ${timings.Sunrise}\n` +
                    `🌞 *الظهر:* ${timings.Dhuhr}\n` +
                    `🌤️ *العصر:* ${timings.Asr}\n` +
                    `🌇 *المغرب:* ${timings.Maghrib}\n` +
                    `🌙 *العشاء:* ${timings.Isha}\n${mikoFooter()}`;

                await reply(sock, jid, text, msg);
            } else {
                throw new Error('No data');
            }
        } catch (e) {
            await reply(sock, jid, 
                `${mikoHeader('𝑨𝒁𝑨𝑵 𝑻𝑰𝑴𝑬𝑺')}\n\n` +
                `🌍 *المدينة:* ${city}\n\n` +
                `🌅 *الفجر:* 04:30\n` +
                `☀️ *الشروق:* 05:50\n` +
                `🌞 *الظهر:* 12:15\n` +
                `🌤️ *العصر:* 15:30\n` +
                `🌇 *المغرب:* 18:45\n` +
                `🌙 *العشاء:* 20:15\n\n` +
                `⚠️ *استخدم API للبيانات الدقيقة*\n${mikoFooter()}`, msg);
        }
    }
};

// ─── 95. 𝑯𝑨𝑫𝑰𝑻𝑯 ───
commands.hadith = {
    category: 'religion',
    desc: 'حديث شريف',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        await react(sock, jid, msg.key, '📿');

        const hadiths = [
            { text: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', narrator: 'البخاري ومسلم', meaning: 'إنما الأعمال بالنيات' },
            { text: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ', narrator: 'البخاري', meaning: 'من يرد الله به خيراً يفقهه في الدين' },
            { text: 'لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', narrator: 'البخاري ومسلم', meaning: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه' },
            { text: 'الدِّينُ النَّصِيحَةُ', narrator: 'مسلم', meaning: 'الدين النصيحة' },
            { text: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', narrator: 'البخاري ومسلم', meaning: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت' },
            { text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', narrator: 'البخاري', meaning: 'خيركم من تعلم القرآن وعلمه' },
            { text: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', narrator: 'مسلم', meaning: 'من سلك طريقاً يلتمس فيه علماً سهل الله له طريقاً إلى الجنة' },
            { text: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', narrator: 'ابن ماجه', meaning: 'طلب العلم فريضة على كل مسلم' }
        ];

        const hadith = hadiths[Math.floor(Math.random() * hadiths.length)];

        await reply(sock, jid, 
            `${mikoHeader('𝑯𝑨𝑫𝑰𝑻𝑯 𝑺𝑯𝑨𝑹𝑰𝑭')}\n\n` +
            `📿 *الحديث:*\n${hadith.text}\n\n` +
            `💫 *المعنى:* ${hadith.meaning}\n\n` +
            `📖 *الراوي:* ${hadith.narrator}\n${mikoFooter()}`, msg);
    }
};

// ─── 96. 𝑫𝑼𝑨 ───
commands.dua = {
    category: 'religion',
    desc: 'دعاء',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        await react(sock, jid, msg.key, '🤲');

        const duas = [
            { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', meaning: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار' },
            { text: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', meaning: 'رب اشرح لي صدري ويسر لي أمري' },
            { text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', meaning: 'حسبنا الله ونعم الوكيل' },
            { text: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', meaning: 'لا إله إلا أنت سبحانك إني كنت من الظالمين' },
            { text: 'رَبِّ زِدْنِي عِلْمًا', meaning: 'رب زدني علماً' },
            { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا', meaning: 'اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً' },
            { text: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ', meaning: 'اللهم اجعلني من التوابين واجعلني من المتطهرين' },
            { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', meaning: 'سبحان الله وبحمده سبحان الله العظيم' }
        ];

        const dua = duas[Math.floor(Math.random() * duas.length)];

        await reply(sock, jid, 
            `${mikoHeader('𝑫𝑼𝑨')}\n\n` +
            `🤲 *الدعاء:*\n${dua.text}\n\n` +
            `💫 *المعنى:* ${dua.meaning}\n${mikoFooter()}`, msg);
    }
};

// ─── 97. 𝑻𝑨𝑺𝑩𝑰𝑯 ───
commands.tasbih = {
    category: 'religion',
    desc: 'سبحة إلكترونية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!global.tasbihCounts) global.tasbihCounts = {};
        if (!global.tasbihCounts[sender]) global.tasbihCounts[sender] = 0;

        const action = args[0]?.toLowerCase();

        if (action === 'reset') {
            global.tasbihCounts[sender] = 0;
            await reply(sock, jid, '📿 *تم إعادة العداد*', msg);
        } else if (action === 'count') {
            await reply(sock, jid, 
                `${mikoHeader('𝑻𝑨𝑺𝑩𝑰𝑯')}\n\n` +
                `📿 *العدد:* ${global.tasbihCounts[sender]}\n` +
                `🎯 *الهدف:* 33\n` +
                `📊 ${'█'.repeat(Math.floor(global.tasbihCounts[sender]/3.3))}${'░'.repeat(10-Math.floor(global.tasbihCounts[sender]/3.3))}\n${mikoFooter()}`, msg);
        } else {
            global.tasbihCounts[sender]++;
            const count = global.tasbihCounts[sender];
            const dhikr = count % 3 === 1 ? 'سبحان الله' : count % 3 === 2 ? 'الحمد لله' : 'الله أكبر';

            await reply(sock, jid, 
                `${mikoHeader('𝑻𝑨𝑺𝑩𝑰𝑯')}\n\n` +
                `📿 *${dhikr}*\n` +
                `🔢 *العدد:* ${count}\n` +
                `🎯 *الهدف:* 33\n` +
                `📊 ${'█'.repeat(Math.floor(count/3.3))}${'░'.repeat(10-Math.floor(count/3.3))}\n${mikoFooter()}`, msg);
        }
    }
};

module.exports = commands;
