/*
لا تحذف وسم، هذا خاص بـ Snapsave Plugins Esm

*[المصدر]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[مصدر سكربت]*

https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L/149
*/

import axios from 'axios';
import FormData from 'form-data';

const snapsave = {
  api: {
    base: "https://snapsave.app",
    download: "/action.php?lang=id"
  },

  headers: {
    'authority': 'snapsave.app',
    'origin': 'https://snapsave.app',
    'referer': 'https://snapsave.app/id',
    'user-agent': 'Postify/1.0.0'
  },

  regex: {
    instagram: /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv|stories)\/([^/?#&]+)/i,
    facebook: /^https?:\/\/(www\.|web\.|m\.)?(facebook\.com|fb\.watch|fb\.com)\/.+/i,
    tiktok: /^https?:\/\/((?:vm|vt|www|m)\.)?tiktok\.com\/.+/i
  },

  isPlatform: (url) => {
    if (!url) return null;
    for (const [platform, pattern] of Object.entries(snapsave.regex)) {
      if (pattern.test(url)) return platform;
    }
    return null;
  },

  decode: (h, u, n, t, e) => {
    let result = '';
    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    
    for (let i = 0; i < h.length; i++) {
      let segment = '';
      while (i < h.length && h[i] !== n[e]) segment += h[i++];
      
      for (let j = 0; j < n.length; j++) {
        segment = segment.replace(new RegExp(n[j], 'g'), j.toString());
      }
      
      try {
        let decimal = segment.split('').reverse().reduce((acc, char, idx) => {
          const charIndex = charset.slice(0, e).indexOf(char);
          return charIndex !== -1 ? acc + charIndex * Math.pow(e, idx) : acc;
        }, 0);
        
        const charCode = decimal - t;
        if (charCode >= 0) result += String.fromCharCode(charCode);
      } catch (err) {
        return { status: false, code: 500, result: { error: "فشل في فك التشفير، حاول مرة أخرى 🤫", message: err.message }};
      }
    }
    
    try {
      return { status: true, code: 200, result: { media: decodeURIComponent(escape(result)) }};
    } catch (err) {
      return { status: true, code: 200, result: { media: result }};
    }
  },

  extract: (media, platform) => {
    try {
      const mediax = {
        image: [],
        video: [],
        thumbnail: null
      };

      const section = media.match(/download-section"\).innerHTML = "(.*?)";/);
      if (!section) return { status: false, code: 404, result: { error: "القسم الخاص بالتنزيل غير موجود 😬", media: null }};

      const mediax_raw = section[1].replace(/\\"/g, '"').replace(/\\\//g, '/');
      
      const thumb = mediax_raw.match(/<img src="([^"]+)"/);
      if (thumb) {
        mediax.thumbnail = thumb[1];
      }
      
      const title = mediax_raw.match(/<strong>(.*?)<\/strong>/);
      const filename = title ? title[1] : 'media';
      
      if (platform === 'facebook' || platform === 'instagram') {
        const urlRegex = /https:\/\/d\.rapidcdn\.app\/d\?token=[^"]+/g;
        const b = mediax_raw.matchAll(urlRegex);

        for (const match of b) {
          const url = match[0];
          const toket = JSON.parse(Buffer.from(url.split('token=')[1].split('.')[1], 'base64').toString());

          const items = {
            url: url + '&dl=1',
            filename: filename + (toket.filename.match(/\.[^.]+$/)?.[0] || ''),
            quality: toket.quality || 'SD'
          };

          if (toket.filename.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            mediax.image.push(items);
          } else if (toket.filename.toLowerCase().endsWith('.mp4')) {
            mediax.video.push(items);
          }
        }
      } else if (platform === 'tiktok') {
        const urlRegex = /https:\/\/snapxcdn\.com\/v2\/\?token=[^&]+/g;
        const b = media.match(urlRegex);

        if (b) {
          b.forEach(match => {
            mediax.video.push({
              url: match,
              filename: `${filename}.mp4`,
              quality: 'HD'
            });
          });
        }
      }

      return { status: true, code: 200, result: { error: "تم استخراج الوسائط بنجاح", media: mediax }};
    } catch (error) {
      return { status: false, code: 500, result: { error: "لا يمكن استخراج الوسائط من الرابط 🤷🏻", message: error.message }};
    }
  },

  download: async (url) => {
    if (!url) return { status: false, code: 400, result: { error: "أين الرابط؟ قم بإدخاله! 🗿" }};

    const platform = snapsave.isPlatform(url);
    if (!platform) return { status: false, code: 400, result: { error: "الرابط غير صالح، حاول إدخال رابط صحيح 🗿" }};

    try {
      const formData = new FormData();
      formData.append('url', url);

      const response = await axios.post(`${snapsave.api.base}${snapsave.api.download}`, formData, { headers: snapsave.headers });
      const b = response.data.match(/eval\(function\(h,u,n,t,e,r\){.*?"(.*?)",(\d+),"(.*?)",(\d+),(\d+),(\d+)\)\)/);

      if (!b) return { status: false, code: 404, result: { error: "بيانات التشفير غير موجودة 🙃" }};

      const [_, encodedStr, u, n, t, e] = b;
      const decoded = snapsave.decode(encodedStr, parseInt(u), n, parseInt(t), parseInt(e));
      if (!decoded.status) return decoded;
      
      const medias = snapsave.extract(decoded.result.media, platform);
      if (!medias.status) return medias;

      return { 
        status: true, 
        code: 200, 
        result: {
          platform,
          media: medias.result.media
        }
      };

    } catch (error) {
      return { status: false, code: error.response?.status || 500, result: { error: error.message }};
    }
  }
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return m.reply(`يرجى إدخال الرابط! يمكنك التنزيل من عدة مواقع مثل:
  - TikTok
  - Instagram
  - Facebook
  
  مثال: ${usedPrefix + command} https://vt.tiktok.com/ZSMW9hSXf/`);
    }

    m.react('⌛');
    const url = args[0];
    
    const result = await snapsave.download(url);
    
    if (!result.status) {
      return m.reply(`${result.result.error}`);
    }
    
    const { platform, media } = result.result;
    let mediaFound = false;
    
    if (platform === 'instagram' || platform === 'facebook') {
      if (media.image && media.image.length > 0) {
        mediaFound = true;
        for (let i = 0; i < media.image.length; i++) {
          const img = media.image[i];
          await conn.sendMessage(m.chat, { 
            image: { url: img.url }
          }, { quoted: m });
        }
      }
      
      if (media.video && media.video.length > 0) {
        mediaFound = true;
        const vid = media.video[0];
        await conn.sendMessage(m.chat, {
          video: { url: vid.url }
        }, { quoted: m });
      }
    } else if (platform === 'tiktok') {
      if (media.video && media.video.length > 0) {
        mediaFound = true;
        const vid = media.video[0];
        await conn.sendMessage(m.chat, {
          video: { url: vid.url }
        }, { quoted: m });
      }
    }
    
    if (!mediaFound) {
      return m.reply(`لا توجد وسائط لتحميلها`);
    }
    
    m.react('✅');
    
  } catch (error) {
    console.error(error);
    m.reply(`حدث خطأ: ${error.message}`);
  }
};

handler.help = [' <url>', 'سناب-سيف <url>', 'سناب-سافيوم <url>'];
handler.tags = ['downloader'];
handler.command = /^(snapsave|ss|snap|سناب-سيف|سناب-سافيوم)$/i;

export default handler;