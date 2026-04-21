import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw m.reply(`💀 *يرجى إدخال رابط فيديو TikTok!*\n\n💀 *طريقة الاستخدام:*\n✧ أرسل الأمر مع رابط الفيديو.\n\n*✧ مثال:* ${usedPrefix}${command} https://vm.tiktok.com/ZMhAk8tLx/\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);

  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    let d2 = await fetch(`https://eliasar-yt-api.vercel.app/api/search/tiktok?query=${text}`);
    let dp = await d2.json();

    const doc = {
      audio: { url: dp.results.audio },
      mimetype: 'audio/mp4',
      fileName: `ttbykeni.mp3`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: text,
          title: dp.results.title,
          sourceUrl: text,
          thumbnail: await (await conn.getFile(dp.results.thumbnail)).data
        }
      }
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply(`💀 حدث خطأ أثناء معالجة الرابط. يرجى المحاولة لاحقًا.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

handler.help = [
  'tiktokmp3 *<رابط>*',
  'تيك-صوت *<رابط>*'
];

handler.tags = ['dl'];

handler.command = /^(tiktokmp3|تيك-صوت)$/i;

export default handler;