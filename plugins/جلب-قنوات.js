import fetch from 'node-fetch';

let obito = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, "❌", m);
  }

  const fileUrl = text.trim();

  await conn.reply(m.chat, "⏳ *جاري جلب القنوات... انتظر قليلاً* 💀", m);

  try {
    // تنزيل محتوى الملف
    const response = await fetch(fileUrl);
    const fileContent = await response.text();

    // استخراج أسماء القنوات باستخدام المفتاح "tvg-id"
    const channels = [];
    const lines = fileContent.split('\n');
    lines.forEach((line) => {
      const match = line.match(/tvg-id="([^"]+)"/); // البحث باستخدام المفتاح "tvg-id"
      if (match) {
        channels.push({
          name: match[1],
          url: null,
        });
      } else if (line.startsWith('http')) {
        if (channels.length > 0) {
          channels[channels.length - 1].url = line.trim(); // إضافة رابط القناة إلى آخر قناة موجودة
        }
      }
    });

    if (channels.length === 0) {
      return conn.reply(m.chat, "❌ *لم يتم العثور على قنوات في الملف!*", m);
    }

    const totalChannels = channels.length;
    await conn.reply(m.chat, `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n✅ *تم جلب ${totalChannels} قناة في دوله المطلوبه*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n\n𝑀𝐼𝑁𝐴𝑇𝛩 𝐵𝛩𝑇`, m);

    // إرسال القنوات على دفعات من 30 قناة لكل رسالة
    const chunkSize = 30;
    for (let i = 0; i < channels.length; i += chunkSize) {
      const chunk = channels.slice(i, i + chunkSize);

      const message = chunk.map((channel, index) => `
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*⚔️┊اسم القناة┊⇇『${channel.name}』*
*🌐┊رابط القناة┊⇇『 ${channel.url || "غير متوفر"} 』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
      `).join("\n");

      await conn.reply(m.chat, message, m);
    }
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, "❌ *حدث خطأ أثناء معالجة الملف!*", m);
  }
};

obito.help = ["جلب-قنوات"];
obito.tags = ["utility"];
obito.command = /^جلب-قنوات$/i;

export default obito;