import fetch from "node-fetch";
import cheerio from "cheerio";

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const base = 'https://temporary-phone-number.com';
  const countrys = `${base}/countrys/`;
  const [feature, ...args] = text.split(" ");
  const input = args.join(" ").trim();

  if (!["دولة", "أرقام", "رسائل", "كود"].includes(feature)) {
    return m.reply(`✦ مرحباً بك في خدمة الأرقام الوهمية.\n\nاستخدم الأوامر التالية:\n\n▪️ ${usedPrefix + command} دولة\n▪️ ${usedPrefix + command} أرقام [رابط الدولة]\n▪️ ${usedPrefix + command} رسائل [رابط الرقم]\n▪️ ${usedPrefix + command} كود [النص]`);
  }

  if (feature === "دولة") {
    try {
      const res = await fetch(countrys);
      const html = await res.text();
      const $ = cheerio.load(html);

      let msg = `📍 قائمة الدول المتوفرة:\n\n`;
      $('a.checkout-box').each((i, el) => {
        const name = $(el).text().trim().split('\n')[0];
        const href = $(el).attr('href');
        msg += `📌 ${name}\n${usedPrefix + command} أرقام ${base + href}\n\n`;
      });

      return m.reply(msg.trim());
    } catch (e) {
      return m.reply('❌ حدث خطأ أثناء جلب الدول.');
    }
  }

  if (feature === "أرقام") {
    if (!input) return m.reply("🔢 أدخل رابط الدولة بعد الأمر.");

    try {
      const res = await fetch(input);
      const html = await res.text();
      const $ = cheerio.load(html);

      let msg = `📞 قائمة الأرقام:\n\n`;
      $('.col-sm-6.col-md-4.col-lg-3.col-xs-12').each((i, el) => {
        const number = $(el).find('.info-box-number').text().trim();
        const href = $(el).find('a').attr('href');
        const link = base + href;
        msg += `📲 ${number}\n${usedPrefix + command} رسائل ${link}\n\n`;
      });

      return m.reply(msg.trim());
    } catch (e) {
      return m.reply("❌ لم يتم جلب الأرقام، تحقق من الرابط.");
    }
  }

  if (feature === "رسائل") {
    if (!input) return m.reply("✉️ أدخل رابط الرقم بعد الأمر.");

    try {
      const res = await fetch(input);
      const html = await res.text();
      const $ = cheerio.load(html);

      let msg = `💬 الرسائل الواردة:\n\n`;
      $('.direct-chat-msg.left').each((i, el) => {
        const from = $(el).find('.direct-chat-info span.pull-right').text().trim();
        const time = $(el).find('.direct-chat-timestamp').text().trim();
        const textMsg = $(el).find('.direct-chat-text').text().trim();
        msg += `👤 من: ${from}\n🕒 الوقت: ${time}\n📝 الرسالة: ${textMsg}\n${usedPrefix + command} كود ${textMsg}\n\n`;
      });

      return m.reply(msg.trim());
    } catch (e) {
      return m.reply("❌ تعذر جلب الرسائل من الرابط.");
    }
  }

  if (feature === "كود") {
    if (!input) return m.reply("🧾 أدخل الكود بعد الأمر.");
    return m.reply(`🔐 كود التحقق:\n\n${input}`);
  }
};

handler.help = ["رقم"];
handler.tags = ["tools"];
handler.command = /^رقم$/i;

export default handler;