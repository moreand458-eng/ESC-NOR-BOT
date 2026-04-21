import axios from 'axios';

let handler = async (m, { text, command, conn }) => {
  try {
    // إرسال رد فعل "🕒" عند بدء التنفيذ
    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    if (!text)
      return m.reply(`💀 الرجاء كتابة سؤالك بعد الأمر.\n\nمثال:\n*${command} ما الفرق بين let و var؟*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);

    let { data } = await axios.get('https://www.abella.icu/blackbox-pro?q=' + encodeURIComponent(text));
    
    if (data?.status !== 'success')
      return m.reply(`💀 فشل في الحصول على الإجابة.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);

    m.reply(`${data.data.answer.result}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
    
  } catch (e) {
    m.reply(`💀 حدث خطأ أثناء معالجة سؤالك.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

handler.help = ['blackbox-pro', 'بلاك'];
handler.command = ['blackbox-pro', 'بلاك'];
handler.tags = ['ai'];

export default handler;