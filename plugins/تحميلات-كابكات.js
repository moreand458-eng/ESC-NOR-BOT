import axios from "axios"
import cheerio from "cheerio"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*_المرجو توفير رابط فيديو من موقع capcut لي تحميله 🪄💗📚_*\n*على سبيل المثال*\n.كابكات https://www.capcut.com/t/Zs8F2jgx7\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`;
  m.reply(wait);
  try {
    let res = await capcut(text);
    conn.sendFile(
      m.chat,
      res.video,
      null,
      `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*_تم تحميل الفيديو من كابكات بنجاح ✅🪄_*\n*⌝ رابط صورة المصغره ┋📚⌞ ⇊*\n ${res.thumbnail}\n*⌝ رابط الفيديو ┋💀⌞ ⇊*\n${text}\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`,
      m,
    );
  } catch (e) {}
};
handler.help = ["capcut"].map((a) => a + "");
handler.tags = ["اوبيتو"];
handler.command = ["كابكات"];
export default handler;

async function capcut(url) {
  const response = await fetch(url);
  const data = await response.text();
  const $ = cheerio.load(data);

  return {
    thumbnail: $("video").attr("poster"),
    video: $("video").attr("src"),
  };
}