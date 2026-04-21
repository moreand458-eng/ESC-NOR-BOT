import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, "استخدم التنسيق: *.ساوند <عنوان الأغنية>*\nمثال: *.ساوند Shape of You", m);

    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    try {
        let results = await SoundCloudSearch(args.join(" "));
        if (!results.length) return conn.reply(m.chat, "لم يتم العثور على نتائج.", m);

        let track = results[0];
        let downloadData = await SoundCloudDownload(track.link);

        if (!downloadData) return conn.reply(m.chat, "فشل في الحصول على رابط التنزيل.", m);

        let message = `🎵 *عنوان الأغنية:* ${downloadData.title}\n🔗 *الرابط:* ${track.link}\n\n> جاري تحميل الصوت...`;

        await conn.sendMessage(m.chat, {
            image: { url: downloadData.thumbnail },
            caption: message
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            audio: { url: downloadData.downloadUrl },
            mimetype: "audio/mp4"
        }, { quoted: m });

    } catch (error) {
        console.error("خطأ في SoundCloud:", error);
        conn.reply(m.chat, "حدث خطأ، يرجى المحاولة لاحقًا.", m);
    }
}

handler.help = ["ساوند", "ساوند-كلاود", "soundcloud", "scsearch"];
handler.tags = ["موسيقى"];
handler.command = /^(ساوند|ساوند-كلاود|soundcloud|scsearch)$/i;

export default handler;

async function SoundCloudSearch(query) {
    try {
        const { data } = await axios.get(`https://soundcloud.com/search?q=${encodeURIComponent(query)}`);
        const $ = cheerio.load(data);
        const noscriptContent = [];

        $('#app > noscript').each((_, el) => noscriptContent.push($(el).html()));

        if (noscriptContent.length < 2) throw new Error("لم يتم العثور على بيانات.");

        const _$ = cheerio.load(noscriptContent[1]);
        const results = [];

        _$('ul > li > h2 > a').each((_, el) => {
            const link = $(el).attr('href');
            const title = $(el).text();

            if (link && link.split('/').length === 3) {
                results.push({
                    title: title || "بدون عنوان",
                    link: `https://soundcloud.com${link}`
                });
            }
        });

        return results.length ? results : [];
    } catch {
        return [];
    }
}

async function SoundCloudDownload(url) {
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`);
        if (!data?.data?.url) throw new Error("فشل في الحصول على رابط التنزيل.");

        return {
            title: data.data.title || "بدون عنوان",
            thumbnail: data.data.thumbnail || "",
            downloadUrl: data.data.url
        };
    } catch {
        return null;
    }
}