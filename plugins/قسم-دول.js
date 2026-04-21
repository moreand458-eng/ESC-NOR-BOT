import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";

    const messageText = `
*『 مـــۅرآحـبـاً بـــك يـــآ ⌊ ${m.pushName} ⌉ فـي 𓆩⚡𝑬𝑺𝑪𝑨𝑵𝑶𝑹⚡𓆪 بـــوت 』*

*⌝ قـــســـم آلـــاڛـطـۿـآرآت دول ┋🎭⌞ ⇊*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*

🇲🇦┊⇇『 ا͠ل͠م͠غ͠ر͠ب͠ 』
🇵🇸┊⇇『 ف͢ل͢س͢ط͢ي͢ن͢ 』
🇾🇪┊⇇『 آلـيـمـن 』
🇯🇴┊⇇『 آلآردن 』
🇸🇦┊⇇『 آلسـعـۈديـه 』
🇮🇶┊⇇『 آلـعـراق 』
🇦🇪┊⇇『 آلإمــآرآت 』
🇸🇩┊⇇『 آلــســۈدآن 』
🇸🇾┊⇇『 ســۈريــآ 』
🇪🇬┊⇇『 مــصــر 』

*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
> ✦ 𓆩⚡𝑬𝑺𝑪𝑨𝑵𝑶𝑹-bₒₜ⚡𓆪 ✦ 💗💛
    `.trim();

    await conn.sendMessage(m.chat, { text: "*⟢ جـــآري إيــرڛــآل آلــقــســم....... 💗*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });
};

handler.command = /^قسم-دول$/i;
handler.tags = ["𓆩⚡𝑬𝑺𝑪𝑨𝑵𝑶𝑹⚡𓆪"];
handler.help = ["قسم-الترفيه"];

export default handler;