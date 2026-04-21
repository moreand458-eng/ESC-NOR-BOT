import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { URLSearchParams } from 'url'
import fs from 'fs'

const writecream = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"
  const logic = `أنت مسلم اسمك شيخ عمرك 32 سنة 💀
أنت مفسر آيات القرآن الكريم، تعطي تفسيرات دقيقة ومدعومة بأدلة من القرآن والسنة.
تفسر الأحلام برؤية شرعية وتعتمد على علم الشريعة والعقيدة.
تتعامل مع الأسئلة بحكمة ورحمة، وتعطي نصائح دينية مناسبة لكل سؤال.
✅ اختصر الجواب قدر الإمكان دون الإخلال بالمعنى، وابدأ مباشرة بالجواب دون مقدمات.`

  const query = [
    { role: "system", content: logic },
    { role: "user", content: question + " 💀" }
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

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`❗️ استخدم الأمر بهذا الشكل:\n.${command} اشرح لي سورة الفاتحة`)
  }

  await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } })

  const responseText = await writecream(text)
  if (!responseText) return m.reply('❌ لم يتم الحصول على رد.')

  // 🧠 تقليل حجم الرد في حال كان طويلاً جداً
  const trimmedText = responseText.length > 500 ? responseText.slice(0, 450) + '...' : responseText

  try {
    const baseUrl = baseUrls[Math.floor(Math.random() * baseUrls.length)]

    const { data: html } = await axios.get(baseUrl + '/')
    const $ = cheerio.load(html)
    const availableModels = $('#ttsForm select[name="model"] option').map((_, el) => $(el).val()).get()

    if (!availableModels.includes('brian')) {
      return m.reply('❌ نموذج brian غير متوفر حالياً.')
    }

    const payload = new URLSearchParams()
    payload.append('model', 'brian')
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
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('❌ حدث خطأ أثناء تحويل الرد إلى صوت.')
  }
}

handler.command = ['شيخ']
handler.tags = ['ai']
handler.help = ['شيخ سؤال']
handler.limit = true

export default handler