let handler = async (m, { conn, text, args, isOwner }) => {
  if (!isOwner) 
    return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n❌ *عذرًا، هذا الأمر مخصص للمالك فقط!*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

  if (!text || !args[0] || !args[1]) 
    return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n⚠️ *طريقة الاستخدام الصحيحة:*\n.تفاعل-قناه https://whatsapp.com/channel/0029VaDZKjd4Crfr1QOOlJ2D/2499 🇲🇦🇲🇦❤🧡💛💚💚\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

  if (!args[0].includes("https://whatsapp.com/channel/")) 
    return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n🚫 *الرابط الذي أدخلته غير صالح، يرجى إدخال رابط قناة صحيح!*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

  let result = args[0].split('/')[4];
  let serverId = args[0].split('/')[5];
  let res = await conn.newsletterMetadata("invite", result);

  await conn.newsletterReactMessage(res.id, serverId, args[1]);


  await conn.sendMessage(m.chat, {
    image: { url: "https://files.catbox.moe/l3pf80.jpeg" },
    caption: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n✅ *تم إرسال التفاعل (${args[1]}) إلى قناة:* *${res.name}* بنجاح! 🎉\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`,
  }, { quoted: m });
};

handler.help = ["اوبيتو"];
handler.tags = ["اوبيتو"];
handler.command = /^تفاعل-قناة|تفاعل-قناه$/i;

export default handler;