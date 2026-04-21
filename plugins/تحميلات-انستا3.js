// 💀 تحميل من انستغرام 💀
// api.ubed.my.id
import fetch from 'node-fetch';
import path from 'path';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `💀 *شرح استخدام الأمر: ${usedPrefix}${command}*\n\n` +
      `📌 قم بلصق رابط فيديو من إنستغرام.\n` +
      `🔗 مثال:\n${usedPrefix}${command} https://www.instagram.com/reel/DKnebqYowTg/?igsh=YzljYTk1ODg3Zg==\n\n` +
      `𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`
    );
  }

  if (!text.includes('instagram.com')) {
    return m.reply('💀 *الرابط غير صالح، الرجاء وضع رابط من انستغرام فقط.*');
  }

  try {
    // إرسال تفاعل أثناء المعالجة
    let processing = await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api.ubed.my.id/download/instagram?apikey=free1&url=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: processing.key } });
      return m.reply(`💀 *فشل في الوصول إلى الخادم: ${response.status} ${response.statusText}*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
    }

    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type');
    let filename = 'instagram_reel';

    if (contentType) {
      const mimeParts = contentType.split('/');
      filename += mimeParts.length > 1 ? `.${mimeParts[1]}` : '.mp4';
    } else {
      filename += '.mp4';
    }

    await conn.sendFile(m.chat, buffer, filename, '💀 *تم تحميل فيديو إنستغرام بنجاح!*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀', m);

    await conn.sendMessage(m.chat, { react: { text: '✅', key: processing.key } });
  } catch (error) {
    console.error('💀 خطأ أثناء التحميل:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`💀 *حدث خطأ أثناء المعالجة:*\n\n❌ ${error}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

handler.help = ['igdl3', 'instagramdl3', 'instadl3', 'ig3', 'instagram3', 'انستا3', 'انستغرام3', 'انستجرام3'].map(v => v + ' <رابط>');
handler.tags = ['downloader'];
handler.command = /^(igdl3|instagramdl3|instadl3|ig3|instagram3|انستا3|انستغرام3|انستجرام3)$/i;

export default handler;