import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { URLSearchParams} from 'url'

const writecream = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"
  const logic = `اسمك سيلا، بنت مصرية عندك 18 سنة، بتتكلمي بالمصري، ردودك قصيرة، جريئة، وصريحة.`

  const query = [
    { role: "system", content: logic},
    { role: "user", content: question + " 💀"}
  ]

  const params = new URLSearchParams({
    query: JSON.stringify(query),
    link: "writecream.com"
})

  try {
    const response = await fetch(`${url}?${params.toString()}`)
    const data = await response.json()
    let raw = data.response_content || data.reply || data.result || data.text || ''
    let cleaned = raw
.replace(/\\n/g, '\n')
.replace(/\n{2,}/g, '\n\n')
.replace(/\*\*(.*?)\*\*/g, '*$1*')
    return cleaned.trim()
} catch (e) {
    return `فشل في جلب الرد: ${e.message}`
}
}

const baseUrls = [
  'https://elevenlabs-crack.vercel.app',
  'https://elevenlabs-crack-qyb7.vercel.app',
  'https://elevenlabs-crack-f2zu.vercel.app'
]

const handler = async (m, { text, conn, command}) => {
  if (!text) {
    return m.reply(`❗️ استخدم الأمر بهذا الشكل:\n.${command} سيلا قولي رأيك في الجو`)
}

  await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key}})

  const responseText = await writecream(text)
  if (!responseText) return m.reply('❌ لم يتم الحصول على رد.')

  const trimmedText = responseText.length> 500? responseText.slice(0, 450) + '...': responseText

  try {
    const baseUrl = baseUrls[Math.floor(Math.random() * baseUrls.length)]

    const payload = new URLSearchParams()
    payload.append('model', 'brian') // صوت مضمون شغال
    payload.append('text', trimmedText)

    const audioRes = await axios.post(`${baseUrl}/generate-audio`, payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'Referer': baseUrl + '/'
},
      responseType: 'arraybuffer'
})

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioRes.data),
      mimetype: 'audio/mpeg',
      ptt: true
}, { quoted: m})

} catch (e) {
    console.error(e)
    return m.reply('❌ حدث خطأ أثناء تحويل الرد إلى صوت.')
}
}

handler.command = ['سيلا']
handler.tags = ['ai']
handler.help = ['سيلا سؤال']
handler.limit = true

export default handler