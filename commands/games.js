// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑮𝑨𝑴𝑬𝑺 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (76-85)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { mikoHeader, mikoFooter, reply, react, pickRandom } = require('../lib/helpers');

// Game state storage
const gameStates = {};

const commands = {};

// ─── 76. 𝑻𝑰𝑪𝑻𝑨𝑪𝑻𝑶𝑬 ───
commands.tictactoe = commands.ttt = {
    category: 'games',
    desc: 'لعبة إكس أو',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentioned || !mentioned[0]) {
            return await reply(sock, jid, '❌ *منشن خصمك*\nمثال: .ttt @user', msg);
        }

        const player1 = msg.key.participant || msg.key.remoteJid;
        const player2 = mentioned[0];
        const gameId = `${jid}_${Date.now()}`;

        gameStates[gameId] = {
            board: ['1','2','3','4','5','6','7','8','9'],
            currentPlayer: player1,
            player1, player2,
            symbol1: '❌', symbol2: '⭕'
        };

        const renderBoard = (board) => {
            return `\n${board[0]} | ${board[1]} | ${board[2]}\n━━━╋━━━╋━━━\n${board[3]} | ${board[4]} | ${board[5]}\n━━━╋━━━╋━━━\n${board[6]} | ${board[7]} | ${board[8]}`;
        };

        await reply(sock, jid, 
            `${mikoHeader('𝑻𝑰𝑪 𝑻𝑨𝑪 𝑻𝑶𝑬')}\n\n` +
            `❌ @${player1.split('@')[0]} vs ⭕ @${player2.split('@')[0]}\n` +
            `🎮 دور: @${player1.split('@')[0]}\n` +
            `${renderBoard(gameStates[gameId].board)}\n\n` +
            `📌 *أرسل رقم (1-9)*\n${mikoFooter()}`, msg);

        // Store active game
        if (!global.activeGames) global.activeGames = {};
        global.activeGames[jid] = gameId;
    }
};

// ─── 77. 𝑹𝑷𝑺 ───
commands.rps = {
    category: 'games',
    desc: 'حجر ورقة مقص',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const choices = ['حجر 🪨', 'ورقة 📄', 'مقص ✂️'];
        const emojis = { 'حجر 🪨': '🪨', 'ورقة 📄': '📄', 'مقص ✂️': '✂️' };

        const userChoice = args[0];
        if (!userChoice || !['حجر', 'ورقة', 'مقص'].includes(userChoice)) {
            return await reply(sock, jid, '📌 *اختر:* حجر / ورقة / مقص', msg);
        }

        const botChoice = pickRandom(choices);
        const userFull = choices.find(c => c.includes(userChoice));

        let result;
        if (userFull === botChoice) result = '🤝 تعادل!';
        else if (
            (userFull === 'حجر 🪨' && botChoice === 'مقص ✂️') ||
            (userFull === 'ورقة 📄' && botChoice === 'حجر 🪨') ||
            (userFull === 'مقص ✂️' && botChoice === 'ورقة 📄')
        ) result = '🎉 فزت!';
        else result = '😢 خسرت!';

        await reply(sock, jid, 
            `${mikoHeader('𝑹𝑶𝑪𝑲 𝑷𝑨𝑷𝑬𝑹 𝑺𝑪𝑰𝑺𝑺𝑶𝑹𝑺')}\n\n` +
            `🧑 *أنت:* ${userFull}\n` +
            `🤖 *𝑴𝑰𝑲𝑶:* ${botChoice}\n\n` +
            `🏆 *النتيجة:* ${result}\n${mikoFooter()}`, msg);
    }
};

// ─── 78. 𝑮𝑼𝑬𝑺𝑺 ───
commands.guess = {
    category: 'games',
    desc: 'خمن الرقم',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!global.guessGames) global.guessGames = {};

        if (!args.length) {
            // Start new game
            global.guessGames[sender] = Math.floor(Math.random() * 100) + 1;
            return await reply(sock, jid, 
                `${mikoHeader('𝑮𝑼𝑬𝑺𝑺 𝑻𝑯𝑬 𝑵𝑼𝑴𝑩𝑬𝑹')}\n\n` +
                `🎯 *لقد اخترت رقم بين 1 و 100!*\n` +
                `📝 *أرسل رقمك للتخمين*\n` +
                `💡 *مثال:* .guess 50\n${mikoFooter()}`, msg);
        }

        if (!global.guessGames[sender]) {
            return await reply(sock, jid, '❌ *ابدأ لعبة جديدة:* .guess', msg);
        }

        const guess = parseInt(args[0]);
        const target = global.guessGames[sender];

        if (guess === target) {
            delete global.guessGames[sender];
            await reply(sock, jid, 
                `${mikoHeader('🎉 𝑪𝑶𝑵𝑮𝑹𝑨𝑻𝑼𝑳𝑨𝑻𝑰𝑶𝑵𝑺')}\n\n` +
                `🎯 *الرقم كان:* ${target}\n` +
                `🏆 *فزت!*\n${mikoFooter()}`, msg);
        } else if (guess < target) {
            await reply(sock, jid, `📈 *أكبر!*\nحاول مرة أخرى`, msg);
        } else {
            await reply(sock, jid, `📉 *أصغر!*\nحاول مرة أخرى`, msg);
        }
    }
};

// ─── 79. 𝑫𝑰𝑪𝑬 ───
commands.dice = {
    category: 'games',
    desc: 'رمي النرد',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const dice = Math.floor(Math.random() * 6) + 1;
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        await reply(sock, jid, 
            `${mikoHeader('𝑫𝑰𝑪𝑬')}\n\n` +
            `🎲 *الرقم:* ${dice}\n` +
            `${diceEmojis[dice - 1]}\n${mikoFooter()}`, msg);
    }
};

// ─── 80. 𝑪𝑶𝑰𝑵 ───
commands.coin = {
    category: 'games',
    desc: 'رمي العملة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const result = Math.random() < 0.5 ? '👑 وجه' : '📝 كتابة';

        await reply(sock, jid, 
            `${mikoHeader('𝑪𝑶𝑰𝑵 𝑭𝑳𝑰𝑷')}\n\n` +
            `🪙 *النتيجة:* ${result}\n${mikoFooter()}`, msg);
    }
};

// ─── 81. 𝑺𝑳𝑶𝑻 ───
commands.slot = {
    category: 'games',
    desc: 'ماكينة الحظ',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const symbols = ['🍎', '🍊', '🍇', '🍒', '💎', '7️⃣', '⭐', '🍀'];
        const slot1 = pickRandom(symbols);
        const slot2 = pickRandom(symbols);
        const slot3 = pickRandom(symbols);

        let result;
        if (slot1 === slot2 && slot2 === slot3) {
            result = '🎉 𝑱𝑨𝑪𝑲𝑷𝑶𝑻! فزت بالجائزة الكبرى!';
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            result = '💰 فزت بجائزة صغيرة!';
        } else {
            result = '😢 حظ أوفر المرة القادمة!';
        }

        await reply(sock, jid, 
            `${mikoHeader('𝑺𝑳𝑶𝑻 𝑴𝑨𝑪𝑯𝑰𝑵𝑬')}\n\n` +
            `╔═══╗╔═══╗╔═══╗\n` +
            `║ ${slot1} ║║ ${slot2} ║║ ${slot3} ║\n` +
            `╚═══╝╚═══╝╚═══╝\n\n` +
            `🏆 ${result}\n${mikoFooter()}`, msg);
    }
};

// ─── 82. 𝑸𝑼𝑰𝒁 ───
commands.quiz = {
    category: 'games',
    desc: 'سؤال ثقافي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const questions = [
            { q: "ما هي عاصمة اليابان؟", a: "طوكيو" },
            { q: "كم عدد كواكب المجموعة الشمسية؟", a: "8" },
            { q: "ما هو أطول نهر في العالم؟", a: "النيل" },
            { q: "في أي سنة اكتشف أمريكا؟", a: "1492" },
            { q: "ما هو الحيوان الأسرع في العالم؟", a: "الفهد" },
            { q: "كم عدد ألوان قوس قزح؟", a: "7" },
            { q: "ما هي أكبر قارة في العالم؟", a: "آسيا" },
            { q: "من اخترع المصباح الكهربائي؟", a: "إديسون" },
            { q: "كم عدد أيام السنة الكبيسة؟", a: "366" },
            { q: "ما هو أعمق محيط في العالم؟", a: "المحيط الهادئ" }
        ];

        const question = pickRandom(questions);
        await reply(sock, jid, 
            `${mikoHeader('𝑸𝑼𝑰𝒁')}\n\n` +
            `❓ *${question.q}*\n\n` +
            `💡 *الإجابة:* ||${question.a}||\n${mikoFooter()}`, msg);
    }
};

// ─── 83. 𝑻𝑹𝑰𝑽𝑰𝑨 ───
commands.trivia = {
    category: 'games',
    desc: 'معلومة عشوائية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const trivias = [
            "🧠 *هل تعلم؟*\nالعسل هو الطعام الوحيد الذي لا يفسد أبداً!",
            "🌍 *هل تعلم؟*\nالأخطوط لها ثلاثة قلوب!",
            "🐙 *هل تعلم؟*\nالفراشات تتذوق بأرجلها!",
            "🦋 *هل تعلم؟*\nالفيل هو الحيوان الوحيد الذي لا يستطيع القفز!",
            "🐘 *هل تعلم؟*\nلسان الزرافة أزرق اللون!",
            "🦒 *هل تعلم؟*\nالنحلة تنتج ملعقة صغيرة من العسل في حياتها!",
            "🐝 *هل تعلم؟*\nالقرش يستبدل أسنانه باستمرار!",
            "🦈 *هل تعلم؟*\nالصبار يمكنه العيش بدون ماء لسنوات!",
            "🌵 *هل تعلم؟*\nالعقل البشري يحتوي على 86 مليار خلية عصبية!",
            "🧠 *هل تعلم؟*\nالأرض تدور حول نفسها بسرعة 1670 كم/ساعة!"
        ];
        await reply(sock, jid, pickRandom(trivias), msg);
    }
};

// ─── 84. 𝑾𝑶𝑹𝑫𝑺𝑪𝑹𝑨𝑴𝑩𝑳𝑬 ───
commands.wordscramble = {
    category: 'games',
    desc: 'فك تشفير الكلمة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const words = ['ميكو', 'واتساب', 'بوت', 'برمجة', 'ذكاء', 'اصطناعي', 'تقنية', 'مستقبل', 'نجاح', 'سعادة'];
        const word = pickRandom(words);
        const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');

        await reply(sock, jid, 
            `${mikoHeader('𝑾𝑶𝑹𝑫 𝑺𝑪𝑹𝑨𝑴𝑩𝑳𝑬')}\n\n` +
            `🔤 *الكلمة المشفرة:* ${scrambled}\n\n` +
            `💡 *الإجابة:* ||${word}||\n${mikoFooter()}`, msg);
    }
};

// ─── 85. 𝑴𝑨𝑻𝑯 ───
commands.math = {
    category: 'games',
    desc: 'مسألة رياضية',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const ops = ['+', '-', '*'];
        const op = pickRandom(ops);
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = Math.floor(Math.random() * 50) + 1;

        let answer;
        if (op === '+') answer = num1 + num2;
        else if (op === '-') answer = num1 - num2;
        else answer = num1 * num2;

        await reply(sock, jid, 
            `${mikoHeader('𝑴𝑨𝑻𝑯 𝑪𝑯𝑨𝑳𝑳𝑬𝑵𝑮𝑬')}\n\n` +
            `🧮 *ما ناتج:*\n${num1} ${op} ${num2} = ?\n\n` +
            `💡 *الإجابة:* ||${answer}||\n${mikoFooter()}`, msg);
    }
};

module.exports = commands;
