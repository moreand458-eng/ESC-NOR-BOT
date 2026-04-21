import axios from 'axios';
import fs from 'fs';

let handler = async (m, { conn, text }) => {

  if (!text) {
    return conn.reply(m.chat, '*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تقديم بعد الامر يوزر المستخدم تليجرام لي جلب معلومات عن الحساب*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*', m);
  }

  const username = text.replace('@', '').trim();
  const apiUrl = `https://t.me/${username}`;


  await conn.reply(m.chat, '🔄 *جاري جلب معلومات الحساب...*', m);

  try {

    const response = await axios.get(apiUrl);
    const pageContent = response.data;


    const nameMatch = pageContent.match(/property="og:title" content="(.*)"/);
    const bioMatch = pageContent.match(/property="og:description" content="(.*)"/);
    const photoMatch = pageContent.match(/property="og:image" content="(.*)"/);

    if (!nameMatch || !bioMatch || !photoMatch) {
      return conn.reply(m.chat, '❌ *لم يتم العثور على معلومات الحساب يا اخي*', m);
    }

    const userInfo = {
      username: `@${username}`,
      name: nameMatch[1],
      bio: bioMatch[1],
      photo: photoMatch[1],
    };


    const photoResponse = await axios({
      url: userInfo.photo,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const photoPath = './temp-photo.jpg';
    fs.writeFileSync(photoPath, photoResponse.data);


    await conn.sendMessage(m.chat, {
      image: fs.readFileSync(photoPath),
      caption: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*🔱┊المستخدم┊⇇『${userInfo.username}』*
*🌐┊الاسم┊⇇『${userInfo.name}』*
*💎┊الوصف┊⇇『${userInfo.bio}』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`,
    });


    fs.unlinkSync(photoPath);
  } catch (error) {
    console.error('❌ خطأ أثناء جلب معلومات الحساب:', error.message);
    conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة جلب معلومات الحساب.', m);
  }
};


handler.command = ['تلي'];

export default handler;