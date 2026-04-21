let handler = async (m, { conn, command, text }) => {
let stupidity = `*┃❐━═━═✦◈❨🔞❩◈✦═━═━❐┃*
*⏎┇نسبة انحرافك ${text} هي ${Math.floor(Math.random() * 100)}%┇☞*
*⏎┇طـــول عــمـــرك مـــحـــتــرم وانــا عــارف┇➥*
`.trim()
m.reply(stupidity, null, { mentions: conn.parseMention(stupidity) })}
handler.help = ['stupidity']
handler.tags = ['fun']
handler.command = /^(انحرافي)$/i
export default handler
