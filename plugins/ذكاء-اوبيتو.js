import axios from 'axios';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`💀 | *طريقة الاستخدام:*  
❖ أرسل الأمر *${usedPrefix}${command}* متبوعًا بسؤالك للحصول على إجابة من الذكاء الاصطناعي.  
📌 *مثال:*  
\`${usedPrefix}${command} ما هي نظرية النسبية؟\`  
𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }

  try {
    let { data } = await axios.get(`https://fgsi1-restapi.hf.space/api/ai/copilot?text=${encodeURIComponent(text)}`);
    m.reply(`💀 | *الإجابة:*  
${data?.data?.answer || '❌ لم أتمكن من العثور على إجابة.'}  
𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  } catch (e) {
    m.reply(`💀 | ❌ *حدث خطأ أثناء جلب الإجابة. حاول مجددًا لاحقًا!*  
𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`);
  }
};

// أوامر البوت باللغة العربية والإنجليزية
handler.help = ['copilot', 'اوبيتو'].map(v => v + ' - طرح سؤال على الذكاء الاصطناعي!');
handler.tags = ['ai'];
handler.command = /^(copilot|اوبيتو)$/i;

export default handler;