import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];

    // ✅ رسالة بسيطة قبل القائمة
    await conn.sendMessage(m.chat, { text: '⏳ جاري تجهيز القائمة... 💀' }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });

    const images = [
        'https://ar-hosting.pages.dev/1760914992256.jpg',
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];
    var messa = await prepareWAMessageMedia({ image: { url: randomImage } }, { upload: conn.waUploadToServer });

    conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: `◦ مرحبا بك ${taguser} * 💀◈─🕷️〘𝑬𝑺𝑪𝑨𝑵𝑶𝑹〙🕷️─◈`
                    },
                    footer: {
                        text: '𝗕𝕪 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗠𝕠𝗱𝕤'
                    },
                    header: {
                        title: '',
                        hasMediaAttachment: true,
                        imageMessage: messa.imageMessage,
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: '『᯼ قائمة الأواﻣر 』',
                                    sections: [
                                        {
                                            title: '❪🐣┊مـهـام_الـبـوت┊🍡❫',
                                            highlight_label: '𝗕𝕪 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗠𝕠𝗱𝕤',
                                            rows: [
                                                { header: '🚀┊القسم الأول', title: '📡┊「قسم البحث والتنزيل」📥', id: '.قسم-البحث' },
                                                { header: '🎮┊القسم الثاني', title: '🎯┊「قسم الألعاب والفعاليات」☠️', id: '.قسم-الفعاليات' },
                                                { header: '🎭┊القسم الثالث', title: '🎲┊「قسم الترفيه والتسلية」🎉', id: '.قسم-الترفيه' },
                                                { header: '💻┊القسم الرابع', title: '👨‍💻┊「قسم البرمجه」🧠', id: '.قسم-برمجه' },
                                                { header: '⭐┊القسم الخامس', title: '🌍┊「قسم الدول والأطارات」🔍', id: '.قسم-دول' },
                                                { header: '💬┊القسم السادس', title: '🗨️┊「قسم المجموعات」📢', id: '.قسم-جروب' },
                                                { header: '📲┊القسم السابع', title: '🛜┊「قسم التحميل」📥', id: '.قسم-التحميلات' },
                                                { header: '🔊┊القسم الثامن', title: '🎙️┊「قسم الصوتيات」🔉', id: '.قسم-صوتيات' },
                                                { header: '🛠️┊القسم التاسع', title: '🧰┊「قسم الأدوات」🧱', id: '.قسم-الادوات' },
                                                { header: '📿┊القسم العاشر', title: '🤲🏻┊「قسم الديني」🕌', id: '.قسم-الدين' },
                                                { header: '📰┊القسم الحادي عشر', title: '🔍┊「قسم الأخبار والتواصل」📡', id: '.قسم-بحث' },
                                                { header: '🤖┊القسم الثاني عشر', title: '🧠┊「قسم الذكاء الاصطناعي」🤖', id: '.قسم-الذكاء' },
                                                { header: '👑┊القسم الثالث عشر', title: '🍫┊「قسم الألعاب」🍥', id: '.ق1' },
                                                { header: '💀┊القسم الرابع عشر', title: '🍨┊「قسم المشرفين」🍨', id: '.ق3' },
                                            ]
                                        }
                                    ]
                                }),
                                messageParamsJson: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗕𝕠𝘁'
                            },
                            { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"『 المطور👨🏻‍💻 』\",\"id\":\".المطور\"}" },
                            {
                                name: "cta_url",
                                buttonParamsJson: "{\"display_text\":\"『 قناة البوت 』\",\"url\":\"https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f\"}"
                            }
                        ]
                    }
                }
            }
        }
    }, {});
};

handler.command = ['اوامر', 'الاوامر', 'امر'];
export default handler;