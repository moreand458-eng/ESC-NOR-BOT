import axios from 'axios';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const countries = {
     "المغرب": {
        capital: "الناظور",
         code: "MA",
          emoji: "🇲🇦"
    }, 
    "مصر": {
        capital: "القاهرة",
        code: "EG",
        emoji: "🇪🇬"
    },
    "السعودية": {
        capital: "الرياض",
        code: "SA",
        emoji: "🇸🇦"
    },
    "الإمارات": {
        capital: "ابوظبي",
        code: "AE",
        emoji: "🇦🇪"
    },
    "الكويت": {
        capital: "الكويت",
        code: "KW",
        emoji: "🇰🇼"
    },
    "قطر": {
        capital: "الدوحة",
        code: "QA",
        emoji: "🇶🇦"
    },
    "البحرين": {
        capital: "المنامة",
        code: "BH",
        emoji: "🇧🇭"
    },
    "عمان": {
        capital: "مسقط",
        code: "OM",
        emoji: "🇴🇲"
    },
    "الأردن": {
        capital: "عمان",
        code: "JO",
        emoji: "🇯🇴"
    },
    "لبنان": {
        capital: "بيروت",
        code: "LB",
        emoji: "🇱🇧"
    },
    "العراق": {
        capital: "بغداد",
        code: "IQ",
        emoji: "🇮🇶"
    },
    "اليمن": {
        capital: "صنعاء",
        code: "YE",
        emoji: "🇾🇪"
    },
    "سوريا": {
        capital: "Damascus",
        code: "SY",
        emoji: "🇸🇾"
    },
    "فلسطين": {
        capital: "القدس",
        code: "PS",
        emoji: "🇵🇸"
    },
    "ليبيا": {
        capital: "طرابلس",
        code: "LY",
        emoji: "🇱🇾"
    },
    "تونس": {
        capital: "تونس",
        code: "TN",
        emoji: "🇹🇳"
    },
    "الجزائر": {
        capital: "الجزائر",
        code: "DZ",
        emoji: "🇩🇿"
    },
    "السودان": {
        capital: "الخرطوم",
        code: "SD",
        emoji: "🇸🇩"
    },
    "موريتانيا": {
        capital: "نواكشوط",
        code: "MR",
        emoji: "🇲🇷"
    }
};

function convertTo12HourFormat(time) {
    const [hourString, minute] = time.split(':');
    let hour = parseInt(hourString, 10);
    const period = hour >= 12 ? 'مـسـائـاََ' : 'صـبـاحـاََ';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
}

const handler = async (m, { text, conn }) => {
    if (!text) {
        let countryButtons = Object.keys(countries).map((country, index) => ({
            header: country,
            title: `${countries[country].emoji} ${country}`,
            description: ``,
            id: `.مواقيت_الصلاة ${country}`
        }));

        const buttonMessage = {
            body: { text: '*∞┇━━━ •『💀』• ━━━┇∞*\n*_المرجو اختيار دولتك لي جلب مواقيت الصلاة 📿💗_*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*' },
            footer: { text: '' },
            header: {
                title: 'ㅤ',
                hasMediaAttachment: false
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: 'الدول المتوفــــره',
                            sections: [
                                {
                                    title: '🕋 - اخـتـر بـلـدك :',
                                    rows: countryButtons
                                }
                            ]
                        }),
                        messageParamsJson: ''
                    }
                ],
                messageParamsJson: ''
            }
        };

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: buttonMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } else {
        const country = text.trim();
        const countryInfo = countries[country];
        if (!countryInfo) {
            return m.reply('*🌙 : المعذرة ماحصلت*');
        }

        try {
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${countryInfo.capital}&country=${countryInfo.code}`);
            const data = response.data.data.timings;
            const fajr = convertTo12HourFormat(data.Fajr);
            const dhuhr = convertTo12HourFormat(data.Dhuhr);
            const asr = convertTo12HourFormat(data.Asr);
            const maghrib = convertTo12HourFormat(data.Maghrib);
            const isha = convertTo12HourFormat(data.Isha);

            const message = `
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*🕋┊توقيت الصلاة بمدينة┊⇇『 ${countryInfo.capital} 』*
*⌝ التوقيت ┋📿⌞ ⇊*
*🕋┊الفـــجر┊⇇『 ${fajr} 』*
*🕋┊الظـــهر┊⇇『 ${dhuhr} 』*
*🕋┊العصــــر┊⇇『 ${asr} 』*
*🕋┊المغـــرب┊⇇『 ${maghrib} 』*
*🕋┊العشــــاء┊⇇『 ${isha} 』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
> التوقيت حسب مدينة ${countryInfo.capital}`;

            m.reply(message);
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            m.reply('> *🌙 : ايرور.*');
        }
    }
};

handler.help = ['اذان'];
handler.tags = ['✨'];
handler.command = /^(مواقيت_الصلاة|وقت_الصلاة|وقت_الصلاه|مواقيت_الصلاه|مواقيت|اذان|الاذان)$/i;

export default handler;