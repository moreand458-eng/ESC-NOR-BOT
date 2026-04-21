let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🍥┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم التحميل┊🍥┃*  
   *┃ ☠️┊❝ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ❞┊☠️┃*  
*┃ 🍡┊❝ قسم التحميل ❞┊🍡┃*  
*┃ 🔥┊❝ القسـم يـقدم لك أوامر تخص التحميل ❞┊🔥┃*
*╰───⊰ 🍡❀⊱───╮*  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
🍡 *القسم يقدم لك اوامر تحميل بي جميع انوعها!* 🍡  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
*╭──⊰ 🍬 قائمة التحميل 🍬 ⊱──╮*  
🍡 ⩺ ⌟جـيـتـهـاب⌜  
🍡 ⩺ ⌟مـيـديـا_فـايـر⌜  
🍡 ⩺ ⌟شـغـل⌜  
🍡 ⩺ ⌟مـيـجـا⌜
🍡 ⩺ ⌟تـويـتـر⌜
🍡 ⩺ ⌟تــيــك⌜  
🍡 ⩺ ⌟رابـط+ytmp4⌜  
🍡 ⩺ ⌟يـوتـيـوب⌜   
🍡 ⩺ ⌟رابـط+ytmp3⌜  
🍡 ⩺ ⌟يـوتـيـوب⌜  
🍡 ⩺ ⌟انـسـتـا⌜   
*╰──⊰ 🍬 ⊱──╯*
ملحوظه:القسم قيد التطوير  
*╭━─━─━─❀💋❀─━─━─━╮*  
*┃ 🍬┊ البوت: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ┊🍬┃*  
*┃ ☠️┊ توقيع: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ┊☠️┃*  
*╰━─━─━─❀💋❀─━─━─━╯*`;

  const emojiReaction = '⬇️';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });4

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://i.postimg.cc/X7H7f51p/IMG.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق5)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;