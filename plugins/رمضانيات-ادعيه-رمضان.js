/*
💀 wa.me/6282285357346
💀 github: https://github.com/sadxzyq
💀 Instagram: https://instagram.com/tulisan.ku.id
💀 هذا wm الخاص بي لا تحذفه
*/

import axios from 'axios'

// دالة البحث عبر TikTok (تم دمجها في نفس الملف)
async function ttSearch(query) {
    return new Promise(async (resolve, reject) => {
        axios("https://tikwm.com/api/feed/search", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "cookie": "current_language=en",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
            },
            data: {
                "keywords": query,
                "count": 12,
                "cursor": 0,
                "web": 1,
                "hd": 1
            },
            method: "POST"
        }).then(res => {
            resolve(res.data.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// لتخزين الفيديوهات التي تم إرسالها مسبقًا
let sentVideos = []

// الـ handler الذي سيعمل على إرسال الأدعية
let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    // البحث عن أدعية رمضان
    ttSearch('ادعيه رمضان').then(a => {
        let videos = a.videos

        // ترتيب الفيديوهات بناءً على تاريخ النشر (نحسب أن البارامتر "created_at" يمثل تاريخ النشر)
        videos.sort((v1, v2) => {
            return new Date(v2.created_at) - new Date(v1.created_at)
        })

        // العثور على الفيديو الذي لم يتم إرساله من قبل (نبحث عن الفيديو الذي لا يوجد في sentVideos)
        let newVideo = null
        for (let video of videos) {
            if (!sentVideos.includes(video.id)) {
                newVideo = video
                break
            }
        }

        if (newVideo) {
            let result = 'https://tikwm.com/' + newVideo.play
            // إرسال الفيديو مع تعليق "دعاء رمضان" + التوقيع
            conn.sendMessage(m.chat, {video: {url: result}, caption: 'دعاء رمضان\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀'}, {quoted: m})

            // إضافة الفيديو الذي تم إرساله إلى قائمة sentVideos
            sentVideos.push(newVideo.id)
        } else {
            m.reply('💀 لا توجد فيديوهات جديدة حالياً، يرجى المحاولة لاحقاً.')
        }
    }).catch(err => {
        // في حال حدوث خطأ
        m.reply('💀 حدث خطأ')
    })
}

// أوامر البوت
handler.help = ['ادعيه-رمضان']  // تغيير الأمر إلى "ادعيه-رمضان"
handler.tags = ['random']
handler.command = /^(ادعيه-رمضان)$/i  // جعل الأمر فقط "ادعيه-رمضان"
handler.limit = true
handler.register = true

export default handler