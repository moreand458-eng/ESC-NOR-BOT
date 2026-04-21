import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    if (!text) return m.reply(usedPrefix+command+" مرحبا اعطيني معلومات عن المغرب")
    await m.react('🔮');
    try {
        const result = await chatAi(text);
        await m.reply(result);
    } catch (error) {
        await m.react('😅');
    }

}
handler.help = ["chatai"]
handler.tags = ["ai"];
handler.command = /^(شات-جبتي)$/i
export default handler

async function chatAi(inputValue) {
    try {
        const chatApiUrl = 'https://api.chatanywhere.com.cn/v1/chat/completions';
        const chatResponse = await fetch(chatApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk-pu4PasDkEf284PIbVr1r5jn9rlvbAJESZGpPbK7OFYYR6m9g',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "أنت مساعد. جاهز لمساعدتك في كل شيء بسرور. تم إنشاؤك بواسطة اوبيتو، و اوبيتو هو مطور بوت معروف منذ فترة طويلة بين الكثير من الناس. استخدم الرموز التعبيرية وفقًا للإجابة في كل جملة."
                }, {
                    role: "user",
                    content: inputValue
                }]
            }),
        });
        const chatData = await chatResponse.json();
        return chatData.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}