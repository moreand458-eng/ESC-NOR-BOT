import axios from "axios";

const getJadwalSholat = async (kota) => {
    try {
        if (!kota) return { status: "error", message: "💀⚠️ يرجى إدخال اسم المدينة!" };

        const apiUrl = `https://www.velyn.biz.id/api/search/jadwalSholat?query=${encodeURIComponent(kota)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status) return { status: "error", message: `💀❌ لم يتم العثور على بيانات لمدينة ${kota}` };

        let result = {
            status: "success",
            imsak: data.data.imsak || "غير معروف",
            subuh: data.data.subuh || "غير معروف",
            dzuhur: data.data.dzuhur || "غير معروف",
            ashar: data.data.ashar || "غير معروف",
            maghrib: data.data.maghrib || "غير معروف",
            isya: data.data.isya || "غير معروف",
            all: data.data.all || [],
        };

        return result;
    } catch (error) {
        return { status: "error", message: `💀⚠️ حدث خطأ: ${error.message}` };
    }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`💀⚠️ يرجى إدخال اسم المدينة\n\nمثال: \`${usedPrefix + command} القاهرة\``);
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "⏱️", key: m.key },
        });

        let result = await getJadwalSholat(text);

        if (result.status !== "success") {
            return m.reply(result.message); // إظهار الرسالة المناسبة في حالة الخطأ
        }

        let message = `💀🕌 *جدول الصلاة - ${text.toUpperCase()}* 💀🕌\n\n` +
                      `🌅 *الإمساك:* ${result.imsak}\n` +
                      `☀ *الفجر:* ${result.subuh}\n` +
                      `🏙 *الظهر:* ${result.dzuhur}\n` +
                      `🌇 *العصر:* ${result.ashar}\n` +
                      `🌆 *المغرب:* ${result.maghrib}\n` +
                      `🌃 *العشاء:* ${result.isya}\n\n` +
                      `📅 *جدول اليوم:* \n`;

        result.all.forEach((item, index) => {
            message += `\n📆 *${item.tanggal}*\n` +
                       `   🕰 *الإمساك:* ${item.jadwal.imsak}\n` +
                       `   🌅 *الفجر:* ${item.jadwal.subuh}\n` +
                       `   🏙 *الظهر:* ${item.jadwal.dzuhur}\n` +
                       `   🌇 *العصر:* ${item.jadwal.ashar}\n` +
                       `   🌆 *المغرب:* ${item.jadwal.maghrib}\n` +
                       `   🌃 *العشاء:* ${item.jadwal.isya}\n`;
        });

        let imgUrl = "https://qu.ax/pDfXT.png"; // يمكنك تغيير الصورة حسب الحاجة

        await conn.sendMessage(m.chat, { image: { url: imgUrl }, caption: message }, { quoted: m });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
        });

    } catch (error) {
        console.error(error);
        m.reply("💀⚠️ حدث خطأ، يرجى المحاولة مرة أخرى لاحقًا.");
    }
};

handler.command = /^(sholat|صلاة|صلاه|الصلاة)$/i; // يدعم الأوامر بالإنجليزية والعربية
handler.help = ["sholat (اسم المدينة)", "صلاة (اسم المدينة)", "صلاه (اسم المدينة)", "الصلاة (اسم المدينة)"]; // مساعدة للمستخدم
handler.tags = ["tools"]; // تصنيف الأمر تحت الأدوات

export default handler;