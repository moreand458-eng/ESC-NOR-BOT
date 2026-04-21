var handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('🔒 هذا الأمر يعمل فقط داخل المجموعات.');

    const groupMetadata = await conn.groupMetadata(m.chat);

    // 🔍 عرض المشاركين وأدوارهم في الكونسول (لأغراض الديباغ)
    console.log('🔎 المشاركون في المجموعة:');
    groupMetadata.participants.forEach(p => {
        console.log(`- ${p.id} admin: ${p.admin || 'عضو'}`);
    });

    // 🔍 معلومات المرسل
    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    console.log('🔎 معلومات المستخدم المرسل:', userParticipant);

    // ✅ التحقق إذا كان أدمن أو مالك
    const isUserAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin' || m.sender === groupMetadata.owner;
    if (!isUserAdmin) {
        return m.reply('❌ هذا الأمر مخصص فقط للمشرفين.');
    }

    // 👤 تحديد المستخدم الذي سيتم ترقيته
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ الرقم الذي أدخلته غير صالح.');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('🚫 من فضلك منشن أو رد على رسالة المستخدم أو أدخل رقمه.');
    }

    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) return m.reply(`😅 لا يمكنني ترقية نفسي.`);
    if (user === ownerGroup) return m.reply(`👑 هذا هو مالك المجموعة بالفعل.`);
    if (user === ownerBot) return m.reply(`💥 هذا هو مالك البوت.`);

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        await m.reply(`✅ تم ترقية المستخدم إلى مشرف بنجاح 🎉`);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ لم أستطع ترقية المستخدم. تأكد أن البوت لديه صلاحيات.`);
    }
};

handler.help = ['promote'];
handler.tags = ['group'];
handler.command = ['رفع', 'ترقية', 'ترقيه', 'ارفعو', 'رول'];
handler.register = true;

export default handler;