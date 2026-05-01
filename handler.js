// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 - 𝑴𝑨𝑰𝑵 𝑯𝑨𝑵𝑫𝑳𝑬𝑹
// ═══════════════════════════════════════════════════════════

const config = require('./config');
const { 
    reply, react, sendInteractiveButtons, isDeveloper, 
    mikoHeader, mikoFooter, randomImage 
} = require('./lib/helpers');
const fs = require('fs');
const path = require('path');

// Load all commands
const commands = {};
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const cmdModule = require(path.join(__dirname, 'commands', file));
    Object.assign(commands, cmdModule);
}

console.log(`✅ Loaded ${Object.keys(commands).length} commands`);

// Command categories for menu
const categories = {
    general: '🌐 عام',
    group: '👥 مجموعات',
    downloader: '📥 تحميل',
    tools: '🛠️ أدوات',
    fun: '🎮 ترفيه',
    games: '🎲 ألعاب',
    ai: '🤖 ذكاء',
    religion: '🕌 دين',
    tech: '💻 تقنية',
    owner: '👑 مطور'
};

// Generate menu dynamically
function generateMenu(category) {
    const cmds = Object.entries(commands).filter(([name, cmd]) => cmd.category === category);
    if (!cmds.length) return '';

    let text = `${categories[category]}:\n`;
    cmds.forEach(([name, cmd], i) => {
        text += `  ${i + 1}. .${name} - ${cmd.desc}\n`;
    });
    return text + '\n';
}

// Main message handler
async function messageHandler(sock, msg) {
    try {
        if (!msg.message) return;

        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');

        // Get message text
        let text = '';
        if (msg.message.conversation) text = msg.message.conversation;
        else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
        else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
        else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption;

        text = text.trim();
        if (!text) return;

        // Auto reply
        if (config.autoReply) {
            const lowerText = text.toLowerCase();
            for (const [trigger, response] of Object.entries(config.autoReplyData)) {
                if (lowerText.includes(trigger.toLowerCase())) {
                    await reply(sock, jid, response, msg);
                    return;
                }
            }
        }

        // Check prefix
        const prefix = config.prefix.find(p => text.startsWith(p));
        if (!prefix) return;

        // Parse command
        const args = text.slice(prefix.length).trim().split(/\s+/);
        const cmdName = args.shift().toLowerCase();

        // Handle button responses
        if (msg.message.buttonsResponseMessage) {
            const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
            if (buttonId.startsWith('menu_')) {
                const cat = buttonId.replace('menu_', '');
                const menuText = generateMenu(cat);
                if (menuText) {
                    await reply(sock, jid, 
                        `${mikoHeader(categories[cat].toUpperCase())}\n\n${menuText}${mikoFooter()}`, msg);
                }
                return;
            }
            if (buttonId === 'bot_info') {
                commands.botinfo.execute(sock, msg, args);
                return;
            }
        }

        // Handle list responses
        if (msg.message.listResponseMessage) {
            const selectedId = msg.message.listResponseMessage.singleSelectReply?.selectedRowId;
            if (selectedId?.startsWith('menu_')) {
                const cat = selectedId.replace('menu_', '');
                const menuText = generateMenu(cat);
                if (menuText) {
                    await reply(sock, jid, 
                        `${mikoHeader(categories[cat].toUpperCase())}\n\n${menuText}${mikoFooter()}`, msg);
                }
                return;
            }
        }

        // Find and execute command
        const command = commands[cmdName];
        if (!command) return;

        // Check owner-only
        if (command.category === 'owner' && !isDeveloper(sender)) {
            return await reply(sock, jid, '❌ *للمطورين فقط*', msg);
        }

        // Execute
        await command.execute(sock, msg, args);

    } catch (e) {
        console.error('Handler error:', e);
    }
}

// Group events handler
async function groupHandler(sock, update) {
    try {
        const { id, participants, action } = update;

        if (action === 'add' && config.welcomeMessage) {
            for (const participant of participants) {
                const text = `${mikoHeader('𝑾𝑬𝑳𝑪𝑶𝑴𝑬')}\n\n` +
                    `🌸 *أهلاً بك* @${participant.split('@')[0]} 🌸\n\n` +
                    `🤖 *البوت:* ${config.botName}\n` +
                    `📌 *البادئة:* ${config.prefix[0]}menu\n` +
                    `💫 *استمتع بالمجموعة!*\n${mikoFooter()}`;

                await sock.sendMessage(id, {
                    text: text,
                    mentions: [participant],
                    newsletter: config.newsletter
                });
            }
        }

        if (action === 'remove' && config.goodbyeMessage) {
            for (const participant of participants) {
                const text = `${mikoHeader('𝑮𝑶𝑶𝑫𝑩𝒀𝑬')}\n\n` +
                    `👋 *وداعاً* @${participant.split('@')[0]} 👋\n` +
                    `💫 *نتمنى لك التوفيق*\n${mikoFooter()}`;

                await sock.sendMessage(id, {
                    text: text,
                    mentions: [participant],
                    newsletter: config.newsletter
                });
            }
        }

    } catch (e) {
        console.error('Group handler error:', e);
    }
}

module.exports = { messageHandler, groupHandler, commands, generateMenu, categories };
