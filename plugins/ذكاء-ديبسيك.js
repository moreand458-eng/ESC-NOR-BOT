import axios from "axios";

let handler = async (m, { text }) => {
    if (!text) throw "*معك دييبسيك المطور من شركة deepseek الصينيه اطلب و اسئل على ماذا تريد 💗❤️✅*";
    
    try {
        let { data } = await axios.post("https://ai.clauodflare.workers.dev/chat", {
            "model": "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
            "messages": [{
                "role": "user",
                "content": text
            }]
        });

        if (!data.success) throw JSON.stringify(data, null, 2);
        
        let response = data.data.response.split("</think>").pop().trim();
        m.reply(response);
    } catch (error) {
        m.reply("حدث خطأ أثناء معالجة الطلب ❌");
    }
};

handler.help = handler.command = ['دييبسيك'];
handler.tags = ['اوبيتو'];

export default handler;