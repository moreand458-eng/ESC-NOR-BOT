/* 
• Plugins Tiktok Downloader Hd
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
• Source Scrape: https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
*/

import axios from 'axios'

async function tikwm(url, type = '') {
  const result = {
    metadata: {},
    type: '',
    download: {}
  }

  try {
    if (!url.includes('tiktok')) throw 'رابط تيك توك غير صالح!'

    const apiUrl = `https://tikwm.com/api/?url=${url}${type === 'hd' ? '&count=12&cursor=0&web=1&hd=1' : ''}`
    const { data } = await axios.post(apiUrl, { timeout: 50000 })
    const res = data.data

    result.metadata = {
      title: res.title || '',
      id: res.id || '',
      region: res.region || '',
      duration: res.duration || '',
      author: res.author?.nickname || res.author || 'غير معروف'
    }

    if (res.images && Array.isArray(res.images)) {
      result.type = 'image'
      result.download = res.images
    } else {
      result.type = 'video'
      result.download = {
        url: type === 'hd' ? 'https://tikwm.com' + res.hdplay : 'https://tikwm.com' + res.play
      }
    }

    return result
  } catch (e) {
    return { msg: typeof e === 'string' ? e : 'فشل في الحصول على البيانات من تيك توك' }
  }
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('من فضلك أدخل رابط تيك توك صالح!')

  // إرسال رد فعل "🕒" عند بدء التنفيذ
  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key }
  })

  const isHD = command.toLowerCase().includes('hd')
  const res = await tikwm(text, isHD ? 'hd' : '')

  if (res.msg) return m.reply(res.msg)

  const { title, duration, author } = res.metadata

  // تخصيص الرسالة التوضيحية بناءً على اسم الأمر المستخدم
  let explanation = ''
  if (command === 'تيك4' || command === 'تيكتوك4') {
    explanation = 'استخدم هذا الأمر لتحميل مقاطع الفيديو أو الصور من تيك توك بجودة عالية (HD) إذا كانت متوفرة.\n\nمثال: !تيك4 https://www.tiktok.com/@username/video/123456789'
  } else if (command === 'بايت') {
    explanation = 'استخدم هذا الأمر لتحميل الفيديوهات من تيك توك بصيغة عادية.\n\nمثال: !بايت https://www.tiktok.com/@username/video/123456789'
  }

  if (res.type === 'image') {
    for (let i = 0; i < res.download.length; i++) {
      await conn.sendMessage(m.chat, {
        image: { url: res.download[i] },
        caption: `📷 شريحة ${i + 1}\n\n📌 ${title || 'بدون عنوان'}\n👤 ${author}\n⏱️ مدة الفيديو: ${duration || '-'} ثانية\n_مقدمة من: dxyz_`
      }, { quoted: m })
    }
  } else if (res.type === 'video') {
    const videoURL = res.download.url
    const buffer = await axios.get(videoURL, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, {
      video: buffer.data,
      caption: `🎬 *${title || 'بدون عنوان'}*\n👤 ${author}\n⏱️ مدة الفيديو: ${duration || '-'} ثانية\n\n${explanation}`
    }, { quoted: m })
  } else {
    m.reply('فشل في تحديد نوع المحتوى.')
  }
}

handler.help = ['تيك4', 'تيكتوك4', 'بايت']
handler.tags = ['downloader']
handler.command = /^تيك4|تيكتوك4|بايت$/i
handler.limit = false
handler.premium = false

export default handler