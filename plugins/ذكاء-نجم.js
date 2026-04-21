import axios from 'axios';

let handler = async (m, { text, command }) => {
  if (!text) {
    return m.reply(
      `💀 *طريقة الاستخدام لأمر*: *${command}*\n\n` +
      `اكتب سؤالك مباشرة بعد الأمر للحصول على إجابة من الذكاء الاصطناعي.\n\n` +
      `مثال:\n*${command} ما الفرق بين الذكاء الاصطناعي والتعلم الآلي؟*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹`
    );
  }

  try {
    let { data } = await axios.get(`https://www.abella.icu/aoyoai?q=${encodeURIComponent(text)}`);
    if (data?.status !== 'success') throw '💀 فشل في الحصول على الرد من الخادم.';

    let res = data?.data?.response;
    if (!res) throw '💀 لم يتم العثور على رد.';

    m.reply(`💀 ${res}\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹`);
  } catch (e) {
    m.reply('💀 حدث خطأ أثناء المعالجة، حاول لاحقاً.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹');
  }
};

handler.help = ['aoyoai', 'اوي', 'آويو', 'ذكاء2', 'إسكانور'].map(v => v + ' <سؤالك>');
handler.command = ['aoyoai', 'اوي', 'آويو', 'ذكاء2', 'إسكانور'];
handler.tags = ['ai'];

export default handler;