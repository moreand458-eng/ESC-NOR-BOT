let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: 'https://img.randme.me/' },
    caption: `💀 *ميم عشوائي لك يا زعيم!*\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻💀`
  }, { quoted: m });
};

handler.help = ['meme', 'ميم'];
handler.command = ['meme', 'ميم'];
handler.tags = ['internet'];

export default handler;