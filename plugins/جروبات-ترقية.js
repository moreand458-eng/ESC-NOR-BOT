const handler = async (m, {conn, usedPrefix, text}) => {
  if (isNaN(text) && !text.match(/@/g)) {

  } else if (isNaN(text)) {
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    var number = text;
  }

  if (!text && !m.quoted) return conn.reply(m.chat, `💀 _كيفية استخدام الأمر "رفع مشرف":_ \n\n🔹 _هذا الأمر يسمح لك بترقية أحد أعضاء المجموعة ليصبح مشرفًا._ \n\n📌 _طرق الاستخدام:_ \n1️⃣ _إرسال الرقم مباشرة مع الأمر:_ \n   \`${usedPrefix}رفع 2126620×××\`\n\n2️⃣ _الرد على رسالة المستخدم المطلوب ترقيته:_ \n   \`الرد على الرسالة بكتابة: ${usedPrefix}رفع\`\n\n3️⃣ _استخدام المنشن مباشرة مع الأمر:_ \n   \`${usedPrefix}رفع @اسم_المستخدم\`\n\n⚠️ _ملاحظة: يجب أن يكون الرقم ضمن الطول الصحيح (11 إلى 13 رقمًا)._ \n\n𝒁𝑶𝑹𝑶 𝑩𝑶𝑻 𝚅¹💀`, m)
if(number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `⚠️ *الرقم الذي أدخلته غير صالح!*\n🔹 *تأكد من أن الرقم يتراوح بين 11 و 13 رقمًا.*`, m);

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';
    }
  } catch (e) {
  } finally {
    conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    conn.reply(m.chat, `تم ترقيته الى منصب مشرف 🎃💛`, m);
  }
};
handler.help = ['*201225655×××*', '*@اسم المستخدم*','*محادثة المستجيب*'].map((v) => 'promote ' + v);
handler.tags = ['group'];
handler.command = /^(ترقية|ترقيه|رفع|ارفعو|رول)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;
export default handler;