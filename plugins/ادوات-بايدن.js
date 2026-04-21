let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let too = `*هذا الامر يمكن لك عمل تعليق تويتر بايدن💀*| *مثال : .بايدن مرحبا انا إسِــــکْأّنِـوٌر بوت تم تطويري بواسطة اوبيتو و إسكانور*`

  if (!text) throw too

  // إضافة رد فعل مع الساعة 🕒
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  let lr = (`https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`)
  conn.sendFile(m.chat, lr, 'drake.png', `*𝙈𝙄𝙉𝘼𝙏𝙊-𝘽𝙊𝙏*`, m)
}

handler.help = ['drake']
handler.tags = ['maker']
handler.command = ['بايدن','meme']

export default handler