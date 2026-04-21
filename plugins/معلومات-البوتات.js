import ws from 'ws'

let handler = async (m, { conn, command }) => {
  let uniqueUsers = new Map()

  if (!global.conns || !Array.isArray(global.conns)) global.conns = []

  for (const connSub of global.conns) {
    if (connSub.user && connSub.ws?.socket?.readyState !== ws.CLOSED) {
      const jid = connSub.user.jid
      const numero = jid?.split('@')[0]

      let nombre = connSub.user.name
      if (!nombre && typeof conn.getName === 'function') {
        try {
          nombre = await conn.getName(jid)
        } catch {
          nombre = `المستخدم ${numero} 💀`
        }
      }

      uniqueUsers.set(jid, nombre || `المستخدم ${numero} 💀`)
    }
  }

  const uptime = process.uptime() * 1000
  const formatUptime = clockString(uptime)
  const totalUsers = uniqueUsers.size

  let txt = `💀 *البوتات الفرعية النشطة* 💀\n\n`
  txt += `> 💀 *مدة التشغيل:* ${formatUptime}\n`
  txt += `> 💀 *عدد البوتات المتصلة:* ${totalUsers}\n`

  if (totalUsers > 0) {
    txt += `\n💀 *قائمة البوتات المتصلة:* 💀\n\n`
    let i = 1
    for (const [jid, nombre] of uniqueUsers) {
      const numero = jid.split('@')[0]
      txt += `💀 *${i++}.* ${nombre}\n> 💀 wa.me/${numero}\n\n`
    }
  } else {
    txt += `\n> 💀 لا يوجد بوتات متصلة حالياً.`
  }

  // التوقيع
  const signature = `\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 💀`

  // صورة مرفقة
  const imageUrl = 'https://files.catbox.moe/xj1ji9.jpg'

  await conn.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: txt + signature
  }, { quoted: m })
}

handler.command = ['listjadibot', 'bots', 'بوتات', 'البوتات', 'المنصبين', 'منصبين']
handler.help = ['بوتات', 'البوتات', 'المنصبين', 'منصبين']
handler.tags = ['serbot']
export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}