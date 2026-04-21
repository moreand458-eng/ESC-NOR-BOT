import axios from 'axios';

// دالة لجلب بيانات الوسائط من تويتر/X
async function xdk(url) {
    try {
        const res = await axios.post(
            'https://contentstudio.io/.netlify/functions/facebookdownloaderapi',
            { url },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://contentstudio.io/tools/x-twitter-video-downloader',
                }
            }
        );
        return res.data;
    } catch (error) {
        return { error: '❌ فشل تحميل الوسائط.' };
    }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(
            `💀 *يرجى إدخال رابط تويتر/X لتنزيل الوسائط.*\n\n` +
            `🔹 *مثال الاستخدام:*\n` +
            `*${usedPrefix}${command} https://twitter.com/example/status/123456789*`
        );
    }

    // التحقق من صحة الرابط
    const regex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/;
    if (!regex.test(args[0])) {
        return m.reply('❌ *يرجى إدخال رابط صحيح من تويتر/X.*');
    }

    m.reply('⌛ *جاري معالجة الطلب، يرجى الانتظار...* 💀');

    try {
        const result = await xdk(args[0]);

        if (result.error) {
            return m.reply('❌ *فشل تحميل الوسائط. تأكد من صحة الرابط وحاول مرة أخرى.*');
        }

        let mediaSent = false;

        if (result.medias && result.medias.length > 0) {
            for (const media of result.medias) {
                if (media.url) {
                    const isImage = media.type === 'photo' || /\.(jpg|jpeg|png|webp)$/i.test(media.url);

                    if (isImage && !mediaSent) {
                        await conn.sendMessage(m.chat, { image: { url: media.url }, caption: `✅ *تم تحميل الصورة بنجاح!* 💀` }, { quoted: m });
                        mediaSent = true;
                        break;
                    } else if (!isImage) {
                        await conn.sendMessage(m.chat, { video: { url: media.url }, caption: `✅ *تم تحميل الفيديو بنجاح!* 💀` }, { quoted: m });
                        mediaSent = true;
                        break;
                    }
                }
            }
        } else if (result.url) {
            const isImage = result.type === 'photo' || /\.(jpg|jpeg|png|webp)$/i.test(result.url);

            if (isImage) {
                await conn.sendMessage(m.chat, { image: { url: result.url }, caption: `✅ *تم تحميل الصورة بنجاح!* 💀` }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { video: { url: result.url }, caption: `✅ *تم تحميل الفيديو بنجاح!* 💀` }, { quoted: m });
            }
        } else {
            m.reply('❌ *لم يتم العثور على أي وسائط في هذا الرابط.*');
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ *حدث خطأ أثناء محاولة تحميل الوسائط.*');
    }
};

// أوامر البوت
handler.help = ['تويتر', 'x', 'twitter2'];
handler.command = /^(تويتر|x|twitter)$/i;
handler.tags = ['downloader'];

export default handler;