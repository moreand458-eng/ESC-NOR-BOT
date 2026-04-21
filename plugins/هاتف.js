import cheerio from 'cheerio';
import fetch from 'node-fetch';

let activeChats = {};

const handler = async (m, { conn, text }) => {
    const userKey = m.chat + m.sender;

    if (!text) return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تقديم بعد الامر اسم الهاتف للبحث عنه ✅❤*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");
    await m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*جاري البحث يا اخي،المرجو تحلي بصبر.....*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

    try {
        let res = await fetchAndParseData(text);
        let teks = res.map((item, index) => {
            return `*⚔️┊نتيجه رقم┊⇇『${index + 1}』*\n*🔱┊العنوان┊⇇『${item.title}』*\n> 🌐┊⇇『اعمل رد على هذه رساله ب رقم ${index + 1} لي يتم إرسال معلومات الهاتف』`;
        }).filter(v => v).join("\n\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n\n");

        await conn.sendMessage(m.chat, { text: teks }, { quoted: m });
        activeChats[userKey] = { res, optionsSent: true };
    } catch (e) {
        await m.reply('حدثت مشكله اثناء البحث يا اخي');
    }
};

const responseHandler = async (m, { conn }) => {
    const userKey = m.chat + m.sender;

    if (activeChats[userKey] && activeChats[userKey].optionsSent) {
        const choice = parseInt(m.text.trim());
        const { res } = activeChats[userKey];
        delete activeChats[userKey];

        if (choice > 0 && choice <= res.length) {
            try {
                let obje = await ambilKontenDenganLink(res[choice - 1].link);
                await m.reply(obje);
            } catch (e) {
                await m.reply('حدث خطأ أثناء جلب المحتوى. ');
            }
        } else {
            m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*لم يتم العثور على نتيجه ، المشكله من رقم نتيجه غير صحيح*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");
        }
    }
};

handler.before = responseHandler;
handler.command = /^(هاتف)$/i;

export default handler;

async function fetchAndParseData(q) {
    try {
        const response = await fetch('https://raqamitv.com/?s=' + q);
        const html = await response.text();
        const $ = cheerio.load(html);

        const posts = $('.post-item').map((index, element) => {
            const title = $(element).find('.post-title a').text();
            const link = $(element).find('.post-title a').attr('href');
            return { title, link };
        }).get();

        return posts;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function ambilKontenDenganLink(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const semuaKontenDenganLink = [];
        $('p').each((index, element) => {
            const teksP = $(element).text();
            if (teksP) {
                semuaKontenDenganLink.push(teksP);
            }
        });

        return semuaKontenDenganLink.join('\n\n');
    } catch (error) {
        console.error('حدث خطأ:', error);
        return null;
    }
}