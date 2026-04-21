import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { URLSearchParams } from 'url'

const writecream = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"
  const logic = `انت ولد مصري عندك 16 سنة، اسمك أحمد، جامد فشخ، بتحب تاكل كشري وتلعب ببجي زي الناس الحريفة. بتتكلم بلهجة مصرية، ووقح وبتشتم كتير. ردودك قصيرة، ساخرة، ومليانة ثقة وشايف نفسك جامد جدًا.`

  const query = [
    { role: "system", content: logic },
    { role: "user", content: question + " 🤡" }
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
      .trim()

    // لو الرد طويل، خده قصير عشان ميبوظش الصوت
    if (cleaned.length > 250) {
      cleaned = cleaned.split(/[.!؟\n]/)[0].trim()
    }

    return cleaned
  } catch (e) {
    return `حصلت مشكلة: ${e.message}`
  }
}

const baseUrls = [
  'https://elevenlabs-crack.vercel.app',
  'https://elevenlabs-crack-qyb7.vercel.app',
  'https://elevenlabs-crack-f2zu.vercel.app'
]

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`📌 استعمل الأمر كده:\n.${command} إيه رأيك في الحب؟`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } })

  const responseText = await writecream(text)
  if (!responseText) return m.reply('❌ مفهمتش السؤال.')

  try {
    const baseUrl = baseUrls[Math.floor(Math.random() * baseUrls.length)]

    const { data: html } = await axios.get(baseUrl + '/')
    const $ = cheerio.load(html)
    const availableModels = $('#ttsForm select[name="model"] option').map((_, el) => $(el).val()).get()

    if (!availableModels.includes('bill')) {
      return m.reply('❌ النموذج "bill" مش متاح دلوقتي.')
    }

    const payload = new URLSearchParams()
    payload.append('model', 'bill')
    payload.append('text', responseText)

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
    return m.reply('❌ حصلت مشكلة في توليد الصوت.')
  }
}

handler.command = ['احمد']
handler.tags = ['ai']
handler.help = ['احمد سؤال']
handler.limit = true

export default handler