import fetch from 'node-fetch';

const handler = async (m, { conn }) => {

  const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";

  const messageText = `
*『 مـرحـبـاً بـك يـا ⌊ ${m.pushName} ⌉ فـي بـودي بـ𝑬𝑺𝑪𝑨𝑵𝑶𝑹ــوت 🕷️ 』*

*⌝ قـسـم الـبـحـث ┋🔍🕷️⌞ ⇊*
*⎔ ⋅ ───━ •﹝🕷️﹞• ━─── ⋅ ⎔*

📂 ⌈ *.apᴋ* ⌋  
🔎 ⌈ *.جيـتـهـاب* ⌋  
🔎 ⌈ *.تـابـع-شـغـل* ⌋  
🎵 ⌈ *.تـيـك3* ⌋  
📺 ⌈ *.تـيـوبـي* ⌋  
🎶 ⌈ *.شـغـل* ⌋  
🔊 ⌈ *.صـو* ⌋  
🎤 ⌈ *.صـوت* ⌋  
🎧 ⌈ *.صـوتـوي* ⌋  
🖼️ ⌈ *.صـوره* ⌋  
🎙️ ⌈ *.فـويـس* ⌋  
📹 ⌈ *.فـيـد* ⌋  
🎞️ ⌈ *.فـيـديـو* ⌋  
📽️ ⌈ *.فـيـديـوي* ⌋  
📝 ⌈ *.كـلـمـات* ⌋  
🎼 ⌈ *.مـلـف-صـوت* ⌋  
▶️ ⌈ *.يـوتـيـوب* ⌋  

*⎔ ⋅ ───━ •﹝🕷️﹞• ━─── ⋅ ⎔*

> 𝑬𝑺𝑪𝑨𝑵𝑶𝑹💀
  `.trim();

  await conn.sendMessage(m.chat, { text: "*_جـاري إرسـال الـقـسـم....... 💗🕷️_*" }, { quoted: m });

  await conn.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: messageText
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '🕷️', key: m.key } });
};

handler.command = /^قسم-البحث$/i;
handler.tags = ["بحث"];
handler.help = ["قسم-البحث"];

export default handler;