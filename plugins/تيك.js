import fetch from 'node-fetch';

let handler = async (m, { command, usedPrefix, conn, args, text }) => {
  if (!text) {
    // إذا لم يتم إدخال رابط
    await conn.sendMessage(
      m.chat,
      {
        text: `*❲ ❗ ❳ يرجى إدخال رابط لتحميل الملف.*\nمثال:\n> ➤ ${usedPrefix + command} https://vm.tiktok.com/ZMM3U7evQ/`,
      },
      { quoted: m }
    );
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } });
    return;
  }

  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/|vm\.tiktok\.com\/)/i;
  if (!tiktokRegex.test(text)) {
    // إذا كان الرابط غير صالح
    await conn.sendMessage(
      m.chat,
      { text: `*❲ ❗ ❳ الرابط الذي أدخلته غير صحيح. يرجى إدخال رابط تيك توك صالح.*` },
      { quoted: m }
    );
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } });
    return;
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  const link = text.trim();
  let data = await downloadMedia(link);

  if (data.error) {
    // إذا حدث خطأ أثناء التحميل
    await conn.sendMessage(m.chat, { text: `❗ حدث خطأ أثناء التحميل: ${data.error}` }, { quoted: m });
    return;
  }

  const { title, views, comment, share, save, author, account, bio, cover, videoUrl, musicUrl } = data;

  let امر = `
╮─┄┄〘 *تحميل تيك توك* 〙┄┄⋗
│ ⤳ *العنوان*: ${title || 'غير متوفر'}
│ ⤳ *المشاهدات*: ${views || 'غير متوفر'}
│ ⤳ *الإعجابات*: ${comment || 'غير متوفر'}
│ ⤳ *المشاركات*: ${share || 'غير متوفر'}
│ ⤳ *التحميلات*: ${save || 'غير متوفر'}
│ ⤳ *الصانع*: ${author || 'غير متوفر'}
│ ⤳ *الحساب*: ${account || 'غير متوفر'}
│ ⤳ *البايو*: ${bio || 'غير متوفر'}
╯┄┄┄┄≺ جاري إرسال الملفات ≻┄⋗
`;

  // إرسال الصورة والمعلومات
  await conn.sendMessage(m.chat, { image: { url: cover }, caption: امر }, { quoted: m });

  // إرسال الفيديو
  await conn.sendMessage(
    m.chat,
    { video: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
    { quoted: m }
  );

  // إرسال الصوت
  await conn.sendMessage(
    m.chat,
    { audio: { url: musicUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` },
    { quoted: m }
  );

  await conn.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });
};

// تعريف الأمر لتفعيل الهاندلر
handler.command = /^(تيك|tiktok)$/i; // يدعم أوامر متعددة
export default handler;

// دالة لتحميل البيانات من API
async function downloadMedia(link) {
  let response;
  let result;

  try {
    const url = `https://api-marin.vercel.app/download/tiktok?url=${link}`;
    response = await fetch(url);

    if (!response.ok) {
      throw new Error(`فشل الاتصال بالخادم: ${response.statusText} (رمز الحالة: ${response.status})`);
    }

    result = await response.json();

    if (result.status === 200 && result.data) {
      const { nickname, username, avatar, description, thumbnail, played, commented, saved, shared, video, audio } =
        result.data;

      return {
        title: description || 'غير متوفر',
        views: played || 'غير متوفر',
        comment: commented || 'غير متوفر',
        share: shared || 'غير متوفر',
        save: saved || 'غير متوفر',
        author: nickname || 'غير متوفر',
        account: username || 'غير متوفر',
        bio: description || 'غير متوفر',
        cover: thumbnail || 'غير متوفر',
        videoUrl: video?.noWatermark || 'غير متوفر',
        musicUrl: audio || 'غير متوفر',
        error: null,
      };
    } else {
      throw new Error(`لم يتم العثور على الروابط المناسبة: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error('Error downloading media:', error.message);
    return { error: error.message };
  }
}