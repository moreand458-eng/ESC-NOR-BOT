import axios from "axios";

const handler = async (m, { text, command }) => {
  if (!text) {
    return m.reply(
      `💀 *طريقة الاستخدام لأمر ${command === 'codegen' ? '.codegen' : '.كودجين'}:*\n` +
      `أرسل وصفًا لما تريده من الكود، متبوعًا بلغة البرمجة مفصولين بـ "|"\n\n` +
      `*مثال:*\n${command === 'codegen' ? '.codegen' : '.كودجين'} دالة لحساب مساحة المثلث|Python\n\n` +
      `𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`
    );
  }

  let [prompt, language] = text.split("|").map(v => v.trim());

  if (!prompt || !language) {
    return m.reply(
      `💀 *الصيغة غير صحيحة!*\n` +
      `يرجى استخدام الصيغة التالية:\n` +
      `${command === 'codegen' ? '.codegen' : '.كودجين'} <وصف الكود>|<لغة البرمجة>\n\n` +
      `*مثال:*\n${command === 'codegen' ? '.codegen' : '.كودجين'} دالة تحقق من عدد أولي|JavaScript\n\n` +
      `𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`
    );
  }

  try {
    const payload = {
      customInstructions: prompt,
      outputLang: language
    };

    const { data } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);

    if (!data || typeof data !== "string") {
      return m.reply("💀 لم يتمكن البوت من توليد الكود. حاول مجددًا لاحقًا.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀");
    }

    m.reply(
      `💀 *الكود الناتج (${language}):*\n` +
      "```" + language.toLowerCase() + "\n" +
      data.trim() +
      "\n```\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀"
    );

  } catch (error) {
    console.error(error);
    m.reply("💀 حدث خطأ أثناء معالجة الطلب.\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀");
  }
};

handler.command = ['codegen', 'كودجين'];
handler.help = ['codegen', 'كودجين'];
handler.tags = ['ai'];
handler.premium = false;
handler.limit = true;

export default handler;