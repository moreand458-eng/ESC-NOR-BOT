const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!m.isGroup) return m.reply('🔒 هذا الأمر يعمل فقط في المجموعات.');

  const groupMetadata = await conn.groupMetadata(m.chat);

  // التحقق من صلاحيات المستخدم
  const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
  const isUserAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin' || m.sender === groupMetadata.owner;

  if (!isUserAdmin) return m.reply('❌ فقط مشرفي المجموعة يمكنهم استخدام هذا الأمر.');

  const mainEmoji = global.db.data.chats[m.chat]?.customEmoji || '☕';
  const decoEmoji1 = '✨';
  const decoEmoji2 = '📢';

  m.react(mainEmoji);

  // إذا لم يكتب المستخدم رسالة، عرض رسالة توضيحية مع مثال
  if (!args.length) {
    const usageMsg = `
💀 *طريقة استخدام الأمر* 💀

اكتب ${usedPrefix}${command} متبوعًا برسالتك ليتم منشن جميع الأعضاء:

مثال:
> • ${usedPrefix}${command} وقت الاجتماع 💀
> • ${usedPrefix}${command} تذكير للجميع 💀

𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀
    `.trim();
    return conn.reply(m.chat, usageMsg, m);
  }

  const mensaje = args.join(' ') || '💀 بدون رسالة مخصصة';
  const total = groupMetadata.participants.length;

  // رأس الرسالة
  const header = `
╭──────────────────────╮
│       ${decoEmoji2} *💀 منشن عام 💀* ${decoEmoji2}       │
╰──────────────────────╯
`;

  // معلومات إضافية
  const info = `
> 💌 الرسالة: ${mensaje}
> 👥 عدد الأعضاء: ${total} 💀
${decoEmoji1}
`;

  // إنشاء قائمة الأعضاء مع المنشن
  let cuerpo = '';
  for (const mem of groupMetadata.participants) {
    cuerpo += `• ${mainEmoji} @${mem.id.split('@')[0]} 💀\n`;
  }

  // تذييل الرسالة
  const footer = `
${decoEmoji1}
┊ *📅 الأمر:* ${usedPrefix}${command}
╰──────────────────────╯
𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀
`;

  const texto = header + info + cuerpo + footer;

  // إرسال الرسالة مع المنشن لكل الأعضاء
  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions: groupMetadata.participants.map(p => p.id)
  });
};

// أوامر مساعدة وتصنيف
handler.help = ['todos *<رسالة اختياري>*', 'invocar *<رسالة اختياري>*', 'tagall *<رسالة اختياري>*', 'منشن *<رسالة اختياري>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall', 'منشن'];
handler.group = true;
handler.register = false;

export default handler;