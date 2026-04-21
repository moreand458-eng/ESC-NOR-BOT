import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) return m.reply('💀 *استخدام الأمر:*\n- قم بالرد على صورة ثم أرسل الأمر\n*.فلسطين* ليتم إضافة إطار فلسطين 🇵🇸 على الصورة.\n📌 *مثال:*\n- أرسل صورة في المحادثة\n- رد على الصورة بكتابة:\n*.فلسطين*')

  m.reply('جاري تحويل صوره......')

  let media = await q.download()
  let imageUrl = await uploadImage(media).catch(() => null)
  if (!imageUrl) return m.reply('Failed to upload the image.')

  let apiUrl = `https://api.malik-jmk.web.id/api/maker/profile/v1?flagId=ps&profileUrl=${encodeURIComponent(imageUrl)}`
  let res = await fetch(apiUrl)
  if (!res.ok) return m.reply('Failed to get a response from the API.')

  let buffer = await res.buffer()
  conn.sendFile(m.chat, buffer, 'palestine.jpg', '𝑀𝐼𝑁𝐴𝑇𝛩 𝐵𝛩𝑇', m, false, { mimetype: 'image/jpeg' })
}

handler.help = ['اوبيتو']
handler.tags = ['اوبيتو']
handler.command = ['فلسطين']
handler.limit = true
export default handler