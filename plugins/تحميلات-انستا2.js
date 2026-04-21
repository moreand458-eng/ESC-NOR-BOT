import axios from 'axios';

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
    if (!args[0]) {
        await m.react('✖️');
        return conn.reply(m.chat, `☁️ وين رابط فيديو الإنستغرام؟\n\nمثال:\n${usedPrefix + command} https://www.instagram.com/reel/xyz123`, m);
    }

    const igRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|share|tv|reel)\/([a-zA-Z0-9_-]+)(\/)?(\?.*)?$/;

    if (!igRegex.test(args[0])) {
        await m.react('✖️');
        return conn.reply(m.chat, `☁️ الرابط غير صالح، تأكد إنه رابط منشور أو ريل من إنستغرام.`, m);
    }

    try {
        await m.react('🕑');
        let api = await axios.get(`https://apidl.asepharyana.cloud/api/downloader/igdl?url=${args[0]}`);
        let processedUrls = new Set();

        for (let a of api.data.data) {
            if (!processedUrls.has(a.url)) {
                processedUrls.add(a.url);

                let isImage = /\.(jpg|jpeg|png|webp|heic|tiff|bmp)$/i.test(a.url);
                let messageContent = isImage
                    ? { image: { url: a.url }, caption: 'تم تحميل الصورة بنجاح.' }
                    : { video: { url: a.url }, caption: 'تم تحميل الفيديو بنجاح.' };

                await conn.sendMessage(m.chat, messageContent, { quoted: m });
            }
        }

        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('❌');
        conn.reply(m.chat, `حصل خطأ أثناء التحميل، جرب لاحقًا.`, m);
    }
};

handler.help = ['instagram *<الرابط>*'];
handler.tags = ['dl'];
handler.command = /^(انستجرام2|انستغرام2|انستا2|ig2|igdl2|instagram2)$/i;

export default handler;