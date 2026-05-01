// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 𝑩𝑶𝑻 - 𝑴𝑨𝑰𝑵 𝑬𝑵𝑻𝑹𝒀
//  𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿
// ═══════════════════════════════════════════════════════════

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { Boom } = require('@hapi/boom');
const { messageHandler, groupHandler } = require('./handler');
const config = require('./config');
const fs = require('fs');

const logger = pino({ level: 'silent' });

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: ['𝑴𝑰𝑲𝑶', 'Chrome', '3.0.0'],
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        keepAliveIntervalMs: 30000
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Connection handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scan QR Code to connect');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut 
                : true;

            console.log('❌ Connection closed:', lastDisconnect?.error?.message || 'Unknown');

            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                setTimeout(connectToWhatsApp, 5000);
            }
        } else if (connection === 'open') {
            console.log('✅ 𝑴𝑰𝑲𝑶 Bot Connected Successfully!');
            console.log(`🤖 Bot Name: ${config.botName}`);
            console.log(`📌 Version: ${config.botVersion}`);
            console.log(`👑 Owner: 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿`);
            console.log(`📊 Commands: 105`);

            // Send startup message to owner
            for (const dev of config.developers) {
                try {
                    await sock.sendMessage(dev, {
                        text: `✅ *𝑴𝑰𝑲𝑶 Bot Started!*\n\n🤖 *Status:* Online\n📌 *Version:* ${config.botVersion}\n📊 *Commands:* 105\n⏰ *Time:* ${new Date().toLocaleString()}`,
                        newsletter: config.newsletter
                    });
                } catch (e) {}
            }
        }
    });

    // Message handler
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
            for (const msg of m.messages) {
                if (!msg.key.fromMe) {
                    await messageHandler(sock, msg);
                }
            }
        }
    });

    // Group events
    sock.ev.on('group-participants.update', async (update) => {
        await groupHandler(sock, update);
    });

    return sock;
}

// Start the bot
connectToWhatsApp().catch(console.error);

// Handle uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
