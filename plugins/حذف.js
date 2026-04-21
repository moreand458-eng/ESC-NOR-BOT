let handler = async (m, { conn }) => {
  // تحقق أن الأمر داخل جروب
  if (!m.chat.endsWith('@g.us')) return

  // تأكد من أن البوت مشرف
  let groupMetadata = await conn.groupMetadata(m.chat)
  let botJid = conn.user.jid
  let bot = groupMetadata.participants.find(p => p.id === botJid || p.id === botJid.split(':')[0])
  if (!bot || !bot.admin) return m.reply('❌ يجب أن أكون مشرفًا لحذف الرسائل.')

  // تأكد من وجود رسالة مردود عليها
  if (!m.quoted) return m.reply('❗ قم بالرد على الرسالة التي تريد حذفها باستخدام الأمر')

  // نفذ الحذف
  try {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.quoted.id,
        participant: m.quoted.participant || m.quoted.sender
      }
    })
  } catch (e) {
    console.error(e)
    m.reply('⚠️ فشل حذف الرسالة. قد لا تكون لدي صلاحية أو أن الرسالة ليست صالحة للحذف.')
  }
}

handler.help = ['حذف']
handler.tags = ['group']
handler.command = /^حذف$/i
handler.group = true

export default handler