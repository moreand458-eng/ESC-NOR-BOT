/* 
• Plugins Kobo Voice
• Source : https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/

import WebSocket from "ws";
import fs from "fs";

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || q.mediaType || "";
	if (/audio|video/.test(mime)) {
		let media = await q.download?.();
		m.reply("انتظر قليلاً... 💀");
		let wss = "wss://yanzbotz-waifu-yanzbotz.hf.space/queue/join";

		function generateRandomLetters(length) {
			let result = "";
			const alphabetLength = 26;

			for (let i = 0; i < length; i++) {
				const randomValue = Math.floor(Math.random() * alphabetLength);
				const randomLetter = String.fromCharCode(
					"a".charCodeAt(0) + randomValue,
				);
				result += randomLetter;
			}

			return result;
		}

		const nisa = async (audio) => {
			return new Promise(async (resolve, reject) => {
				let name =
					Math.floor(Math.random() * 100000000000000000) +
					(await generateRandomLetters()) +
					".mp4";
				let result = {};
				let send_has_payload = {
					fn_index: 0,
					session_hash: "xyuk2cf684b",
				};
				let send_data_payload = {
					fn_index: 0,
					data: [
						{
							data: "data:audio/mpeg;base64," + audio.toString("base64"),
							name: name,
						},
						10,
						"pm",
						0.6,
						false,
						"",
						"en-US-AnaNeural-Female",
					],
					event_data: null,
					session_hash: "xyuk2cf684b",
				};
				const ws = new WebSocket(wss);
				ws.onopen = function () {
					console.log("تم الاتصال بخادم WebSocket 💀");
				};

				ws.onmessage = async function (event) {
					let message = JSON.parse(event.data);

					switch (message.msg) {
						case "send_hash":
							ws.send(JSON.stringify(send_has_payload));
							break;

						case "send_data":
							console.log("جاري معالجة الصوت 💀...");
							ws.send(JSON.stringify(send_data_payload));
							break;
						case "process_completed":
							result.base64 =
								"https://yanzbotz-waifu-yanzbotz.hf.space/file=" +
								message.output.data[1].name;
							break;
					}
				};

				ws.onclose = function (event) {
					if (event.code === 1000) {
						console.log("تم اكتمال المعالجة 💀");
					} else {
						msg.reply("خطأ: فشل الاتصال بـ WebSocket 💀");
					}
					resolve(result);
				};
			});
		};
		let abcd = await nisa(await media);

		conn.sendFile(m.chat, abcd.base64, "", "", m);
	} else throw `يرجى الرد على فيديو/صوت باستخدام الأمر *${usedPrefix + command}* 💀`;
};

handler.help = ["suarakobo *رد على فيديو/صوت* 💀", "صوتكوبو *رد على فيديو/صوت* 💀"];
handler.command = ["suarakobo", "صوتكوبو"];
handler.tags = ["ai"];
handler.limit = true;

handler.usage = {
    suarakobo: "الرد على فيديو/صوت لتحويله إلى صوت باستخدام خدمة الكوبو. مثال:\n  رد على صوت أو فيديو وأرسل الأمر *suarakobo* 💀",
    صوتكوبو: "الرد على فيديو/صوت لتحويله إلى صوت باستخدام خدمة الكوبو. مثال:\n  رد على صوت أو فيديو وأرسل الأمر *صوتكوبو* 💀"
};

export default handler;