const handler = async (m, { conn }) => {

    const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";

    const messageText = `

*『 مـــرحــبــاً بــك يــا ⌊ ${m.pushName} ⌉ فــي 『 𝑬𝑺𝑪𝑨𝑵𝑶𝑹-بوت 』』*

*⌝ قــســم الــصــوتــيــات ┋💀⌞ ⇊*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*

🗿┊⇇『 عــمــيــق 』
⛓‍💥┊⇇『 مـنـفـوخ 』
🎐┊⇇『 تــخــيــن 』
⚽┊⇇『 صــاخــب 』
📿┊⇇『 ســريــع 』
📍┊⇇『 تـخـيـنـن 』
🗃️┊⇇『 رفــيــع 』
📬┊⇇『 تـقـطـيـع 』
📕┊⇇『 روبــــوت 』
📆┊⇇『 بــطــيء 』
🗞️┊⇇『 نــاعــم 』
🐿️┊⇇『 سـنـجـاب 』

*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
> 『 𝑬𝑺𝑪𝑨𝑵𝑶𝑹-بـــوت 💗💛 』
`.trim();

    await conn.sendMessage(m.chat, { text: "*✦ جـــارٍ إرســال قــســم الــصــوتــيــات....... 💗📿*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });
};

handler.command = /^قسم-الصوتيات$/i;
handler.tags = ["إسِــــکْأّنِـوٌر"];
handler.help = ["إسِــــکْأّنِـوٌر"];

export default handler;