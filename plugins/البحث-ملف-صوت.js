import axios from "axios";
import ytSearch from "yt-search";

async function fetchAudio(linkOrQuery) {
  let isLink = /https?:\/\/(www\.)?youtu(\.be|be\.com)/.test(linkOrQuery);
  let video, link;

  if (isLink) {
    link = linkOrQuery;
    video = {
      title: "من رابط مباشر",
      author: { name: "غير معروف" },
      thumbnail: `https://i.ytimg.com/vi/${new URL(link).searchParams.get("v")}/hqdefault.jpg`
    };
  } else {
    const search = await ytSearch(linkOrQuery);
    video = search.videos[0];
    if (!video) throw new Error("لا يمكن العثور على الفيديو");
    link = video.url;
  }

  const apis = [
    `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
    `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`
  ];

  for (let api of apis) {
    try {
      const { data } = await axios.get(api);
      if (data.status === 200 || data.success) {
        return {
          title: data.result?.title || video.title,
          author: data.result?.author || video.author.name,
          thumbnail: data.result?.image || video.thumbnail,
          audioUrl: data.result?.downloadUrl || data.url
        };
      }
    } catch {}
  }

  throw new Error("فشل تحميل الصوت");
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("💀 *اكتب عنوان أو رابط يوتيوب*\nمثال: `ملف-صوت سورة النازعات رعد الكردي\nاو\nملف-صوت https://youtube.com/watch?v=1LSKA6wWHIg`");

  await m.reply("💀 *جارٍ تحميل ملف الصوت...*");

  try {
    let song = await fetchAudio(text);

    await conn.sendMessage(m.chat, {
      image: { url: song.thumbnail },
      caption: `🎵 *العنوان:* ${song.title}\n\n💀 *𝑽𝒊𝒕𝒐-𝑩𝑶𝑻*`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      document: { url: song.audioUrl },
      mimetype: "audio/mp3",
      fileName: `${song.title}.mp3`
    }, { quoted: m });

  } catch (e) {
    await m.reply("❌ 💀 حصل خطأ: " + e.message);
  }
};

handler.command = /^ملف-صوت|playdoc$/i;
handler.help = ["ملف-صوت", "playdoc"];
handler.tags = ["downloader"];
export default handler;