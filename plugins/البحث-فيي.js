// تحميل الفيديو فقط بصيغة mp4 باستخدام الأمر: فيي
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

async function getVideoData(url) {
  const form = new FormData();
  form.append('url', url);
  const info = (await axios.post('https://ytdown.siputzx.my.id/api/get-info', form, { headers: form.getHeaders() })).data;

  const downloadForm = new FormData();
  downloadForm.append('id', info.id);
  downloadForm.append('format', 'mp4');
  downloadForm.append('info', JSON.stringify(info));

  const dlRes = await axios.post('https://ytdown.siputzx.my.id/api/download', downloadForm, { headers: downloadForm.getHeaders() });

  if (!dlRes.data.download_url) throw new Error('فشل في جلب رابط التحميل');

  return {
    title: info.title,
    thumbnail: info.thumbnail,
    download_url: `https://ytdown.siputzx.my.id${dlRes.data.download_url}`
  };
}

async function optimizeVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(['-c:v libx264', '-preset ultrafast', '-crf 28', '-c:a aac', '-b:a 128k', '-movflags faststart'])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('💀 أرسل الرابط بعد الأمر\nمثال: فيي https://youtu.be/xxxx');

  try {
    m.reply('⏳ جاري تجهيز الفيديو...');
    const res = await getVideoData(args[0]);

    await conn.sendMessage(m.chat, {
      image: { url: res.thumbnail },
      caption: `🎬 *${res.title}*\n\n💀 جاري إرسال الفيديو...`
    }, { quoted: m });

    const tmp = tmpdir();
    const originalPath = join(tmp, `${Date.now()}_original.mp4`);
    const optimizedPath = join(tmp, `${Date.now()}_optimized.mp4`);

    const videoStream = await axios({ url: res.download_url, method: 'GET', responseType: 'stream' });
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(originalPath);
      videoStream.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await optimizeVideo(originalPath, optimizedPath);

    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(optimizedPath),
      fileName: `${res.title}.mp4`
    }, { quoted: m });

    await unlinkAsync(originalPath);
    await unlinkAsync(optimizedPath);

  } catch (err) {
    m.reply(`❌ خطأ: ${err.message}`);
  }
};

handler.help = ['فيي'];
handler.tags = ['downloader'];
handler.command = ['فيي'];

export default handler;