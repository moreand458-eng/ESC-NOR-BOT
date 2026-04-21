import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {

    const apiUrl = "https://the-end-api.vercel.app/home/sections/Tools/api/matches/kora360";
    const response = await fetch(apiUrl);
    const jsonData = await response.json();


    const matches = jsonData.today;
    if (!matches || matches.length === 0) {
      return await conn.sendMessage(
        m.chat,
        { text: "*لا توجد مباريات مهمة اليوم 💔📢⚽️*" },
        { quoted: m }
      );
    }


    for (const match of matches) {
      const matchTitle = `${match.rightTeam.name} ضد ${match.leftTeam.name}`;


      await conn.sendMessage(
        m.chat,
        {
          image: { url: match.rightTeam.logo },
          caption: `*🏆 صورة الفريق رقم 1 : ${match.rightTeam.name}*`,
        },
        { quoted: m }
      );


      await conn.sendMessage(
        m.chat,
        {
          image: { url: match.leftTeam.logo },
          caption: `*🏆 صورة الفريق رقم 2 : ${match.leftTeam.name}*`,
        },
        { quoted: m }
      );


      const details = `
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*⚽️┊المباراة┊⇇『${matchTitle}』*
*⏰┊الوقت┊⇇『${match.time}』*
*🕯️┊الحاله┊⇇『${match.result}』*
*📺┊القناة┊⇇『${match.channel}』*
*🏟️┊الملعب┊⇇『${match.stadium}』*
*🏆┊الدوري┊⇇『${match.competition}』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
`;
      await conn.sendMessage(
        m.chat,
        { text: details },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      m.chat,
      { text: "🚨 حدث خطأ أثناء جلب المباريات، حاول لاحقًا أو تواصل مع المطورين." },
      { quoted: m }
    );
  }
};

handler.help = ["مباريات"];
handler.tags = ["sports"];
handler.command = /^(مباريات)$/i;

export default handler;