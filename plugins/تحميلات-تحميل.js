import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';
import axios from 'axios';

const handler = async (m, { command, usedPrefix, conn, text }) => {
    if (!text || !/^https?:\/\//i.test(text)) {
        await conn.sendMessage(m.chat, {
            text: `❗ *إدخال رابط صالح.*\n\n📝 *مثال:*\n➤ ${usedPrefix + command} https://vt.tiktok.com/ZShmEuUh3/`
        }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let thumbnailUrl = '';
    try {
        const { data } = await axios.get(text, { headers: { 'User-Agent': 'WhatsApp Bot' } });
        const match = data.match(/<meta property="og:image" content="([^"]+)"/);
        if (match) thumbnailUrl = match[1];
    } catch (e) {
        console.log('تعذر استخراج صورة المصغرة:', e);
    }

    let thumbnail;
    if (thumbnailUrl) {
        try {
            thumbnail = await prepareWAMessageMedia(
                { image: { url: thumbnailUrl } },
                { upload: conn.waUploadToServer }
            );
        } catch (e) {
            console.log('فشل تحميل الصورة:', e);
        }
    }

    const labels = [
        ['▶️  اليوتيوب', 'فيديو'],
        ['📱  تيك توك', 'تيك'],
        ['📘  فيسبوك', 'فيس'],
        ['📸  انستجرام', 'انستا'],
        ['📽️  كابكات', 'كابكات'],
        ['🧊  تويتر', 'تويتر'],
        ['🗂️ ميديافاير', 'ميديافاير'],
        ['📁  ميجا', 'ميجا'],
        ['💻 جيتهاب', 'جيتهاب'],
        ['📦 APK', 'apk'],
        ['🟢  سنك', 'سنك'],
        ['☁️  تيرابوكس', 'تيرا'],
        ['🎧  ساوند كلاود', 'ساوند'],
        ['🧪 فحص الموقع', 'فحص'],
        ['🖼️ سكرين', 'سكرين'],
        
    ];

    const buttons = labels.map(([display, cmd]) => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
            display_text: display,
            id: `${usedPrefix}${cmd} ${text}`
        })
    }));

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: `🔗 *الرابط الذي استخدمته:*\n${text}\n\n📥 *اختر مصدر الرابط من الازرار في الاسفل:*`
                    },
                    footer: { text: `𝑽𝒊𝒕𝒐-𝑩𝑶𝑻 💀` },
                    header: thumbnail
                        ? {
                              hasMediaAttachment: true,
                              imageMessage: thumbnail.imageMessage,
                          }
                        : { hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons,
                        messageParamsJson: ""
                    }
                }
            }
        }
    }, { userJid: conn.user.jid, quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
};

handler.command = /^(تحميل)$/i;
export default handler;