let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // إرسال تفاعل انتظار 💀
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // التحقق من الرقم
        if (!text) {
            return m.reply(
                `💀 *اكتب الرقم الذي تريد الحصول على صورته!*\n` +
                `💀 مثال: ${usedPrefix + command} 2010×××××\n\n` +
                `💀 هذا الأمر يتيح لك مشاهدة صورة البروفايل لأي رقم واتساب.`
            );
        }

        // تنسيق الرقم
        let number = text.replace(/[+\s]/g, '');
        let apiUrl = `https://api.nekolabs.my.id/downloader/whatsapp?number=${number}`;

        // طلب API
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`💀 خطأ في API: ${response.status}`);

        // إرسال صورة البروفايل
        await conn.sendMessage(
            m.chat,
            { 
                image: { url: apiUrl },
                caption: `💀 *تم الحصول على صورة البروفايل بنجاح!* 💀\n` +
                         `💀 من الرقم: wa.me/${number}\n\n` +
                         `💀 بواسطة الأمر: ${usedPrefix + command}\n` +
                         `🅥🅘🅣🅞 🅑🅞🅣 💀`
            },
            { quoted: m }
        );

    } catch (error) {
        console.error(error);
        m.reply(`💀 *فشل في تحميل صورة البروفايل!*\n💀 ${error.message}\n🅥🅘🅣🅞 🅑🅞🅣 💀`);
    } finally {
        // إزالة تفاعل الانتظار 💀
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

// الأوامر
handler.help = ['getpp', 'getprofile', 'pp', 'بروفايله', 'بروفايلة'];
handler.command = /^(getpp|getprofile|pp|بروفايله|صورته)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.register = true;

export default handler;