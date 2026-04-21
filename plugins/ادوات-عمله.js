import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { text, command, prefix }) => {
    if (!text) {
        return m.reply(`
💀 **إرشادات الاستخدام**:
لاستخدام الأمر، يرجى كتابة:

\`${prefix + command} |<المبلغ>|<العملة_من>|<العملة_إلى>\`

مثال:
\`.عمله |1000|USD|YER\`

**حيث**:
- \`1000\` هو المبلغ الذي تريد تحويله.
- \`USD\` هي العملة التي تريد التحويل منها (مثل الدولار الأمريكي).
- \`YER\` هي العملة التي تريد التحويل إليها (مثل الريال اليمني).

💀 **العملات المعترف بها دوليًا**:
- \`ILS\` - الك.يان الإسرائيلي (فلسطين🇵🇸)
- \`YER\` - الريال اليمني (اليمن)
- \`MAD\` - الدرهم المغربي (المغرب)
- \`USD\` - الدولار الأمريكي (الولايات المتحدة)
- \`SAR\` - الريال السعودي (السعودية)
- \`EGP\` - الجنيه المصري (مصر)
- \`SYP\` - الليرة السورية (سوريا)

💀 *تأكد من كتابة الرموز بشكل صحيح.*

𝒁𝑶𝑹𝑶 𝑩𝑶𝑻 𝚅¹💀
        `);
    }

    if (!text.includes('|') || text.split('|').length !== 4) {
        return m.reply(`💀 **الرجاء استخدام الصيغة الصحيحة:**
\`${prefix + command}|<المبلغ>|<العملة_من>|<العملة_إلى>\`

مثال: \`.عمله |1000|USD|YER\`
💀`);
    }

    let [commandText, amount, from, to] = text.split('|').map(v => v.trim().toUpperCase());
    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
        return m.reply("❌ **الرجاء إدخال مبلغ صحيح للتحويل.**");
    }

    async function convertCurrency(from, to) {
        const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const conversionText = $('div[data-testid="conversion"]').find('p.hVDvqw').text().trim();
            const numberMatch = conversionText.match(/([\d,\.]+)/);

            if (numberMatch) {
                return parseFloat(numberMatch[0].replace(/,/g, ''));
            } else {
                throw new Error('لم يتم العثور على بيانات التحويل');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // استخدم الميثود المناسبة لإرسال الرسائل بناءً على المكتبة التي تستخدمها
    await m.reply('⏳');

    try {
        let rate = await convertCurrency(from, to);
        const convertedAmount = (amount * rate).toFixed(2); // تم التعديل هنا على العملية من قسمة إلى ضرب

        m.reply(`💱 *تحويل العملة*\n\n📌 *مبلغ التحويل*: ${amount} ${from} = ${convertedAmount} ${to}\n🔗 *المصدر:* xe.com`);

        await m.reply('✅');

    } catch (err) {
        console.error(err);
        m.reply("❌ حدث خطأ أثناء جلب بيانات التحويل.");
    }
};

handler.help = ["عمله"];
handler.tags = ["ادوات"];
handler.command = /^(عمله)$/i;
handler.register = true;

export default handler;