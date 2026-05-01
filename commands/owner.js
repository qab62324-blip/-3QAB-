// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑶𝑾𝑵𝑬𝑹 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (101-105)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { mikoHeader, mikoFooter, reply, react, isDeveloper } = require('../lib/helpers');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const commands = {};

// ─── 101. 𝑩𝑪 ───
commands.bc = commands.broadcast = {
    category: 'owner',
    desc: 'إرسال رسالة للجميع',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isDeveloper(sender)) return await reply(sock, jid, '❌ *للمطورين فقط*', msg);
        if (!args.length) return await reply(sock, jid, '❌ *أدخل الرسالة*', msg);

        await react(sock, jid, msg.key, '📢');

        const message = args.join(' ');
        const text = `${mikoHeader('𝑩𝑹𝑶𝑨𝑫𝑪𝑨𝑺𝑻')}\n\n` +
            `📢 *رسالة من المطور:*\n\n${message}\n${mikoFooter()}`;

        // Get all chats
        const chats = Object.keys(sock.chats || {});
        let sent = 0;

        for (const chat of chats) {
            try {
                await sock.sendMessage(chat, {
                    text: text,
                    newsletter: config.newsletter
                });
                sent++;
            } catch (e) {}
        }

        await reply(sock, jid, `✅ *تم الإرسال لـ ${sent} محادثة*`, msg);
    }
};

// ─── 102. 𝑩𝑪𝑮𝑪 ───
commands.bcgc = {
    category: 'owner',
    desc: 'إرسال رسالة للمجموعات',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isDeveloper(sender)) return await reply(sock, jid, '❌ *للمطورين فقط*', msg);
        if (!args.length) return await reply(sock, jid, '❌ *أدخل الرسالة*', msg);

        await react(sock, jid, msg.key, '📢');

        const message = args.join(' ');
        const text = `${mikoHeader('𝑩𝑹𝑶𝑨𝑫𝑪𝑨𝑺𝑻 𝑮𝑹𝑶𝑼𝑷𝑺')}\n\n` +
            `📢 *رسالة من المطور:*\n\n${message}\n${mikoFooter()}`;

        const chats = Object.keys(sock.chats || {});
        let sent = 0;

        for (const chat of chats) {
            if (chat.endsWith('@g.us')) {
                try {
                    await sock.sendMessage(chat, {
                        text: text,
                        newsletter: config.newsletter
                    });
                    sent++;
                } catch (e) {}
            }
        }

        await reply(sock, jid, `✅ *تم الإرسال لـ ${sent} مجموعة*`, msg);
    }
};

// ─── 103. 𝑺𝑯𝑼𝑻𝑫𝑶𝑾𝑵 ───
commands.shutdown = {
    category: 'owner',
    desc: 'إيقاف البوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isDeveloper(sender)) return await reply(sock, jid, '❌ *للمطورين فقط*', msg);

        await reply(sock, jid, 
            `${mikoHeader('𝑺𝑯𝑼𝑻𝑫𝑶𝑾𝑵')}\n\n` +
            `⚠️ *جاري إيقاف البوت...*\n` +
            `👋 *مع السلامة!*\n${mikoFooter()}`, msg);

        setTimeout(() => process.exit(0), 2000);
    }
};

// ─── 104. 𝑹𝑬𝑺𝑻𝑨𝑹𝑻 ───
commands.restart = {
    category: 'owner',
    desc: 'إعادة تشغيل البوت',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isDeveloper(sender)) return await reply(sock, jid, '❌ *للمطورين فقط*', msg);

        await reply(sock, jid, 
            `${mikoHeader('𝑹𝑬𝑺𝑻𝑨𝑹𝑻')}\n\n` +
            `🔄 *جاري إعادة التشغيل...*\n${mikoFooter()}`, msg);

        setTimeout(() => {
            process.on('exit', () => {
                require('child_process').spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: 'inherit'
                });
            });
            process.exit();
        }, 2000);
    }
};

// ─── 105. 𝑬𝑽𝑨𝑳 ───
commands.eval = {
    category: 'owner',
    desc: 'تنفيذ كود (مطور فقط)',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isDeveloper(sender)) return await reply(sock, jid, '❌ *للمطورين فقط*', msg);
        if (!args.length) return await reply(sock, jid, '❌ *أدخل الكود*', msg);

        await react(sock, jid, msg.key, '⚡');

        try {
            const code = args.join(' ');
            let result = await eval(`(async () => { ${code} })()`);

            if (typeof result === 'object') result = JSON.stringify(result, null, 2);

            const text = `${mikoHeader('𝑬𝑽𝑨𝑳')}\n\n` +
                `💻 *الكود:*\n\`\`\`js\n${code}\n\`\`\`\n\n` +
                `📤 *النتيجة:*\n\`\`\`\n${result}\n\`\`\`\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, 
                `${mikoHeader('𝑬𝑽𝑨𝑳')}\n\n` +
                `❌ *خطأ:* ${e.message}\n${mikoFooter()}`, msg);
        }
    }
};

module.exports = commands;
