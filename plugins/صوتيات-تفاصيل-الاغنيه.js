import fetch from 'node-fetch';
import FormData from 'form-data';

async function FindSong(buffer) {
    const form = new FormData();
    
    form.append('file', buffer, {
        filename: 'file1.mp3',
        contentType: 'audio/mp3'
    });

    form.append('sample_size', buffer.length);

    try {
        const response = await fetch('https://api.doreso.com/humming', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                "accept": "application/json, text/plain, */*"
            },
            body: form
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

// دالة لترجمة النصوص إلى العربية
async function translateToArabic(text) {
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`);
        const json = await res.json();
        return json.responseData.translatedText || text;
    } catch {
        return text; // في حالة حدوث خطأ، يرجع النص الأصلي
    }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {     
    try {
        let buffer;
        
        if (m.quoted && /audio|video/.test(m.quoted.mimetype)) {
            buffer = await m.quoted.download();
        } else if (/https?:\/\//.test(args[0])) {
            const response = await fetch(args[0]);
            if (!response.ok) throw `❌ *فشل في تحميل الملف من الرابط:* ${args[0]}`;
            buffer = Buffer.from(await response.arrayBuffer(), 'binary');
        } else {
            return m.reply(`💀 *يرجى الرد على مقطع صوتي قصير أو رابط يحتوي على ملف صوتي*\n\n*مثال:* ${usedPrefix}${command} https://files.catbox.moe/4p9a9i.mp3`);
        }

        m.reply('💀 *جاري البحث عن معلومات الأغنية...*');

        const result = await FindSong(buffer);
        
        if (result.error) {
            return m.reply(`💀 *حدث خطأ:* ${result.error}`);
        }
        
        if (!result.data) {
            return m.reply('💀 *لم يتم العثور على الأغنية، حاول مع مقطع آخر أقصر*');
        }
        
        const { acrid, artists, title } = result.data;

        // ترجمة العنوان واسم الفنان إلى العربية
        const translatedTitle = await translateToArabic(title);
        const translatedArtists = await translateToArabic(artists);

        const formattedResult = `💀 *تفاصيل الأغنية*\n\n` +
                              `🎵 *العنوان:* ${translatedTitle}\n` +
                              `🎤 *الفنان:* ${translatedArtists}\n` +
                              `🆔 *ID الأغنية:* ${acrid}`;
        
        m.reply(formattedResult);
        
    } catch (error) {
        m.reply(`💀 *حدث خطأ:* ${error.message}`);
    }
};

handler.help = ['whatssong', 'findsong', 'carilagu', 'تفاصيل-الاغنيه', 'تفاصيل-الاغنية'];
handler.command = /^(whatssong|findsong|carilagu|تفاصيل-الاغنيه|تفاصيل-الاغنية)$/i;
handler.tags = ['tools'];

export default handler;