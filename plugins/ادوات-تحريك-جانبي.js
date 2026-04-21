import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) throw `أين الصورة؟ 💀`
    
    try { q = m.quoted.download() }
    catch (e) { q = m.download() }

    m.reply(`💀 جاري إنشاء الفيديو... انتظر قليلًا.`)

    running(await q).then(vid => conn.sendFile(m.chat, vid, 'run.mp4', `💀 تم الإنشاء بنجاح!`, m))
}

// أوامر الاستخدام
handler.help = ['run', 'تحريك-جانبي']
handler.tags = ['tools', 'أدوات']
handler.command = /^(run|تحريك-جانبي)$/i

export default handler

let tmp = path.join('./tmp/')

function running(img, duration = 10, fps = 60) {
    return new Promise((resolve, reject) => {
        let layers = [
            `color=s=512x512:d=${duration}:r=${fps}[bg]`,
            '[0:v]scale=-2:512[img]',
            `[bg][img]overlay=x='(w+h)*((n/${fps})*-1/${duration})+h'`
        ]

        let n = +new Date + 'run.jpg'
        let i = path.join(tmp, n)
        fs.writeFileSync(i, img)
        console.log(`💀 تم حفظ الصورة المؤقتة:`, img)

        let o = path.join(tmp, n + '.mp4')
        let args = [
            '-y',
            '-i', i,
            '-t', duration.toString(),
            '-filter_complex', layers.join(';'),
            '-pix_fmt', 'yuv420p',
            '-crf', '18',
            o
        ]

        console.log(`💀 تشغيل FFmpeg:`, 'ffmpeg', ...args)

        spawn('ffmpeg', args, { stdio: 'inherit' })
            .on('error', reject)
            .on('close', () => {
                try {
                    fs.unlinkSync(i)
                    resolve(fs.readFileSync(o))
                    fs.unlinkSync(o)
                    console.log(`💀 تم حذف الملفات المؤقتة.`)
                } catch (e) {
                    reject(e)
                }
            })
    })
}