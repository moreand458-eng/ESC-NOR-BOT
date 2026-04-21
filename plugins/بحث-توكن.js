import axios from 'axios';

let handler = async (m, { conn, text }) => {

  if (!text) {
    return conn.reply(m.chat, '*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تقديم بعد الامر توكن بوت التلجرام لي جلب معلوماته ✅💚*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*', m);
  }

  const token = text.trim();
  const apiUrl = `https://api.telegram.org/bot${token}/getMe`;


  await conn.reply(m.chat, '*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n🔄 *جاري التحقق من التوكن واستخراج البيانات...*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*', m);

  try {

    const response = await axios.get(apiUrl);
    const data = response.data;


    if (!data.ok) {
      return conn.reply(m.chat, '*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*التوكن الذي قدمته غير صالح يا اخي 📢*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*', m);
    }


    const botInfo = data.result;
    const infoMessage = `
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*🅿️┊الايدي┊⇇『${botInfo.id}』*
*💠┊الحاله┊⇇『${botInfo.is_bot}』*
*💣┊اسم البوت┊⇇『${botInfo.first_name}』*
*🔬┊المعرفة┊⇇『${botInfo.username}』*
*🛡️┊الانضمام للمجموعات┊⇇『${botInfo.can_join_groups}』*
*📲┊قرائة رسائل في المجموعات┊⇇『${botInfo.can_read_all_group_messages}』*
*🪄┊الاستعلامات الداخلية┊⇇『${botInfo.supports_inline_queries}』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
    `;


    await conn.reply(m.chat, infoMessage, m);
  } catch (error) {
    console.error('خطأ أثناء الاتصال بـ API OBITO TLI:', error.message);
    conn.reply(m.chat, 'حدثت مشكله اثناء جلب المعلومات.', m);
  }
};


handler.command = ['توكن'];
export default handler;