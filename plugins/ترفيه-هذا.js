let handler = async (m, { conn, command, text, usedPrefix, participants }) => {
    if (!text) throw "بتستخدم الامر غلط مثلا: هذا @غون"
    const mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
 const userChar = [
      "سيقما",
      "قوي",
      "ضعيف",
      "عبقري",
      "غبي",
      "مش تمام",
      "سيمب",
      "طفل",
      "عظيم",
      "كلب",
      "مضحك",
      "عبيط",
      "حمار",
      "منحرف",
      "مش انسان",
      "فضاىي",
      "كيوت",
    ]
    const userCharacterSeletion =
      userChar[Math.floor(Math.random() * userChar.length)]

    let message = `هذا @${mentionedUser.split("@")[0]}  الشخص *${userCharacterSeletion}* 🔥⚡`
    
    conn.sendMessage(m.chat, { text: message, mentions: [mentionedUser] }, { quoted: m })
    
}
handler.help = ["character @tag"]
handler.tags = ['fun']
handler.command = /^(هذا)/i

export default handler 