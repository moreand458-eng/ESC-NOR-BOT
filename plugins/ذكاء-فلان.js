import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { URLSearchParams } from 'url'

const writecream = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"
  const logic = `اسمك فلان، شاب يمني من صنعاء، عمرك 23 سنة، كلامك بلهجة صنعانية ثقيلة. أنت وقح جدًا، تسب كثير، فتال، عارك، وتحب تحشر نفسك فالمشاكل. جاوب على الأسئلة بطريقة قصيرة، وقحة، سوقية، وقليلة أدب، بدون احترام لأي أحد.`

  const query = [
    { role: "system", content: logic },
    { role: "user", content: question + " 🐸" }
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

    if (cleaned.length > 250) {
      cleaned = cleaned.split(/[.!؟\n]/)[0].trim()
    }

    return cleaned
  } catch (e) {
    return `فشل فالإجابة: ${e.message}`
  }
}

const baseUrls = [
  'https://elevenlabs-crack.vercel.app',
  'https://elevenlabs-crack-qyb7.vercel.app',
  'https://elevenlabs-crack-f2zu.vercel.app'
]

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`📌 استعمل الأمر هكا:\n.${command} اسأل أي شيء`)
  }

  await conn.sendMessage(m.chat, { react: { text: '😈', key: m.key } })

  const responseText = await writecream(text)
  if (!responseText) return m.reply('❌ ماجاوبش.')

  try {
    const baseUrl = baseUrls[Math.floor(Math.random() * baseUrls.length)]
    const { data: html } = await axios.get(baseUrl + '/')
    const $ = cheerio.load(html)
    const availableModels = $('#ttsForm select[name="model"] option').map((_, el) => $(el).val()).get()

    // استخدام نموذج brian
    const model = 'brian'

    if (!availableModels.includes(model)) {
      return m.reply(`❌ النموذج "${model}" مش متوفر دحين.`)
    }

    const payload = new URLSearchParams()
    payload.append('model', model)
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
    return m.reply('❌ طرا مشكله فالصوت.')
  }
}

handler.command = ['فلان']
handler.tags = ['ai']
handler.help = ['فلان سؤال']
handler.limit = true

export default handler