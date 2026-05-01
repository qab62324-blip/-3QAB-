// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑻𝑬𝑪𝑯 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (98-100)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { mikoHeader, mikoFooter, reply, react, fetchJson } = require('../lib/helpers');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const commands = {};

// ─── 98. 𝑮𝑰𝑻𝑯𝑼𝑩 ───
commands.github = {
    category: 'tech',
    desc: 'معلومات GitHub',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل اسم المستخدم*\nمثال: .github octocat', msg);

        await react(sock, jid, msg.key, '💻');

        try {
            const username = args[0];
            const data = await fetchJson(`https://api.github.com/users/${username}`);

            if (data && data.login) {
                const text = `${mikoHeader('𝑮𝑰𝑻𝑯𝑼𝑩 𝑷𝑹𝑶𝑭𝑰𝑳𝑬')}\n\n` +
                    `👤 *الاسم:* ${data.name || data.login}\n` +
                    `📝 *المستخدم:* @${data.login}\n` +
                    `📖 *الوصف:* ${data.bio || 'لا يوجد'}\n` +
                    `📍 *الموقع:* ${data.location || 'غير معروف'}\n` +
                    `🔗 *الموقع:* ${data.blog || 'لا يوجد'}\n` +
                    `🏢 *الشركة:* ${data.company || 'لا يوجد'}\n` +
                    `📦 *المستودعات:* ${data.public_repos}\n` +
                    `👥 *المتابعون:* ${data.followers}\n` +
                    `👤 *يتابع:* ${data.following}\n` +
                    `📅 *الانضمام:* ${new Date(data.created_at).toLocaleDateString()}\n${mikoFooter()}`;

                const buttons = [
                    { name: "cta_url", params: { display_text: "🔗╎ زيارة الملف الشخصي", url: data.html_url } },
                    { name: "cta_copy", params: { display_text: "📋╎ نسخ الرابط", copy_code: data.html_url } }
                ];

                await reply(sock, jid, text, msg);
            } else {
                await reply(sock, jid, '❌ *المستخدم غير موجود*', msg);
            }
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 99. 𝑵𝑷𝑴 ───
commands.npm = {
    category: 'tech',
    desc: 'معلومات حزمة NPM',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!args.length) return await reply(sock, jid, '❌ *أدخل اسم الحزمة*\nمثال: .npm express', msg);

        await react(sock, jid, msg.key, '📦');

        try {
            const pkg = args[0];
            const data = await fetchJson(`https://registry.npmjs.org/${pkg}`);

            if (data && data.name) {
                const latest = data['dist-tags'].latest;
                const version = data.versions[latest];

                const text = `${mikoHeader('𝑵𝑷𝑴 𝑷𝑨𝑪𝑲𝑨𝑮𝑬')}\n\n` +
                    `📦 *الاسم:* ${data.name}\n` +
                    `📌 *الإصدار:* ${latest}\n` +
                    `📝 *الوصف:* ${data.description || 'لا يوجد'}\n` +
                    `👤 *المؤلف:* ${version.author?.name || 'غير معروف'}\n` +
                    `📅 *آخر تحديث:* ${new Date(data.time[latest]).toLocaleDateString()}\n` +
                    `🏠 *الصفحة الرئيسية:* ${data.homepage || 'لا يوجد'}\n${mikoFooter()}`;

                const buttons = [
                    { name: "cta_url", params: { display_text: "🔗╎ NPM", url: `https://npmjs.com/package/${pkg}` } },
                    { name: "cta_copy", params: { display_text: "📋╎ نسخ الأمر", copy_code: `npm install ${pkg}` } }
                ];

                await reply(sock, jid, text, msg);
            } else {
                await reply(sock, jid, '❌ *الحزمة غير موجودة*', msg);
            }
        } catch (e) {
            await reply(sock, jid, '❌ *حدث خطأ*', msg);
        }
    }
};

// ─── 100. 𝑪𝑶𝑫𝑬𝑹𝑼𝑵 ───
commands.coderun = {
    category: 'tech',
    desc: 'تشغيل كود JavaScript',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!args.length) return await reply(sock, jid, '❌ *أدخل الكود*\nمثال: .coderun console.log("Hello")', msg);

        await react(sock, jid, msg.key, '⚡');

        try {
            const code = args.join(' ');

            // Security check - block dangerous operations
            const dangerous = ['require(', 'process.exit', 'eval(', 'Function(', 'child_process', 'fs.', 'fs' ];
            if (dangerous.some(d => code.includes(d))) {
                return await reply(sock, jid, '❌ *كود غير آمن محظور*', msg);
            }

            let output = '';
            const originalLog = console.log;
            console.log = (...args) => { output += args.join(' ') + '\n'; };

            const result = eval(code);
            console.log = originalLog;

            const text = `${mikoHeader('𝑪𝑶𝑫𝑬 𝑹𝑼𝑵')}\n\n` +
                `💻 *الكود:*\n\`\`\`js\n${code}\n\`\`\`\n\n` +
                `📤 *النتيجة:*\n\`\`\`\n${output || result || 'undefined'}\n\`\`\`\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, 
                `${mikoHeader('𝑪𝑶𝑫𝑬 𝑹𝑼𝑵')}\n\n` +
                `❌ *خطأ:* ${e.message}\n${mikoFooter()}`, msg);
        }
    }
};

module.exports = commands;
