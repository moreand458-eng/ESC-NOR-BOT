let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🍥┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم الادوات┊🍥┃*  
   *┃ ☠️┊❝ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ❞┊☠️┃*  
*┃ 🍡┊❝ قسم الادوات ❞┊🍡┃*  
*┃ 🔥┊❝ القسـم يـقدم لك أوامر تخص الادوات ❞┊🔥┃*
*╰───⊰ 🍡❀⊱───╮*  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
🍡 *القسم يقدم لك أوامر لي الادوات!* 🍡  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
*╭──⊰ 🍬 قائمة الادوات 🍬 ⊱──╮*  
🍡 ⩺ ⌟لـرابـط⌜  
🍡 ⩺ ⌟لـصـوت⌜  
🍡 ⩺ ⌟لـفـيـديـو⌜  
🍡 ⩺ ⌟لـصـوره⌜  
🍡 ⩺ ⌟سـتـيـك⌜  
🍡 ⩺ ⌟تـحـسـيـن⌜  
🍡 ⩺ ⌟تـعـديـل⌜  
🍡 ⩺ ⌟كـود⌜  
🍡 ⩺ ⌟حـقـوق⌜    
🍡 ⩺ ⌟اخـتـصـار⌜    
🍡 ⩺ ⌟تـرجـم⌜    
🍡 ⩺ ⌟رسـم⌜
🍡 ⩺ ⌟كلمات_فيديو⌜
🍡 ⩺ ⌟لـكـرتـون⌜    
🍡 ⩺ ⌟حـلـل⌜    
🍡 ⩺ ⌟صـورتـه⌜ 
🍡 ⩺ ⌟اكـتـشـف⌜    
*╰──⊰ 🍬 ⊱──╯*  
*╭━─━─━─❀💋❀─━─━─━╮*  
*┃ 🍬┊ البوت: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ┊🍬┃*  
*┃ ☠️┊ توقيع: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ┊☠️┃*  
*╰━─━─━─❀💋❀─━─━─━╯*`;

  const emojiReaction = '🔧';

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

handler.command = /^(ق4)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;