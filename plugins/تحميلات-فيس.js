import axios from 'axios';

const sukiIcon = 'https://files.catbox.moe/rkvuzb.jpg';
const channelRD = 'https://whatsapp.com/channel/0029Vb2VEyaHAdNLWqDcRz1v';

const handler = async (m, { text, conn, args, command }) => {
  const name = conn.getName(m.sender);

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    externalAdReply: {
      title: '💀 تحميل فيديو من فيسبوك',
      body: `💀 جاري تجهيز الفيديو لك يا ${name}`,
      thumbnailUrl: sukiIcon,
      sourceUrl: channelRD,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  };

  if (!args[0]) {
    const example = `💀 *طريقة الاستخدام:*\n\nأرسل الأمر مع رابط الفيديو من فيسبوك، هكذا:\n\n📌 مثال:\n> *${command}* https://fb.watch/xxx\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`;
    return conn.reply(
      m.chat,
      `💀 *أوه ${name}!* تحتاج لإعطائي رابط فيديو من فيسبوك لمساعدتك.\n\n${example}`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const fbUrl = args[0];
  let result;

  try {
    await m.react('🔎');
    const res = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/facebook?url=${encodeURIComponent(fbUrl)}`);
    result = res.data;
  } catch (e) {
    await m.react('❌');
    return conn.reply(
      m.chat,
      `💀 *عذرًا ${name}، حدث خطأ أثناء محاولة التحميل.*\nيرجى التأكد من صحة الرابط 🌐\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`,
      m,
      { contextInfo, quoted: m }
    );
  }

  if (!result || result.length === 0) {
    return conn.reply(
      m.chat,
      `💀 *لم أجد أي فيديو في هذا الرابط.*\nجرب إرسال رابط مختلف 💔\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const videoHD = result.find(v => v.quality === '720p (HD)');
  const videoSD = result.find(v => v.quality === '360p (SD)');
  const videoUrl = videoHD?.link_hd || videoSD?.link_sd;

  if (!videoUrl) {
    return conn.reply(
      m.chat,
      `💀 *للأسف لم أتمكن من إيجاد جودة مناسبة للفيديو.*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: `💀 *ها هو فيديوك الجميل يا ${name}~*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`,
          fileName: 'suki-fb.mp4',
          mimetype: 'video/mp4',
        },
        { quoted: m }
      );
      await m.react('✅');
      break;
    } catch (e) {
      if (attempt === maxRetries) {
        await m.react('❌');
        return conn.reply(
          m.chat,
          `💀 *لم أستطع إرسال الفيديو بعد عدة محاولات، آسف ${name}...*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`,
          m,
          { contextInfo, quoted: m }
        );
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

handler.help = ['facebook', 'fb', 'فيس', 'فيسبوك', 'فسبوك'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb', 'فيس', 'فيسبوك', 'فسبوك'];
handler.register = true;

export default handler;