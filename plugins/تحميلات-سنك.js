import axios from 'axios';
import cheerio from 'cheerio';

class SnackVideo {
    constructor(url) {
        this.url = url;
    }

    getScript(html) {
        const $ = cheerio.load(html);
        let data = [];
        $("script").each((_, a) => {
            data.push($(a).html());
        });
        return data[5];
    }

    decodeUnicode(str) {
        return str.replace(/\\u(\w{4})/g, (match, group) => String.fromCharCode(parseInt(group, 16)));
    }

    async fetchData() {
        const { data: html } = await axios.get(this.url);
        const getScript = this.getScript(html);

        const _contentUrl = getScript.split('contentUrl:"');
        return this.decodeUnicode(_contentUrl[1].split('",commentUrl:"')[0]);
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        let usageMessage = `💀 استخدم الأمر بشكل صحيح:\n`;
        usageMessage += `• مثال: ${usedPrefix}${command} <رابط الفيديو> \n`;
        usageMessage += `• مثال: ${usedPrefix}${command} https://www.snackvideo.com/@kwai/video/5202370628555172539\n`;
        return m.reply(usageMessage);
    }

    try {
        m.reply('💀 من فضلك انتظر...');

        const snackVideo = new SnackVideo(text);
        const videoUrl = await snackVideo.fetchData();

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            mimetype: 'video/mp4'
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('💀 حدث خطأ أثناء معالجة الرابط. تأكد من صحة الرابط وحاول مجددًا.');
    }
};

handler.help = ['snackvideo <url>', 'سنك-فيديو <رابط>'];
handler.tags = ['downloader'];
handler.command = /^(snackvideo|sv|سنك-فيديو|سنك)$/i;

export default handler;