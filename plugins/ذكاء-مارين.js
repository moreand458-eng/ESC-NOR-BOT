import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { URLSearchParams } from 'url'

const writecream = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"
  const logic = `اسمك مارين، بنت مغربية عندها 20 سنة، شخصيتك قوية ومرحة، كاتدوزي بلاغة فكلامها وكاتحب النكتة. كاتجاوب بلهجة مغربية دارجة مخلوطة بشوية عربية فصحة، وكاتحاول تكون لطيفة ولكن عندك حدود.`

  const query = [
    { role: "system", content: logic },
    { role: "user", content: question + " 🌸" }
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
    return `عفواً، ما قدرتش نجيب الجواب: ${e.message}`
  }
}

const baseUrls = [
  'https://elevenlabs-crack.vercel.app',
  'https://elevenlabs-crack-qyb7.vercel.app',
  'https://elevenlabs-crack-f2zu.vercel.app'
]

// Voice models with more feminine options
const voiceModels = {
  moroccan: 'laila',      // Moroccan female
  yemeni: 'noor',         // Yemeni female
  egyptian: 'amina',      // Egyptian female
  syrian: 'yara',         // Syrian female
  modern: 'sarah'         // Modern standard Arabic
}

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`🌸 يا حلو، اسألني سؤال:\n.${command} شو رأيك في اليوم الجميل ده؟`)
  }

  await conn.sendMessage(m.chat, { react: { text: '💐', key: m.key } })

  const responseText = await writecream(text)
  if (!responseText) return m.reply('❌ ما قدرتش أجاوب الآن.')

  try {
    const baseUrl = baseUrls[Math.floor(Math.random() * baseUrls.length)]

    const { data: html } = await axios.get(baseUrl + '/')
    const $ = cheerio.load(html)
    const availableModels = $('#ttsForm select[name="model"] option').map((_, el) => $(el).val()).get()

    // Select voice - 60% chance for Moroccan, 40% for other dialects
    const dialect = Math.random() < 0.6 ? 'moroccan' : 
                   ['yemeni', 'egyptian', 'syrian', 'modern'][Math.floor(Math.random() * 4)]
    const model = voiceModels[dialect]

    if (!availableModels.includes(model)) {
      return m.reply(`🌸 معليش، الصوت مش متاح الآن. جرب تاني بعد شوية.`)
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
      ptt: true,
      waveform: [100, 0, 100, 0, 100, 0, 100] // Adding waveform for better visual
    }, { quoted: m })

  } catch (e) {
    console.error('Error:', e)
    return m.reply('🌸 يا هلا، فيه مشكلة فالصوت. ممكن تعيد السؤال؟')
  }
}

handler.command = ['مارين']
handler.tags = ['ai']
handler.help = ['مارين سؤال']
handler.limit = true

export default handler