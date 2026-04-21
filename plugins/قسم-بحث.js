const handler = async (m, { conn }) => {

    const imageUrl = "https://files.catbox.moe/ux7geh.jpg";

    const messageText = `
╔══════════════════╗
  ✦ مرحباً بك يا 【 ${m.pushName} 】 ✦
        في قسم البحث 🔍
╚══════════════════╝

╔══════ ⌬ ══════╗
🔍 ⌊ IP ⌉
🔍 ⌊ اخبار انمي ⌉
🔍 ⌊ اخبار كره ⌉
🔍 ⌊ بحث تيك ⌉
🔍 ⌊ دروس ⌉
🔍 ⌊ فري فاير ⌉
🔍 ⌊ مانجا ⌉
🔍 ⌊ ناسا ⌉
╚══════ ⌬ ══════╝

> 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💗💛
    `.trim();

    await conn.sendMessage(m.chat, { text: "*_جاري إرسال القسم....... 🔍_*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });
};

handler.command = /^قسم-بحث$/i;
handler.tags = ["spider"];
handler.help = ["قسم-بحث"];

export default handler;