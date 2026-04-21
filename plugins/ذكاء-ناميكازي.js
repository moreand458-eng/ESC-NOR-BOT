import axios from 'axios';

let handler = async (m, { text, command }) => {
  if (!text) {
    let usageExamples = {
      chatbot: '💀 *طريقة الاستخدام:*\nاكتب سؤالك بعد الأمر مثل:\n.chatbot من هو ناروتو أوزوماكي؟',
      ناميكازي: '💀 *طريقة الاستخدام:*\nاكتب سؤالك بعد الأمر مثل:\nناميكازي ما معنى الشينوبي؟'
    };
    
    return m.reply(`${usageExamples[command] || '💀 اكتب سؤالك بعد الأمر بشكل صحيح.'}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }

  try {
    let { data } = await axios.get(`https://www.abella.icu/onlinechatbot?q=${encodeURIComponent(text + ' جاوبني بالعربية فقط')}`);
    if (data?.data?.answer?.data) {
      m.reply(`💀 *الإجابة:*\n${data.data.answer.data}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
    } else {
      m.reply(`💀 لم أتمكن من العثور على إجابة.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
    }
  } catch (e) {
    m.reply(`💀 حدث خطأ أثناء الاتصال بالخادم.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

handler.help = ['chatbot', 'ناميكازي'].map(v => v + ' <سؤالك>');
handler.command = ['chatbot', 'ناميكازي'];
handler.tags = ['ai'];

export default handler;