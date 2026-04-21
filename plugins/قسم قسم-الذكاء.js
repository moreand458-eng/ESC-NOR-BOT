import fs from 'fs'

const handler = async (m, { conn }) => {

    const imageUrl = "https://files.catbox.moe/mmquzs.jpg";

    const messageText = `
*『 ✧ مرحبـاً بك يا ⌊ ${m.pushName} ⌉ ✧ 』*  
*في قــسم ┇ الذكــاء 🤖 داخل بوت 𓆩𝑬𝑺𝑪𝑨𝑵𝑶𝑹𓆪*

╭───━ • ✦ • ━───╮  
   ⟡ ˚ ༘ ⋆｡𖦹  
   ˚⌝ قــسم الـذكـاء 🧠⌞ ˚  
╰───━ • ✦ • ━───╯  

┊⇇『 ✧ اوبـو ✧ 』⚡  
┊⇇『 ✧ إسكانور ✧ 』💎  
┊⇇『 ✧ بــوت ✧ 』🤖  
┊⇇『 ✧ اوبيتو ✧ 』🔥  
┊⇇『 ✧ بروفيسور ✧ 』🎓  
┊⇇『 ✧ بلاك ✧ 』🌑  
┊⇇『 ✧ بوت ✧ 』⚙️  
┊⇇『 ✧ إسكانور2 ✧ 』💎  
┊⇇『 ✧ ديبسيك ✧ 』👁️  
┊⇇『 ✧ شيخ ✧ 』☪️  
┊⇇『 ✧ مريم ✧ 』🌹  
┊⇇『 ✧ بـودي ✧ 』🕷️  
┊⇇『 ✧ ناميكازي ✧ 』⚡  
┊⇇『 ✧ هوكاجي2 ✧ 』🌀  

╭───━ • ✦ • ━───╮  
 > ✧ مع قسم الذكاء ✧  
    استمتع بالابداع 💡 والمرح 🎭  
╰───━ • ✦ • ━───╯  
    `.trim();

    await conn.sendMessage(m.chat, { text: "*_⏳ جاري إرسال قسم الذكاء... 🧠_*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '🕷️', key: m.key } });
};

handler.command = /^قسم-الذكاء$/i;
handler.tags = ["ai", "ذكاء"];
handler.help = ["قسم-الذكاء"];

export default handler;