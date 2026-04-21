/*
`كود جلب صور اسلحة فري فاير` ✅❤

BY OBITO 

https://whatsapp.com/channel/0029VaDZKjd4Crfr1QOOlJ2D

*/

import fetch from 'node-fetch';
import cheerio from 'cheerio';

let obito = async (m, { conn, args, command, text, usedPrefix }) => {

  const weapons = [
{ title: 'AK-47', id: 'ak47', type: 'سلاح هجومي' },
{ title: 'M4A1', id: 'm4a1', type: 'سلاح هجومي' },
{ title: 'M16', id: 'm16', type: 'سلاح هجومي' },
{ title: 'SCAR', id: 'scar', type: 'سلاح هجومي' },
{ title: 'UMP', id: 'ump', type: 'سلاح فرعي' },
{ title: 'Vector', id: 'vector', type: 'سلاح فرعي' },
{ title: 'Groza', id: 'groza', type: 'سلاح هجومي' },
{ title: 'AUG', id: 'aug', type: 'سلاح هجومي' },
{ title: 'AWM', id: 'awm', type: 'قناص' },
{ title: 'Kar98', id: 'kar98', type: 'قناص' },
{ title: 'M24', id: 'm24', type: 'قناص' },
{ title: 'FAMAS', id: 'famas', type: 'سلاح هجومي' },
{ title: 'XM8', id: 'xm8', type: 'سلاح هجومي' },
{ title: 'M1014', id: 'm1014', type: 'بندقية قنص' },
{ title: 'SPAS12', id: 'spas12', type: 'بندقية قنص' },
{ title: 'MP5', id: 'mp5', type: 'سلاح فرعي' },
{ title: 'P90', id: 'p90', type: 'سلاح فرعي' },
{ title: 'Thompson', id: 'thompson', type: 'سلاح فرعي' },
{ title: 'Desert Eagle', id: 'deagle', type: 'مسدس' },
{ title: 'M1873', id: 'm1873', type: 'مسدس' },
{ title: 'G18', id: 'g18', type: 'مسدس' },
{ title: 'M500', id: 'm500', type: 'مسدس' },
{ title: 'M60', id: 'm60', type: 'سلاح رشاش' },
{ title: 'MP40', id: 'mp40', type: 'سلاح فرعي' },
{ title: 'KAR98K', id: 'kar98k', type: 'قناص' },
{ title: 'M249', id: 'm249', type: 'سلاح رشاش' },
{ title: 'SCAR-L', id: 'scar-l', type: 'سلاح هجومي' },
{ title: 'AN94', id: 'an94', type: 'سلاح هجومي' },
{ title: 'ParaFAL', id: 'parafal', type: 'سلاح هجومي' },
{ title: 'M14', id: 'm14', type: 'سلاح هجومي' },
{ title: 'F2000', id: 'f2000', type: 'سلاح هجومي' },
{ title: 'KAC', id: 'kac', type: 'سلاح هجومي' },
{ title: 'M82', id: 'm82', type: 'قناص' },
{ title: 'VSS', id: 'vss', type: 'قناص' },
{ title: 'AWM 98', id: 'awm98', type: 'قناص' },
{ title: 'FAMAS G2', id: 'famas-g2', type: 'سلاح هجومي' },
{ title: 'Type 25', id: 'type25', type: 'سلاح هجومي' },
{ title: 'AK-47 Gold', id: 'ak47-gold', type: 'سلاح هجومي' },
{ title: 'M60 Gold', id: 'm60-gold', type: 'سلاح رشاش' },
{ title: 'XM1014', id: 'xm1014', type: 'بندقية قنص' },
{ title: 'M870', id: 'm870', type: 'بندقية قنص' },
{ title: 'S1887', id: 's1887', type: 'بندقية قنص' },
{ title: 'M99', id: 'm99', type: 'قناص' },
{ title: 'MP7', id: 'mp7', type: 'سلاح فرعي' },
{ title: 'AK-5', id: 'ak5', type: 'سلاح هجومي' },
{ title: 'SG-553', id: 'sg553', type: 'سلاح هجومي' },
{ title: 'UMP-45', id: 'ump45', type: 'سلاح فرعي' },
{ title: 'PUMP', id: 'pump', type: 'بندقية قنص' },
{ title: 'SVD', id: 'svd', type: 'قناص' },
{ title: 'M4 Super 90', id: 'm4-super90', type: 'بندقية قنص' },
{ title: 'AK-103', id: 'ak103', type: 'سلاح هجومي' },
{ title: 'AUG A3', id: 'aug-a3', type: 'سلاح هجومي' },
{ title: 'F2000 Gold', id: 'f2000-gold', type: 'سلاح هجومي' },
{ title: 'Bizon', id: 'bizon', type: 'سلاح فرعي' },
{ title: 'M79', id: 'm79', type: 'قناص' },
{ title: 'PL-15', id: 'pl15', type: 'مسدس' },
{ title: 'RARE SWORD', id: 'rare-sword', type: 'سلاح غير ناري' },
{ title: 'هيل بوجي', id: 'hill-bougie', type: 'سلاح غير ناري' },
{ title: 'UZI', id: 'uzi', type: 'سلاح فرعي' },
{ title: 'PPSH', id: 'ppsh', type: 'سلاح فرعي' },
{ title: 'MAG-7', id: 'mag7', type: 'بندقية قنص' },
{ title: 'Cable', id: 'cable', type: 'سلاح غير ناري' },
{ title: 'M1911', id: 'm1911', type: 'مسدس' },
{ title: 'RPG', id: 'rpg', type: 'صاروخ' },
{ title: 'M84', id: 'm84', type: 'سلاح غير ناري' },
  ];

  if (!text) {

    const buttons = weapons.map((weapon) => ({
      header: '',
      title: `${weapon.title} - ${weapon.type}`,
      description: `اســم السلاح ${weapon.title} | نوعه ${weapon.type}`,
      id: `.صور-سلاح ${weapon.title}`,
    }));

    const message = {
      interactiveMessage: {
        header: {
          title: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n⚔️ *اختر سلاحك المفضل*`,
        },
        body: {
          text: `📜 *المرجو اختيار السلاح الذي تريد جلب صور له*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`,
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: '🏹 قسم الأسلحة',
                sections: [
                  {
                    title: 'اختر الســــلاح',
                    highlight_label: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 BOT',
                    rows: buttons,
                  },
                ],
              }),
              messageParamsJson: '',
            },
          ],
        },
      },
    };

    return conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
  }


  conn.reply(m.chat, '*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تحلي بصبر، جاري جلب صورة السلاح......*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*', m);
  try {
    const hasil = await pinterest(text);
    let gambarUrl = hasil[0];
    let imageRes = await fetch(gambarUrl);
    let imageBuffer = await imageRes.buffer();
    await conn.sendFile(m.chat, imageBuffer, 'obito.jpg', `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*صورة سلاح : ${text} 🧡*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`);
  } catch (e) {
    console.log(e);
    conn.reply(m.chat, 'حدث خطأ أثناء جلب صوره يا اخي.', m);
  }
};

obito.help = ['اوبيتو'];
obito.tags = ['اوبيتو'];
obito.command = ['سلاح', 'صور-سلاح'];

export default obito;


async function pinterest(text) {
  try {
    const response = await fetch(`https://id.pinterest.com/search/pins/?autologin=true&q=${encodeURIComponent(text)}`, {
      headers: {
        "cookie": "_auth=1; _b=\"AXOtdcLOEbxD+qMFO7SaKFUCRcmtAznLCZY9V3z9tcTqWH7bPo637K4f9xlJCfn3rl4=\"; _pinterest_sess=TWc9PSZWcnpkblM5U1pkNkZ0dzZ6NUc5WDZqZEpGd2pVY3A0Y2VJOGg0a0J0c2JFWVpQalhWeG5iTTRJTmI5R08zZVNhRUZ4SmsvMG1CbjBWUWpLWVFDcWNnNUhYL3NHT1EvN3RBMkFYVUU0T0dIRldqVVBrenVpbGo5Q1lONHRlMzBxQTBjRGFSZnFBcTdDQVgrWVJwM0JtN3VRNEQyeUpsdDYreXpYTktRVjlxb0xNanBodUR1VFN4c2JUek1DajJXbTVuLzNCUDVwMmRlZW5VZVpBeFQ5ZC9oc2RnTGpEMmg4M0Y2N2RJeVo2aGNBYllUYjRnM05VeERzZXVRUVVYNnNyMGpBNUdmQ1dmM2s2M0txUHRuZTBHVFJEMEE1SnIyY2FTTm9DUEVTeWxKb3V0SW13bkV3TldyOUdrdUZaWGpzWmdaT0JlVnhWb29xWTZOTnNVM1NQSzViMkFUTjBpRitRRVMxaUFxMEJqell1bVduTDJid2l3a012RUgxQWhZT1M3STViSVkxV0dSb1p0NTBYcXlqRU5nPT0ma25kRitQYjZJNTVPb2tyVnVxSWlleEdTTkFRPQ==; _ir=0"
      }
    });
    const data = await response.text();
    const $ = cheerio.load(data);
    const result = [];
    const hasil = [];
    $('div > a').get().map(b => {
      const link = $(b).find('img').attr('src');
      result.push(link);
    });
    result.forEach(v => {
      if (v && v.includes('236')) {
        hasil.push(v.replace(/236/g, '736'));
      }
    });
    hasil.shift();
    return hasil;
  } catch (error) {
    throw error;
  }
}