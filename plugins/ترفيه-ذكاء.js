let handler = async (m, { conn, command, text }) => {
let stupidity = `*🤓  نسبة ذكاء 🤓*
*نسبة الذكاء ${text} 🤓هي* *${Math.floor(Math.random() * 100)}%* *من 100%*
*ربنا يشفيك😂❤*
`.trim()
m.reply(stupidity, null, { mentions: conn.parseMention(stupidity) })}
handler.help = ['stupidity']
handler.tags = ['fun']
handler.command = /^(ذكاء|زكاء)$/i
export default handler