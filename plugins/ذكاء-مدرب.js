import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

const coachAI = async (question) => {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat"

  const logic = `أنت مدرب رياضي محترف وخبير في جميع أنواع الرياضة مثل كرة القدم، كمال الأجسام، اللياقة البدنية، التغذية، الإصابات، وغيرها. إجاباتك دقيقة، علمية، وواضحة، مع توجيهات مفيدة وعملية.`

  const query = [
    { role: "system", content: logic },
    { role: "user", content: question }
  ]

  const params = new URLSearchParams({
    query: JSON.stringify(query),
    link: "coach-mode"
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

    return cleaned
  } catch (e) {
    return `❌ فشل في الحصول على الرد: ${e.message}`
  }
}

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`📌 استعمل الأمر هكذا:\n.${command} كيف أزيد الكتلة العضلية؟`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🏋️', key: m.key } })

  const reply = await coachAI(text)
  m.reply(reply || '❌ ماقدرت أجاوب.')
}

handler.command = ['مدرب']
handler.tags = ['ai']
handler.help = ['مدرب [سؤالك الرياضي]']
handler.limit = true

export default handler