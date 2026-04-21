let handler = async (m, { conn, command, text }) => {
    let percentage = Math.floor(Math.random() * 100); // حساب النسبة العشوائية
    let reaction = '';

    // تحديد رد فعل المستخدم بناءً على النسبة العشوائية
    if (percentage < 30) {
        reaction = '💔 النسبة منخفضة جدًا! يبدو أن هناك بعض العداء بينكما!';
    } else if (percentage >= 30 && percentage <= 70) {
        reaction = '😐 هناك توازن، لا مشكلة كبيرة بينكما.';
    } else {
        reaction = '🔥 الكره واضح جدًا! حاولوا إصلاح العلاقة!';
    }

    let elkrh = `✨━━━━━━━━━━━━━━━✨
│
*.❥ نسبة الكره بينك وبين ${text} 💔🥀* 
  *نسبة الكره: ${percentage}%* *من 100%*
  
  🌹 *هل توافق على هذه النسبة؟* 🌹
  *ردك مهم!*
  ─────
  ${reaction}
  
│
✨━━━━━━━━━━━━━━━✨
  
💀 *حقوق: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻* 💀
`.trim()

    // إرسال الرد مع تفعيل إمكانية التفاعل مع المذكرات
    m.reply(elkrh, null, { mentions: conn.parseMention(elkrh) })
}

handler.help = ['elkrh']
handler.tags = ['fun']
handler.command = /^(الكره)$/i

export default handler