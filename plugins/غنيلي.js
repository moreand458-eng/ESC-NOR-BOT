import axios from "axios";

class SunoAPI {
  constructor() {
    this.baseURL = "https://suno.exomlapi.com";
    this.headers = {
      accept: "*/*",
      "content-type": "application/json",
      origin: "https://suno.exomlapi.com",
      referer: "https://suno.exomlapi.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
};
    this.interval = 3000;
    this.timeout = 300000;
}

  async generate({ prompt}) {
    let taskId, token;
    try {
      const generateResponse = await axios.post(`${this.baseURL}/generate`, { prompt}, {
        headers: this.headers
});
      ({ taskId, token} = generateResponse.data);

      const startTime = Date.now();
      while (Date.now() - startTime < this.timeout) {
        await new Promise(resolve => setTimeout(resolve, this.interval));
        const statusResponse = await axios.post(`${this.baseURL}/check-status`, {
          taskId,
          token
}, { headers: this.headers});

        if (statusResponse.data.results?.every(res => res.audio_url && res.image_url && res.lyrics)) {
          return statusResponse.data;
}
}
      return { status: "timeout"};
} catch (error) {
      return {
        status: "error",
        error: error.message
};
}
}
}

let handler = async (m, { conn, text}) => {
  if (!text) return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تقديم بعد الامر وصف الاغنيه*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

  m.reply("جاري انشاء الاغنيه..... ، قد تتأخر قليلا كن صبورا ❤");

  const api = new SunoAPI();
  const result = await api.generate({ prompt: text});

  if (result.status === "error") return m.reply(`خطأ: ${result.error}`);
  if (result.status === "timeout") return m.reply("انتهت مدة المعالجه و لم اجد ولا نتيجه ، حاول مره اخرى");

  for (let item of result.results) {

    await conn.sendMessage(m.chat, {
      audio: { url: item.audio_url},
      mimetype: 'audio/mpeg'
}, { quoted: m});


    await conn.sendMessage(m.chat, {
      image: { url: item.image_url},
      caption: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*كلمات الاغنية : *\n${item.lyrics}\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`
}, { quoted: m});
}
};

handler.help = ['obito'];
handler.tags = ['youssef', 'obito'];
handler.command = ['غنيلي'];
handler.limit = true;

export default handler;