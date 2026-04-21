import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { text }) => {
  if (!/^https?:\/\//.test(text)) throw '💀 يجب أن يبدأ الرابط بـ http:// أو https://';

  const url = text; // استخدام الرابط كما هو
  const res = await fetch(url);

  if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
    throw `💀 الملف كبير جدًا! Content-Length: ${res.headers.get('content-length')}`;
  }

  if (!/text|json/.test(res.headers.get('content-type')))
    return conn.sendFile(m.chat, url, 'file', text, m);

  let txt = await res.buffer();

  try {
    txt = format(JSON.parse(txt + ''));
  } catch (e) {
    txt = txt + '';
  } finally {
    m.reply(txt.slice(0, 65536) + '');
  }
};

handler.help = ['fetch', 'get', 'احضر'].map((v) => v + ' <الرابط>');
handler.tags = ['internet'];
handler.command = /^(fetch|get|احضر)$/i;
handler.premium = true;

export default handler;