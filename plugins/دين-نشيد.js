import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix }) => {
    let id = parseInt(text.trim());
    
    if (isNaN(id) || id < 1 || id > 200) {
        return m.reply(`*خطأ: الرقم يجب أن يكون بين 1 و 10.*`);
    }

    await m.reply(`*انتظر يا اخي جاري جلب النشيد 😍*`);

    try {
        let response = await fetch(`https://api-log-ten.vercel.app/api/islam/nachid?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`فشل طلب API مع الحالة ${response.status}`);
        }

        let json = await response.json();
        let audioUrl = json.mp3url;

        await conn.sendFile(m.chat, audioUrl, 'nasheed.mp3', '', m);
    } catch (error) {
        console.error(error);
        m.reply(`للأسف حصل خطأ غير متوقع، حاول مرة أخرى.\nالخطأ ⇩⇩\n${error}`);
    }
};

handler.help = ['nachid'];
handler.tags = ['islam'];
handler.command = /^(نشيد|nachid)$/i;

export default handler;