import fs from 'fs'
import os from 'os'
import path from 'path'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

const handler = async (m, { conn }) => {
  try {
    const start = performance.now()

    // اسم البوت من ملف config للبوت الفرعي
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = path.join('./JadiBots', botActual, 'config.json')

    let nombreBot = global.namebot || '✧ ʏᴜʀᴜ ʏᴜʀɪ ✧'

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
      } catch (err) {
        console.log('⚠️ لا يمكن قراءة إعدادات البوت الفرعي:', err)
      }
    }

    const cpus = os.cpus()
    const cpuModel = cpus[0].model.trim()
    const cpuSpeed = cpus[0].speed

    const totalMem = format(os.totalmem())
    const freeMem = format(os.freemem())
    const usedMem = format(os.totalmem() - os.freemem())

    // قياس البينج
    const { key } = await conn.sendMessage(m.chat, { text: '📡 جاري اختبار السرعة...' }, { quoted: m })
    const speed = performance.now() - start

    const caption = `
╭── ⬤ معلومات البوت ⬤ ──╮
│  اسم البوت\n ${nombreBot}
│ 📡 البينج: ${Math.round(speed)} مللي ثانية
╰──────────────────────╯

╭── ⬤ النظام ⬤ ─╮
│ 💻 النظام: ${os.platform()}
│ 🔷 اسم الجهاز: ${os.hostname()}
│ 🧠 الرام: ${usedMem} / ${totalMem}
│ 🟢 المتاح: ${freeMem}
│ 🔌 المعالج: ${cpuModel}
│ ⚙️ السرعة: ${cpuSpeed} MHz
╰────────────────────╯

𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 💀
    `.trim()

    // إرسال الصورة مع الكابتشن
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/atr8rp.jpg' },
      caption: caption
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`❌ حدث خطأ أثناء تنفيذ الأمر:\n\n${e}`)
  }
}

handler.help = ['ping', 'speed', 'بنج', 'السرعه', 'المعلومات']
handler.tags = ['main']
handler.command = /^(ping|speed|بنج|السرعه|السرعة|info|المعلومات)$/i
export default handler