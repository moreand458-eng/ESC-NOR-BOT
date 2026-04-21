import pkg from "@whiskeysockets/baileys";
import moment from "moment-timezone";
import NodeCache from "node-cache";
import readline from "readline";
import qrcode from "qrcode";
import crypto from "crypto";
import fs from "fs";
import pino from "pino";
import * as ws from "ws";
const { CONNECTING } = ws;
import { Boom } from "@hapi/boom";
import { makeWASocket } from "../lib/simple.js";

const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  PHONENUMBER_MCC,
} = pkg;

if (!Array.isArray(global.conns)) global.conns = [];

const mssg = {
  nobbot: "~لا يمكن الاتصال ببوت هيكس~",
  recon: "~اعادة الاتصال ب هيكس بوت~",
  sesClose: "~تسجيل خروجك~",
  botinfo:
    `*⟪̶◠⟬͢ تـنـصـيـب بـوت فـرعـۍ ⟭◠͢⟫̶*\n\n` +
    "> `︱ الـخـطـوات :` \n" +
    "> `1` *⦚ اضغط علي زر النسخ في الاسفل*\n" +
    "> `2` *⦚ اضغط علي ال 3 نقاط*\n" +
    "> `3` *⦚ ادخل علي الاجهزة المرتبطة*\n" +
    "> `1` *⦚ الصق الكود الي انت نسختو*\n\n" +
    "`🍧 مـلاحـظـةة :` *الـكـود مـش هـيـشـتـغـل غـيـر مـع الـي طـلـبـو*",
  connet: "*تـم الـاتـصـال بـنـجـاح ي عـزيـزۍ 🍨*",
  connID: "*تـم الـاتـصـال بـنـجـاح ي عـزيـزۍ 🍧*",
  connMsg:
    "*تـذكـر حـفـظ الـرمـز الـي هـيـجـيـلك*\n" +
    "*تـم اعـادة تـشـغـيـل الـبـوت الـفـرعـۍ*\n" +
    "-\n" +
    "-",
  rembot: "> `𝐇Ꭵ𝐗-𝐁𝐎𝐓 𝐁𝐘 𝐖 Ꭵ 𝐒 𝐊 𝐘`",
};

let handler = async (
  m,
  { conn: _conn, args, usedPrefix, command, isOwner },
) => {
  let parent = _conn;

  async function rembots() {
    let authFolderB = crypto.randomBytes(10).toString("hex").slice(0, 8);

    if (!fs.existsSync("./rembots/" + authFolderB)) {
      fs.mkdirSync("./rembots/" + authFolderB, { recursive: true });
    }
    if (args[0]) {
      fs.writeFileSync(
        "./rembots/" + authFolderB + "/creds.json",
        JSON.stringify(
          JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")),
          null,
          "\t",
        ),
      );
    }

    const { state, saveState, saveCreds } = await useMultiFileAuthState(
      `./rembots/${authFolderB}`,
    );
    const msgRetryCounterCache = new NodeCache();
    const { version } = await fetchLatestBaileysVersion();
    let phoneNumber = m.sender.split("@")[0];

    const methodCodeQR = process.argv.includes("qr");
    const methodCode = !!phoneNumber || process.argv.includes("code");
    const MethodMobile = process.argv.includes("mobile");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const question = (texto) =>
      new Promise((resolver) => rl.question(texto, resolver));

    const connectionOptions = {
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      mobile: MethodMobile,
      browser: ["Ubuntu", "Chrome", "20.0.04", "H i X - BOT - By Wesky"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid);
        let msg = await store.loadMessage(jid, clave.id);
        return msg?.message || "";
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
      version,
    };

    let conn = makeWASocket(connectionOptions);

    if (methodCode && !conn.authState.creds.registered) {
      if (!phoneNumber) {
        process.exit(0);
      }
      let cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
      if (
        !Object.keys(PHONENUMBER_MCC).some((v) => cleanedNumber.startsWith(v))
      ) {
        process.exit(0);
      }

      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(cleanedNumber);
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
        parent.sendButton2(
          m.chat,
          `*✬ ¦ الـكـود :* *${codeBot}*\n\n${mssg.botinfo}`,
          mssg.rembot,
          "https://files.catbox.moe/44snxx.jpg",
          [],
          codeBot,
          null,
          m,
        );
        rl.close();
      }, 3000);
    }

    conn.isInit = false;

    let isInit = true;

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update;
      if (isNewLogin) conn.isInit = true;

      const code =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.output?.payload?.statusCode;
      if (
        code &&
        code !== DisconnectReason.loggedOut &&
        conn?.ws.socket == null
      ) {
        let i = global.conns.indexOf(conn);
        if (i < 0)
          return console.log(await creloadHandler(true).catch(console.error));
        delete global.conns[i];
        global.conns.splice(i, 1);

        if (code !== DisconnectReason.connectionClosed) {
          parent.sendMessage(
            conn.user.jid,
            { text: `⚠️ ${mssg.recon}` },
            { quoted: m },
          );
        } else {
          parent.sendMessage(
            m.chat,
            { text: `⛔ ${mssg.sesClose}` },
            { quoted: m },
          );
        }
      }

      if (global.db.data == null) loadDatabase();

      if (connection == "open") {
        conn.isInit = true;
        global.conns.push(conn);
        await parent.sendMessage(
          m.chat,
          { text: args[0] ? `ᡣ𐭩 ${mssg.connet}` : `ᡣ𐭩 ${mssg.connID}` },
          { quoted: m },
        );
        await sleep(5000);
        if (args[0]) return;
        await parent.sendMessage(
          conn.user.jid,
          { text: `ᡣ𐭩 ${mssg.connMsg}` },
          { quoted: m },
        );
        parent.sendMessage(
          conn.user.jid,
          {
            text:
              usedPrefix +
              command +
              " " +
              Buffer.from(
                fs.readFileSync("./rembots/" + authFolderB + "/creds.json"),
                "utf-8",
              ).toString("base64"),
          },
          { quoted: m },
        );
      }
    }

    setInterval(async () => {
      if (!conn.user) {
        try {
          conn.ws.close();
        } catch {}
        conn.ev.removeAllListeners();
        let i = global.conns.indexOf(conn);
        if (i < 0) return;
        delete global.conns[i];
        global.conns.splice(i, 1);
      }
    }, 60000);

    let handler = await import("../handler.js");
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(
          `../handler.js?update=${Date.now()}`
        ).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
      } catch (e) {
        console.error(e);
      }
      if (restatConn) {
        try {
          conn.ws.close();
        } catch {}
        conn.ev.removeAllListeners();
        conn = makeWASocket(connectionOptions);
        isInit = true;
      }

      if (!isInit) {
        conn.ev.off("messages.upsert", conn.handler);
        conn.ev.off("group-participants.update", conn.participantsUpdate);
        conn.ev.off("groups.update", conn.groupsUpdate);
        conn.ev.off("message.delete", conn.onDelete);
        conn.ev.off("call", conn.onCall);
        conn.ev.off("connection.update", conn.connectionUpdate);
        conn.ev.off("creds.update", conn.credsUpdate);
      }

      conn.welcome = global.conn.welcome + "";
      conn.bye = global.conn.bye + "";
      conn.spromote = global.conn.spromote + "";
      conn.sdemote = global.conn.sdemote + "";

      conn.handler = handler.handler.bind(conn);
      conn.participantsUpdate = handler.participantsUpdate.bind(conn);
      conn.groupsUpdate = handler.groupsUpdate.bind(conn);
      conn.onDelete = handler.deleteUpdate.bind(conn);
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn, true);

      conn.ev.on("messages.upsert", conn.handler);
      conn.ev.on("group-participants.update", conn.participantsUpdate);
      conn.ev.on("groups.update", conn.groupsUpdate);
      conn.ev.on("message.delete", conn.onDelete);
      conn.ev.on("connection.update", conn.connectionUpdate);
      conn.ev.on("creds.update", conn.credsUpdate);
      isInit = false;
      return true;
    };
    creloadHandler(false);
  }
  rembots();
};
handler.help = ["botclone"];
handler.tags = ["serbot"];
handler.command = ["code", "تنصيب", "serbotcode"];
handler.rowner = false;
handler.register = false;
export default handler;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}