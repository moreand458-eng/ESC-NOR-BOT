let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
let pesan = args.join` `
let oi = `*💌┆الرسالة↲「${pesan}」*`
let teks = `*「منشن جماعي╎🔥」* \n\n ${oi}\n\n*🎭┇الجروب ⇣*\n`
for (let mem of participants) {
teks += `*💀｡･ﾟ♡┇* @${mem.id.split('@')[0]}\n`}
teks += `*｡･ﾟ♡ﾟ･｡💀｡･ﾟ♡ﾟ･｡🛅ـ*`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )
}
handler.help = ['tagall <mesaje>','invocar <mesaje>']
handler.tags = ['group']
handler.command = /^(سمس|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.group = true
export default handler