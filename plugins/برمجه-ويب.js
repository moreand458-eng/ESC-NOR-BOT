import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // 💀 تحديد اسم الأمر المستخدم (عربي/إنجليزي)
    const commandName = command.toLowerCase();
    const isArabicCommand = commandName === 'عيي' || commandName === 'ويب';

    // 💀 رسالة المساعدة مع أمثلة
    const usageMessage = `
*💀 كيفية الاستخدام:*
▢ *${usedPrefix}${command}* <رابط الموقع>
▢ *مثال:* ${usedPrefix}${command} https://google.com

*💀 خيارات إضافية (متقدمة):*
▢ يمكنك تغيير أسماء الملفات (renameAssets)
▢ الحفاظ على هيكل الموقع (saveStructure)
▢ نسخة الموبايل (mobileVersion)
`.trim();

    if (!args[0]) {
        // 💀 رسالة خطأ مخصصة بناءً على الأمر المستخدم
        const errorMessage = isArabicCommand 
            ? '⚠️ *يجب عليك إدخال رابط الموقع أولاً!*\n\n' + usageMessage
            : '⚠️ *Please enter a website URL first!*\n\n' + usageMessage;
        return m.reply(errorMessage);
    }

    // 💀 إعلام المستخدم بأن العملية جارية
    const processingMessage = isArabicCommand
        ? '⏳ *جاري حفظ الموقع...*\nقد تستغرق العملية بعض الوقت حسب حجم الموقع 💀'
        : '⏳ *Saving website...*\nThis may take a while depending on the site size 💀';
    await m.reply(processingMessage);

    try {
        // 💀 إعداد خيارات الحفظ
        const options = {
            renameAssets: true,  // تغيير أسماء الملفات لتجنب التعارض
            saveStructure: false,  // الحفاظ على الهيكل (اختياري)
            alternativeAlgorithm: false,  // خوارزمية بديلة (اختياري)
            mobileVersion: false  // نسخة الموبايل (اختياري)
        };

        // 💀 استدعاء API لحفظ الموقع
        const result = await saveweb2zip(args[0], options);

        // 💀 إرسال الملف المضغوط للمستخدم
        await conn.sendMessage(m.chat, {
            document: { url: result.downloadUrl },
            fileName: `موقع_${args[0].replace(/https?:\/\//, '')}.zip`,
            mimetype: 'application/zip',
            caption: `✅ *تم حفظ الموقع بنجاح!*\n▢ *الرابط:* ${args[0]}\n▢ *عدد الملفات:* ${result.copiedFilesAmount}\n💀 *بواسطة إسِــــکْأّنِـوٌر بوت*`
        }, { quoted: m });

    } catch (error) {
        // 💀 رسالة خطأ في حالة فشل العملية
        const errorMsg = isArabicCommand
            ? `❌ *حدث خطأ أثناء حفظ الموقع!*\n▢ التفاصيل: ${error.message}\n💀 جرب مرة أخرى لاحقًا.`
            : `❌ *Failed to save the website!*\n▢ Details: ${error.message}\n💀 Please try again later.`;
        m.reply(errorMsg);
    }
};

// 💀 دالة حفظ الموقع كملف ZIP
async function saveweb2zip(url, options = {}) {
    if (!url) throw new Error('يجب تقديم رابط الموقع');
    url = url.startsWith('https://') ? url : `https://${url}`;

    const { data } = await axios.post('https://copier.saveweb2zip.com/api/copySite', {
        url,
        renameAssets: options.renameAssets,
        saveStructure: options.saveStructure,
        alternativeAlgorithm: options.alternativeAlgorithm,
        mobileVersion: options.mobileVersion
    }, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'origin': 'https://saveweb2zip.com',
            'referer': 'https://saveweb2zip.com/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
        }
    });

    // 💀 الانتظار حتى اكتمال العملية
    while (true) {
        const { data: process } = await axios.get(`https://copier.saveweb2zip.com/api/getStatus/${data.md5}`, {
            headers: {
                'accept': '*/*',
                'content-type': 'application/json',
                'origin': 'https://saveweb2zip.com',
                'referer': 'https://saveweb2zip.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });

        if (!process.isFinished) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        } else {
            return {
                url,
                error: {
                    text: process.errorText,
                    code: process.errorCode
                },
                copiedFilesAmount: process.copiedFilesAmount,
                downloadUrl: `https://copier.saveweb2zip.com/api/downloadArchive/${process.md5}`
            };
        }
    }
}

// 💀 الأوامر المتاحة
handler.command = /^(saveweb|web2zip|حفظ-موقع|ويب|عيي)$/i;

// 💀 توقيع البوت
handler.footer = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 💀';

export default handler;