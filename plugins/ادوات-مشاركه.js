import axios from 'axios';

let handler = async (m, { command, text }) => {
  let content = text || (m.quoted && m.quoted.text);

  if (!content) {
    return m.reply(
      `💀 لا يمكنك استخدام الأمر *${command}* بدون نص!\n\n💀 *طريقة الاستخدام:*\n- إما كتابة نص بعد الأمر\n- أو الرد على رسالة تحتوي على نص ثم كتابة الأمر فقط\n\n💀 *مثال:*\n.${command} هذا مثال على مشاركة نص\n\n💀 أو\nقم بالرد على أي رسالة ثم أرسل:\n.${command}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`
    );
  }

  try {
    const res = await axios.post('https://sharetext.io/api/text', {
      text: content
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
        'Referer': 'https://sharetext.io/'
      }
    });

    const id = res.data;
    if (!id) throw new Error('💀 فشل في الحصول على الرابط!');

    await m.reply(`💀 *تم إنشاء الرابط بنجاح:*\nhttps://sharetext.io/${id}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  } catch (err) {
    await m.reply(`💀 حدث خطأ أثناء رفع النص:\n${err.message}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

handler.help = ['share', 'مشاركة', 'مشاركه'];
handler.command = ['share', 'مشاركة', 'مشاركه'];
handler.tags = ['tools'];

export default handler;