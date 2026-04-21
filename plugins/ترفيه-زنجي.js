import util from 'util'
import path from 'path'
let user = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata, command, conn, text, usedPrefix}) {
let ps = groupMetadata.participants.map(v => v.id)
let a = ps.getRandom()
let k = Math.floor(Math.random() * 70);
let top = `*انــت هــو اكــبـــر زنـــجــي ${user(a)}👦🏿*`.trim()
conn.sendFile (m.reply (top, null, { mentions: [a]}))}
handler.help = handler.command = ['زنجي']
handler.tags = ['fun']
handler.group = true
handler.limit = 0
export default handler
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}
