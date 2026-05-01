// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑮𝑹𝑶𝑼𝑷 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺 (16-30)
// ═══════════════════════════════════════════════════════════

const config = require('../config');
const { 
    mikoHeader, mikoFooter, reply, react, isAdmin, isBotAdmin, 
    getGroupAdmins, sendWithNewsletter 
} = require('../lib/helpers');

const commands = {};

// ─── 16. 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 ───
commands.welcome = {
    category: 'group',
    desc: 'تفعيل/تعطيل الترحيب',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);

        const action = args[0]?.toLowerCase();
        if (action === 'on') {
            config.welcomeMessage = true;
            await reply(sock, jid, '✅ *تم تفعيل الترحيب*', msg);
        } else if (action === 'off') {
            config.welcomeMessage = false;
            await reply(sock, jid, '❌ *تم تعطيل الترحيب*', msg);
        } else {
            await reply(sock, jid, '📌 *الاستخدام:* .welcome on/off', msg);
        }
    }
};

// ─── 17. 𝑮𝑶𝑶𝑫𝑩𝒀𝑬 ───
commands.goodbye = {
    category: 'group',
    desc: 'تفعيل/تعطيل التوديع',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);

        const action = args[0]?.toLowerCase();
        if (action === 'on') {
            config.goodbyeMessage = true;
            await reply(sock, jid, '✅ *تم تفعيل التوديع*', msg);
        } else if (action === 'off') {
            config.goodbyeMessage = false;
            await reply(sock, jid, '❌ *تم تعطيل التوديع*', msg);
        } else {
            await reply(sock, jid, '📌 *الاستخدام:* .goodbye on/off', msg);
        }
    }
};

// ─── 18. 𝑲𝑰𝑪𝑲 ───
commands.kick = {
    category: 'group',
    desc: 'طرد عضو',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        let target = args[0];
        if (!target && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        if (!target) return await reply(sock, jid, '❌ *منشن الشخص أو أدخل الرقم*', msg);

        if (!target.includes('@')) target += '@s.whatsapp.net';

        try {
            await sock.groupParticipantsUpdate(jid, [target], 'remove');
            await reply(sock, jid, `✅ *تم طرد* @${target.split('@')[0]}`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في الطرد*', msg);
        }
    }
};

// ─── 19. 𝑨𝑫𝑫 ───
commands.add = {
    category: 'group',
    desc: 'إضافة عضو',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        let target = args[0];
        if (!target) return await reply(sock, jid, '❌ *أدخل الرقم*', msg);
        if (!target.includes('@')) target += '@s.whatsapp.net';

        try {
            await sock.groupParticipantsUpdate(jid, [target], 'add');
            await reply(sock, jid, `✅ *تمت إضافة* @${target.split('@')[0]}`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في الإضافة*', msg);
        }
    }
};

// ─── 20. 𝑷𝑹𝑶𝑴𝑶𝑻𝑬 ───
commands.promote = {
    category: 'group',
    desc: 'ترقية لعضو',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        let target = args[0];
        if (!target && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        if (!target) return await reply(sock, jid, '❌ *منشن الشخص*', msg);
        if (!target.includes('@')) target += '@s.whatsapp.net';

        try {
            await sock.groupParticipantsUpdate(jid, [target], 'promote');
            await reply(sock, jid, `👑 *تمت ترقية* @${target.split('@')[0]} *لمشرف*`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في الترقية*', msg);
        }
    }
};

// ─── 21. 𝑫𝑬𝑴𝑶𝑻𝑬 ───
commands.demote = {
    category: 'group',
    desc: 'تنزيل مشرف',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        let target = args[0];
        if (!target && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        if (!target) return await reply(sock, jid, '❌ *منشن الشخص*', msg);
        if (!target.includes('@')) target += '@s.whatsapp.net';

        try {
            await sock.groupParticipantsUpdate(jid, [target], 'demote');
            await reply(sock, jid, `⬇️ *تم تنزيل* @${target.split('@')[0]} *من الإشراف*`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في التنزيل*', msg);
        }
    }
};

// ─── 22. 𝑻𝑨𝑮𝑨𝑳𝑳 ───
commands.tagall = {
    category: 'group',
    desc: 'منشن الجميع',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);

        try {
            const groupMetadata = await sock.groupMetadata(jid);
            const participants = groupMetadata.participants.map(p => p.id);
            const text = args.join(' ') || '🔔 *منشن للجميع*';

            await sendWithNewsletter(sock, jid, {
                text: `${mikoHeader('𝑻𝑨𝑮 𝑨𝑳𝑳')}\n\n${text}\n\n${participants.map(p => `@${p.split('@')[0]}`).join(' ')}`,
                mentions: participants
            });
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في المنشن*', msg);
        }
    }
};

// ─── 23. 𝑯𝑰𝑫𝑬𝑻𝑨𝑮 ───
commands.hidetag = {
    category: 'group',
    desc: 'منشن مخفي',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);

        try {
            const groupMetadata = await sock.groupMetadata(jid);
            const participants = groupMetadata.participants.map(p => p.id);
            const text = args.join(' ') || '🔔 *إشعار للجميع*';

            await sock.sendMessage(jid, {
                text: text,
                mentions: participants
            });
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 24. 𝑮𝑹𝑶𝑼𝑷𝑰𝑵𝑭𝑶 ───
commands.groupinfo = {
    category: 'group',
    desc: 'معلومات المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        try {
            const groupMetadata = await sock.groupMetadata(jid);
            const admins = groupMetadata.participants.filter(p => p.admin).length;

            const text = `${mikoHeader('𝑮𝑹𝑶𝑼𝑷 𝑰𝑵𝑭𝑶')}\n\n` +
                `📛 *الاسم:* ${groupMetadata.subject}\n` +
                `📝 *الوصف:* ${groupMetadata.desc || 'لا يوجد'}\n` +
                `👥 *الأعضاء:* ${groupMetadata.participants.length}\n` +
                `👑 *المشرفين:* ${admins}\n` +
                `🔒 *الإعدادات:* ${groupMetadata.announce ? 'إعلانات فقط' : 'الكل يمكنه الكتابة'}\n` +
                `📅 *الإنشاء:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n${mikoFooter()}`;

            await reply(sock, jid, text, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في جلب المعلومات*', msg);
        }
    }
};

// ─── 25. 𝑺𝑬𝑻𝑵𝑨𝑴𝑬 ───
commands.setname = {
    category: 'group',
    desc: 'تغيير اسم المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        const name = args.join(' ');
        if (!name) return await reply(sock, jid, '❌ *أدخل الاسم الجديد*', msg);

        try {
            await sock.groupUpdateSubject(jid, name);
            await reply(sock, jid, `✅ *تم تغيير الاسم إلى:* ${name}`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 26. 𝑺𝑬𝑻𝑫𝑬𝑺𝑪 ───
commands.setdesc = {
    category: 'group',
    desc: 'تغيير وصف المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        const desc = args.join(' ');
        if (!desc) return await reply(sock, jid, '❌ *أدخل الوصف الجديد*', msg);

        try {
            await sock.groupUpdateDescription(jid, desc);
            await reply(sock, jid, `✅ *تم تغيير الوصف*`, msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 27. 𝑳𝑰𝑵𝑲 ───
commands.link = {
    category: 'group',
    desc: 'رابط المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        try {
            const code = await sock.groupInviteCode(jid);
            const link = `https://chat.whatsapp.com/${code}`;

            const buttons = [
                { name: "cta_copy", params: { display_text: "📋╎ نسخ الرابط", copy_code: link } },
                { name: "cta_url", params: { display_text: "🔗╎ فتح الرابط", url: link } }
            ];

            await sendInteractiveButtons(sock, jid, `${mikoHeader('𝑮𝑹𝑶𝑼𝑷 𝑳𝑰𝑵𝑲')}\n\n🔗 ${link}\n${mikoFooter()}`, buttons);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل في جلب الرابط*', msg);
        }
    }
};

// ─── 28. 𝑹𝑬𝑽𝑶𝑲𝑬 ───
commands.revoke = {
    category: 'group',
    desc: 'إعادة تعيين الرابط',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        try {
            await sock.groupRevokeInvite(jid);
            await reply(sock, jid, '✅ *تم إعادة تعيين الرابط*', msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 29. 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 ───
commands.antilink = {
    category: 'group',
    desc: 'تفعيل/تعطيل منع الروابط',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);

        const action = args[0]?.toLowerCase();
        if (action === 'on') {
            config.antilink = true;
            await reply(sock, jid, '✅ *تم تفعيل منع الروابط*', msg);
        } else if (action === 'off') {
            config.antilink = false;
            await reply(sock, jid, '❌ *تم تعطيل منع الروابط*', msg);
        } else {
            await reply(sock, jid, '📌 *الاستخدام:* .antilink on/off', msg);
        }
    }
};

// ─── 30. 𝑴𝑼𝑻𝑬 ───
commands.mute = {
    category: 'group',
    desc: 'كتم المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        try {
            await sock.groupSettingUpdate(jid, 'announcement');
            await reply(sock, jid, '🔇 *تم كتم المجموعة*', msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

// ─── 31. 𝑼𝑵𝑴𝑼𝑻𝑬 ───
commands.unmute = {
    category: 'group',
    desc: 'فك كتم المجموعة',
    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return await reply(sock, jid, '❌ *هذا الأمر للمجموعات فقط*', msg);

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!await isAdmin(sock, jid, sender)) return await reply(sock, jid, '❌ *للمشرفين فقط*', msg);
        if (!await isBotAdmin(sock, jid)) return await reply(sock, jid, '❌ *البوت يجب أن يكون مشرفاً*', msg);

        try {
            await sock.groupSettingUpdate(jid, 'not_announcement');
            await reply(sock, jid, '🔊 *تم فك الكتم*', msg);
        } catch (e) {
            await reply(sock, jid, '❌ *فشل*', msg);
        }
    }
};

module.exports = commands;
