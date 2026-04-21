import fetch from 'node-fetch'

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `💀 يرجى إدخال رابط مستودع GitHub لتنزيله.\n*مثال:* ${usedPrefix + command} https://github.com/GataNina-Li/GataBot-MD`

    if (!regex.test(args[0])) throw `💀 الرابط المدخل غير صالح، يرجى التأكد من إدخال رابط GitHub صحيح.`

    try {   
        let [_, user, repo] = args[0].match(regex) || []
        repo = repo.replace(/.git$/, '')

        let url = `https://api.github.com/repos/${user}/${repo}/zipball`
        let response = await fetch(url, { method: 'HEAD' })
        let filename = response.headers.get('content-disposition')?.match(/attachment; filename=(.*)/)?.[1]

        if (!filename) throw `💀 حدث خطأ أثناء محاولة جلب اسم الملف.`

        m.reply(`💀 جاري تحميل المستودع، يرجى الانتظار...`)
        conn.sendFile(m.chat, url, filename, null, m)

    } catch (e) { 
        await conn.reply(m.chat, `💀 حدث خطأ أثناء تنفيذ الأمر.\n\n🔹 *الإبلاغ عن الخطأ:* #report\n🔹 *الأمر المستخدم:* ${usedPrefix + command}`, m)
        console.error(`❗❗ خطأ في الأمر ${usedPrefix + command} ❗❗\n`, e)
    }
}

handler.help = [
    'gitclone <url>',  
    'جتهاب <الرابط>',
    'جيتهاب <الرابط>',
    'جيتهوب <الرابط>'
]

handler.tags = ['downloader']
handler.command = /gitclone|جتهاب|جيتهاب|جيتهوب|clonarepo|clonarrepo|repoclonar/i
handler.limit = 2
handler.level = 1
handler.register = true

export default handler

// توقيع
// 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀