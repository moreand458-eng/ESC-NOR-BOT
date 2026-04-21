import fetch from 'node-fetch'

let handler = async (m, { args, conn }) => {
  let count = parseInt(args[0])
  if (isNaN(count) || count <= 0) return m.reply('🍭 اكتب عدد الحسابات بعد الأمر.\nمثال: .سافيوم 5')

  if (count > 20) return m.reply('🍫️ الحد الأقصى لعدد الحسابات هو 20!')

  // الرد الأول
  await m.reply('🍷️ انتظر جاري انشاء الحسابات...')

  // تأخير 3 ثواني
  await new Promise(resolve => setTimeout(resolve, 3000))

  // رابط الملف
  let url = 'https://qu.ax/JnYkk.txt'

  let res
  try {
    res = await fetch(url)
  } catch (e) {
    return m.reply('🥂 فشل في تحميل الملف من الرابط')
  }

  if (!res.ok) return m.reply('🍭 الرابط غير صالح أو الملف غير متاح')

  let text = await res.text()
  let accounts = text.trim().split('\n').map(a => a.trim()).filter(Boolean)

  if (accounts.length === 0) return m.reply('🍷️ مفيش حسابات في الملف!')
  if (count > accounts.length) count = accounts.length

  let selected = accounts.sort(() => 0.5 - Math.random()).slice(0, count)

  let formatted = selected.map((acc, i) => `${i + 1} - \`${acc}\``).join('\n\n')

  let message = `🍫️ تم انشاء ${count} حساب سافيوم:\n\n${formatted}`
  return m.reply(message)
}

handler.command = ['سافيوم']
handler.help = ['سافيوم [عدد]']
handler.tags = ['tools']

export default handler