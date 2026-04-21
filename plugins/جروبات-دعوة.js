let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) throw `💀 _كيفية استخدام الأمر "دعوة":_ \n\n🔹 _هذا الأمر يسمح لك بإرسال رابط دعوة إلى رقم محدد لدخول المجموعة._ \n\n📌 _طرق الاستخدام:_ \n1️⃣ _أدخل الرقم الذي تريد إرسال رابط الدعوة إليه مباشرة مع الأمر:_ \n   \`${usedPrefix}${command} 212662023605\`\n\n⚠️ _ملاحظات مهمة:_ \n- _لا تستخدم علامة (+) مع الرقم._ \n- _يجب إدخال الرقم دون مسافات أو أي رموز إضافية._ \n\n📌 _الناتج:_ \n- _يقوم البوت بإنشاء رابط الدعوة الخاص بالمجموعة، ثم يرسله إلى الرقم المحدد._ \n- _يرسل رسالة تأكيد بأن الدعوة تمت بنجاح._ \n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀\n\nميزة رائعة لدعوة الأعضاء إلى المجموعة بسهولة😊`
if (text.includes('+')) throw  `*لا تــضـع هـذه الـعـلـامـه +*`
if (isNaN(text)) throw '*دخــل الـرقـم بـدـون مـسافـات !*'
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

      await conn.reply(text+'@s.whatsapp.net', `احد الاشخاص دعاء الى الانضمام الى احد المجموعات 💙🌙\nرابط : ${link}`, m, {mentions: [m.sender]})
        m.reply(`*تــم ارســال رابــط الـدعـوه بنجاح يا اخي*`) 

}
handler.help = ['invite <20xxx>']
handler.tags = ['group']
handler.command = ['دعوة','دعوه'] 
handler.group = true
handler.admin = false
handler.botAdmin = true

export default handler