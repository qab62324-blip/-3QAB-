// ═══════════════════════════════════════════════════════════
//  𝑴𝑰𝑲𝑶 𝑩𝑶𝑻 - 𝑪𝑶𝑵𝑭𝑰𝑮𝑼𝑹𝑨𝑻𝑰𝑶𝑵
// ═══════════════════════════════════════════════════════════

const config = {
    // ─── 𝑩𝑶𝑻 𝑰𝑵𝑭𝑶 ───
    botName: "𝑴𝑰𝑲𝑶",
    botVersion: "𝟑.𝟎.𝟎",
    prefix: [".", "!", "#", "/"],

    // ─── 𝑫𝑬𝑽𝑬𝑳𝑶𝑷𝑬𝑹𝑺 ───
    developers: [
        "97431298191@s.whatsapp.net",
        "130391365169264@s.whatsapp.net"
    ],
    devNumbers: ["97431298191", "130391365169264"],

    // ─── 𝑵𝑬𝑾𝑺𝑳𝑬𝑻𝑻𝑬𝑹 ───
    newsletter: {
        name: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
        jid: '120363409792989178@newsletter'
    },

    // ─── 𝑩𝑶𝑻 𝑰𝑴𝑨𝑮𝑬𝑺 ───
    botImages: [
        "https://i.postimg.cc/qvkrD3sL/04b81773fb5f08b61f5fdf63edd729c1.jpg",
        "https://i.postimg.cc/MK0xYDQ5/070f3882be6af76fdf0e92b2d780a656.jpg",
        "https://i.postimg.cc/ZKPZLcdN/13e4dc37c8920adccea94e4ec58132b9.jpg",
        "https://i.postimg.cc/X7K3g8CK/2561f61782b4b4bc24cb9d4b994d7bac.jpg",
        "https://i.postimg.cc/TYjGc9Dr/31f784b0f0e9b9844e089f5fa0187716.jpg",
        "https://i.postimg.cc/Kv7F5NMr/4ac6778db233d1194c54f18f822f9b51.jpg",
        "https://i.postimg.cc/NjgtCH6k/520f261d12def467fe5b4113f749f875.jpg",
        "https://i.postimg.cc/PrbhM4wQ/54bb88dec6f98ccd6347b1adbfca2624.jpg",
        "https://i.postimg.cc/RZMmpH7w/5b10cb4cd633ff8d972e2e6214177dd9.jpg",
        "https://i.postimg.cc/QdXDYTQm/5dccfda138fdbd3ce4a0a0abdf1b2618.jpg",
        "https://i.postimg.cc/XYVW1Cfx/6f6b647dede6423e661dd66ec96b7e61.jpg",
        "https://i.postimg.cc/8PdDbH6R/7d278b792931174dbf37cab18d85a07e.jpg",
        "https://i.postimg.cc/BQ5sCgKK/a58ad1524a1cee76b6cd72bef2a3bb85.jpg",
        "https://i.postimg.cc/fRwsq9cc/ba4ccc22c556be2c4913aefdc2c14d25.jpg",
        "https://i.postimg.cc/RV19TRH3/d91f58b508c79ce36fb79b903837310a.jpg",
        "https://i.postimg.cc/sDPyJchZ/dba1e0ccf85e054fde8f7fb3bae87b94.jpg",
        "https://i.postimg.cc/W12VYkGm/e13b0eca83c26efde6a8a11ac7dafdd4.jpg",
        "https://i.postimg.cc/rFGc9Jrf/e161014f6e4211eabb1505e9d319902f.jpg",
        "https://i.postimg.cc/hP8g0rdp/ee5873fa64d737f8b300e39bf75ce469.jpg",
        "https://i.postimg.cc/ZKPZLcd7/f8460a06945077ca0342819efc4b0897.jpg"
    ],

    // ─── 𝑨𝑼𝑻𝑶 𝑹𝑬𝑷𝑳𝒀 ───
    autoReply: true,
    autoReplyData: {
        "السلام عليكم": "🌸 𝑾𝒂𝒍𝒂𝒊𝒌𝒖𝒎 𝑺𝒂𝒍𝒂𝒎 🌸\n✨ أهلاً بك في عالم *𝑴𝑰𝑲𝑶* ✨",
        "تست": "✅ 𝑩𝒐𝒕 𝑾𝒐𝒓𝒌𝒊𝒏𝒈 𝑷𝒆𝒓𝒇𝒆𝒄𝒕𝒍𝒚 ✅",
        "هلا": "👋 𝑯𝒆𝒍𝒍𝒐 𝑫𝒆𝒂𝒓 👋\n🎀 أنا *𝑴𝑰𝑲𝑶* جاهزة لمساعدتك 🎀",
        "باي": "👋 𝑮𝒐𝒐𝒅𝒃𝒚𝒆 👋\n💫 نتمنى لك يوماً سعيداً 💫",
        "صباح الخير": "🌅 𝑮𝒐𝒐𝒅 𝑴𝒐𝒓𝒏𝒊𝒏𝒈 🌅\n☀️ صباح النور والأمل مع *𝑴𝑰𝑲𝑶* ☀️",
        "مساء الخير": "🌙 𝑮𝒐𝒐𝒅 𝑬𝒗𝒆𝒏𝒊𝒏𝒈 🌙\n✨ مساء الورد والياسمين ✨",
        "مساء النور": "🌟 𝑮𝒐𝒐𝒅 𝑬𝒗𝒆𝒏𝒊𝒏𝒈 🌟\n💫 مساء النور والسرور 💫",
        "اهلين": "🌸 𝑨𝒉𝒍𝒂𝒏 𝒘𝒂 𝑺𝒂𝒉𝒍𝒂𝒏 🌸\n🎀 أهلاً وسهلاً بك عزيزي 🎀",
        "هلو": "👋 𝑯𝒆𝒍𝒍𝒐 👋\n✨ أهلاً بك في *𝑴𝑰𝑲𝑶* ✨",
        "مرحبا": "🌺 𝑴𝒂𝒓𝒉𝒂𝒃𝒂 🌺\n🎀 أنا *𝑴𝑰𝑲𝑶*، كيف يمكنني مساعدتك؟",
        "شخبارك": "💫 𝑨𝒍𝒉𝒂𝒎𝒅𝒖𝒍𝒊𝒍𝒍𝒂𝒉 💫\n🌸 أنا بخير، وأنت؟ 🌸",
        "كيفك": "💖 𝑨𝒍𝒉𝒂𝒎𝒅𝒖𝒍𝒊𝒍𝒍𝒂𝒉 𝑩𝒊 𝑲𝒉𝒂𝒊𝒓 💖\n✨ أنا بأفضل حال، شكراً لسؤالك ✨",
        "كيف الحال": "🌟 𝑨𝒍𝒍 𝑮𝒐𝒐𝒅 🌟\n💫 الحال تمام مع *𝑴𝑰𝑲𝑶* 💫",
        "كيف صحتك": "💪 𝑭𝒊𝒕 & 𝑭𝒊𝒏𝒆 💪\n🌸 صحتي جيدة، شكراً لاهتمامك 🌸",
        "كيف امورك": "✨ 𝑬𝒗𝒆𝒓𝒚𝒕𝒉𝒊𝒏𝒈 𝑰𝒔 𝑭𝒊𝒏𝒆 ✨\n🎀 أموري بخير، وأنت؟ 🎀",
        "كيف الاخبار": "📰 𝑮𝒐𝒐𝒅 𝑵𝒆𝒘𝒔 📰\n💫 الأخبار كلها سارة مع *𝑴𝑰𝑲𝑶* 💫",
        "كيف الامور": "🎯 𝑷𝒆𝒓𝒇𝒆𝒄𝒕 🎯\n✨ كل الأمور تحت السيطرة ✨"
    },

    // ─── 𝑮𝑹𝑶𝑼𝑷 𝑺𝑬𝑻𝑻𝑰𝑵𝑮𝑺 ───
    welcomeMessage: true,
    goodbyeMessage: true,
    antilink: false,
    antispam: false,

    // ─── 𝑳𝑰𝑴𝑰𝑻𝑺 ───
    cooldown: 3000,
    maxFileSize: 100 * 1024 * 1024, // 100MB

    // ─── 𝑨𝑷𝑰𝑺 ───
    apis: {
        removebg: "",
        openai: "",
        weather: ""
    }
};

module.exports = config;
