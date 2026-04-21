import fs from 'fs';

const handler = async (m, { text, usedPrefix, command }) => {
  // تحقق من أن الشخص هو المطور برقم محدد
  const allowedNumber = '201104213887@s.whatsapp.net'; // ← غير الرقم هنا لو لازم
  if (m.sender !== allowedNumber) {
    return m.reply('🚫 هذا الأمر مخصص للمطور فقط!');
  }

  // تحقق من وجود اسم للملف
  if (!text) throw `⚠️ ما الاسم الذي تريد حفظ الأمر به؟`;

  // تحقق من وجود رسالة مقتبسة
  if (!m.quoted || !m.quoted.text) throw `⚠️ من فضلك قم بالرد على كود الأمر المطلوب حفظه.`;

  const path = `plugins/${text}.js`;

  try {
    fs.writeFileSync(path, m.quoted.text);
    m.reply(`✅ تم حفظ الأمر بنجاح باسم: *${path}*`);
  } catch (e) {
    m.reply(`❌ حدث خطأ أثناء الحفظ:\n${e.message}`);
  }
};

handler.help = ['addplugin <اسم>'];
handler.tags = ['owner'];
handler.command = ['ضيف', 'addp', 'addplugin'];
handler.owner = false; // خليه false عشان نستخدم شرط الرقم بدل من isCreator

export default handler;