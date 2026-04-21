import yts from 'yt-search';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { command, usedPrefix, conn, text }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { text: `❗ *يرجى إدخال نص أو رابط للبحث في يوتيوب.*\n\n> *مثال :*\n◐   *${usedPrefix + command}* مروان بابلو\n◐  *${usedPrefix + command}* https://youtu.be/example` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        let query = text.trim();

        // التحقق مما إذا كان النص رابط يوتيوب
        const videoId = extractYouTubeID(query);
        if (videoId) {
            query = `https://www.youtube.com/watch?v=${videoId}`;
        }

        const yt_play = await yts.search(query);
        if (!yt_play.videos.length) throw new Error("لم يتم العثور على نتائج.");

        const video = yt_play.videos[0];

        const dataMessage = 
`☘️ *نتيجة البحث عن :* 『 ${text} 』
*ـ↺⟣┈┈┈┈┈⟢  🍨  ⟣┈┈┈┈┈⟢↻ـ*
> *🎬 الــعـــنــوان :* ${video.title}
> *📅 الــــنـــشـــر :* ${video.ago}
> *⏱️ الـــــمـــــدة :* ${secondString(video.duration.seconds)}
> *👁️‍🗨️ المشاهدات :* ${MilesNumber(video.views)}
> *📺 الــــقــنـــاة :* ${video.author.name}
> *🔗 الــلــيــنــك :* ${video.url}
*ـ↺⟣┈┈┈┈┈⟢  🍨  ⟣┈┈┈┈┈⟢↻ـ*`;

        const thumbnail = await prepareWAMessageMedia({ image: { url: video.thumbnail } }, { upload: conn.waUploadToServer });

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: dataMessage },
                        footer: { text: `ـ〆⚡︱ 𝐖 Ꭵ 𝐒 𝐊 𝐘 𐎉 𝐎𝐖𝐍𝐄𝐑 ︱⚡〆ـ`.trim() },
                        header: {
                            hasMediaAttachment: true,
                            imageMessage: thumbnail.imageMessage,
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'ム↻ تــحـمـيـل الـصــوت ↺ム', id: `${usedPrefix}صوت ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'ム↻ تــحـمـيـل الـفـيـديــو ↺ム', id: `${usedPrefix}فيديو ${video.url}` }) }
                            ],
                            messageParamsJson: "",
                        },
                    },
                },
            },
        }, { userJid: conn.user.jid, quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (error) {
        await conn.sendMessage(m.chat, { text: `❌ *حدث خطأ أثناء البحث.*\n\n🔍 *يرجى تجربة البحث باستخدام نص أو رابط صحيح.*` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};

handler.command = /^(شغل)$/i;
export default handler;

// دالة لاستخراج معرف الفيديو من أي رابط يوتيوب
function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function MilesNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function secondString(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + " ساعة " : ""}${m > 0 ? m + " دقيقة " : ""}${s > 0 ? s + " ثانية" : ""}`.trim();
}