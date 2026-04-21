import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";
import request from "request";
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        
        // إذا لم تكن الصورة موجودة، نطلب من المستخدم الرد على صورة
        if (!/image/g.test(mime)) {
            return m.reply("💀 يرجى الرد على صورة فقط باستخدام الأمر *تحسين2*.");
        }

        let media = await q.download(); // تحميل الصورة من الرسالة المقتبسة

        // رفع الصورة أولاً إلى Top4Top
        let link = await top4top(media); 
        let { result, status } = link;
        
        if (status === "خطأ") {
            return m.reply(`💀 فشل رفع الصورة: ${result}`);
        }

        // بعد رفع الصورة، نرسل رابطها إلى API لتحسينها
        let image = await upscale(result);
        if (!image) {
            return m.reply('💀 فشل تحسين الصورة.');
        }

        await conn.sendFile(m.chat, image, 'upscaled.png', '', m); // إرسال الصورة المحسنة للمستخدم
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } }); // رد فعل بعد إتمام العملية

    } catch (e) {
        console.error('💀 حدث خطأ:', e);
        m.reply('💀 فشل في العملية، حدث خطأ.');
    }
};

handler.help = ['hd-2', 'تحسين2']; // الأوامر المدعومة
handler.tags = ['ai'];
handler.command = /^(hd-2|تحسين2)$/i; // الأوامر المطلوبة لتحسين الصورة
handler.limit = true;

export default handler;

// دالة رفع الصورة عبر Top4Top
async function top4top(baper) {
    return new Promise(async (resolve, reject) => {
        const { ext } = await fileTypeFromBuffer(baper) || {};
        var req = await request({
                url: "https://top4top.io/index.php",
                method: "POST",
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "ar-SA,ar;q=0.9",
                    "cache-control": "max-age=0",
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryAmIhdMyLOrbDawcA',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            },
            function(error, response, body) {
                if (error) { return resolve({
                    result: 'error'
                }) }
                const $ = cheerio.load(body);
                let result = $('div.alert.alert-warning > ul > li > span').find('a').attr('href') || "فشل الرفع";
                if (result == "فشل الرفع") {
                    resolve({
                        status: "خطأ",
                        msg: "💀 ربما الملف غير مسموح أو جرّب ملفًا آخر"
                    });
                }
                resolve({
                    status: "نجاح",
                    result
                });
            });
        let form = req.form();
        form.append('file_1_', baper, {
            filename: `${Math.floor(Math.random() * 10000)}.` + `${ext}`
        });
        form.append('file_1_', '');
        form.append('submitr', '[ 💀 رفع الملفات ]');
    });
}

// دالة تحسين الصورة باستخدام API
async function upscale(url) {
    try {
        console.log(`💀 إرسال طلب API باستخدام الرابط: ${url}`);
        
        const api = `https://www.velyn.biz.id/api/tools/remini?url=${encodeURIComponent(url)}`;
        const response = await axios.get(api, { responseType: 'arraybuffer' });

        console.log(`💀 حالة الاستجابة: ${response.status}`);

        if (response.status !== 200) {
            throw new Error(`💀 فشل تحسين الصورة بحالة ${response.status}`);
        }

        return response.data; // العودة بالصورة المحسنة مباشرة
    } catch (error) {
        console.error('💀 حدث خطأ أثناء تحسين الصورة:', error);
        return null;
    }
}