// ممنوع التعديل هنا لعدم تخريب البوت
// 𝑬𝒔𝒄𝒂𝒏𝒐𝒓 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, mkdirSync } from 'fs';
import yargs from 'yargs';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import lodash from 'lodash';
import readline from 'readline';
import NodeCache from 'node-cache';
import qrcode from 'qrcode-terminal';
import { spawn } from 'child_process';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = await import('@whiskeysockets/baileys');

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}),
        })
      )
    : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
);

global.db = new Low(new JSONFile(`storage/databases/database.json`));

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = lodash.chain(global.db.data);
};

global.authFile = `Taibsessions`;
const { state, saveCreds } = await useMultiFileAuthState(global.authFile);

const { version } = await fetchLatestBaileysVersion();

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: 'client' });
logger.level = 'fatal';

const connectionOptions = {
  version: version,
  logger,
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  browser: Browsers.ubuntu('Chrome'),
  markOnlineOnclientect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  retryRequestDelayMs: 10,
  transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
  maxMsgRetryCount: 15,
  appStateMacVerification: {
    patch: false,
    snapshot: false,
  },
  getMessage: async (key) => {
    return { conversation: '' };
  },
};

global.conn = makeWASocket(connectionOptions);

async function reconnectSubBot(botPath) {
    console.log(chalk.yellow(`Intentando reconectar sub-bot en: ${path.basename(botPath)}`));
    try {
        const { state: subBotState, saveCreds: saveSubBotCreds } = await useMultiFileAuthState(botPath);
        const subBotConn = makeWASocket({
            version: version,
            logger,
            printQRInTerminal: false,
            auth: {
                creds: subBotState.creds,
                keys: makeCacheableSignalKeyStore(subBotState.keys, logger),
            },
            browser: Browsers.ubuntu('Chrome'),
            markOnlineOnclientect: false,
            generateHighQualityLinkPreview: true,
            syncFullHistory: true,
            retryRequestDelayMs: 10,
            transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
            maxMsgRetryCount: 15,
            appStateMacVerification: {
                patch: false,
                snapshot: false,
            },
            getMessage: async (key) => {
                return { conversation: '' };
            },
        });

        subBotConn.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                console.log(chalk.green(`Sub-bot conectado correctamente: ${path.basename(botPath)}`));
            } else if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
                console.error(chalk.red(`Sub-bot desconectado en ${path.basename(botPath)}. Razón: ${reason}`));
                if (reason === 401) {
                    global.conns = global.conns.filter(conn => conn.user?.jid !== subBotConn.user?.jid);
                    console.log(chalk.red(`❌ Sub-bot removido de global.conns: ${subBotConn.user?.jid}`));
                }
            }
        });
        subBotConn.ev.on('creds.update', saveSubBotCreds);

        if (handler && handler.handler) {
            subBotConn.handler = handler.handler.bind(subBotConn);
            subBotConn.ev.on('messages.upsert', subBotConn.handler);
            console.log(chalk.blue(`Manejador asignado al sub-bot: ${path.basename(botPath)}`));
        } else {
            console.warn(chalk.yellow(`Advertencia: No se encontró el manejador para asignar al sub-bot: ${path.basename(botPath)}`));
        }

        if (!global.subBots) {
            global.subBots = {};
        }
        global.subBots[path.basename(botPath)] = subBotConn;
        
        global.conns = global.conns || []
        const yaExiste = global.conns.some(c => c.user?.jid === subBotConn.user?.jid)
        if (!yaExiste) {
            global.conns.push(subBotConn)
            console.log(chalk.green(`🟢 Sub-bot agregado a global.conns: ${subBotConn.user?.jid}`))
        }
        
    } catch (e) {
        console.error(chalk.red(`Error al reconectar sub-bot en ${path.basename(botPath)}:`), e);
    }
}

// ✅ تشغيل الكود (Pairing Code) مباشرة
async function handleCodeLogin() {
    if (conn.authState.creds.registered) {
        console.log(chalk.green('✅ جلسة موجودة بالفعل، جاري الاتصال...'));
        return;
    }

    console.log(chalk.cyan('📱 يرجى إدخال رقم هاتفك مع رمز الدولة (مثال: 201092178171):'));
    
    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question2 = (texto) => new Promise((resolver) => rl2.question(texto, resolver));
    
    let phoneNumber = await question2(chalk.blue('🔢 اكتب رقمك الآن: '));
    phoneNumber = phoneNumber.replace(/\D/g, '');
    
    rl2.close();

    if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.slice(1);
    }

    console.log(chalk.yellow(`⏳ جاري طلب كود التحقق للرقم ${phoneNumber}...`));

    if (typeof conn.requestPairingCode === 'function') {
        try {
            if (conn.ws.readyState === ws.OPEN) {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join('-') || code;
                console.log(chalk.green(`\n✅ كود التحقق الخاص بك هو: ${chalk.bold.cyan(code)}\n`));
                console.log(chalk.yellow('📱 افتح واتساب ← الأجهزة المرتبطة ← ربط جهاز ← أدخل الكود'));
            } else {
                console.log(chalk.red('❌ الاتصال غير مفتوح، جاري إعادة المحاولة...'));
                setTimeout(() => handleCodeLogin(), 3000);
            }
        } catch (e) {
            console.log(chalk.red('❌ خطأ في طلب الكود:'), e.message || e);
        }
    } else {
        console.log(chalk.red('❌ الإصدار لا يدعم ربط الكود'));
    }
}

// ✅ تشغيل تسجيل الدخول بالكود
await handleCodeLogin();

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp']) {
        const tmp = [tmpdir(), 'tmp', 'serbot'];
        tmp.forEach((filename) => {
          spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']);
        });
      }
    }, 30 * 1000);
  }
}

function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 3) return unlinkSync(file);
    return false;
  });
}

setInterval(() => {
  if (global.stopped === 'close' || !conn || !conn.user) return;
  clearTmp();
}, 180000);

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code =
    lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }
  if (global.db.data == null) await loadDatabase();
  if (connection === 'open') {
    console.log(chalk.yellow('Conectado correctamente.'));

    const rutaJadiBot = join(__dirname, './JadiBots');
    
    if (!existsSync(rutaJadiBot)) {
        mkdirSync(rutaJadiBot, { recursive: true });
        console.log(chalk.bold.cyan(`La carpeta: ${rutaJadiBot} se creó correctamente.`));
    } else {
        console.log(chalk.bold.cyan(`La carpeta: ${rutaJadiBot} ya está creada.`));
    }

    const readRutaJadiBot = readdirSync(rutaJadiBot);
    if (readRutaJadiBot.length > 0) {
        const credsFile = 'creds.json';
        for (const subBotDir of readRutaJadiBot) {
            const botPath = join(rutaJadiBot, subBotDir);
            const readBotPath = readdirSync(botPath);
            if (readBotPath.includes(credsFile)) {
                await reconnectSubBot(botPath);
            }
        }
    }
  }
  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (reason === 405) {
    if (existsSync('./bodesessions/creds.json')) unlinkSync('./bodesessions/creds.json');
    console.log(
      chalk.bold.redBright(
        `Conexión reemplazada, por favor espera un momento. Reiniciando...\nSi aparecen errores, vuelve a iniciar con: npm start`
      )
    );
    process.send('reset');
  }
  if (connection === 'close') {
    switch (reason) {
      case DisconnectReason.badSession:
        conn.logger.error(`Sesión incorrecta, elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.timedOut:
        conn.logger.warn(`Conexión perdida o cerrada, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
        break;
      case DisconnectReason.connectionReplaced:
        conn.logger.error(
          `Conexión reemplazada, se abrió otra sesión. Cierra esta sesión primero.`
        );
        break;
      case DisconnectReason.loggedOut:
        conn.logger.error(`Sesión cerrada, elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        break;
      case DisconnectReason.restartRequired:
        conn.logger.info(`Reinicio necesario, reinicia el servidor si hay problemas.`);
        await global.reloadHandler(true).catch(console.error);
        break;
      default:
        conn.logger.warn(`Desconexión desconocida: ${reason || ''} - Estado: ${connection || ''}`);
        await global.reloadHandler(true).catch(console.error);
        break;
    }
  }
}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js');

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Handler && Object.keys(Handler).length) handler = Handler;
  } catch (e) {
    console.error(e);
  }

  if (restartConn) {
    try {
      if (global.conn.ws) global.conn.ws.close();
    } catch {}
    global.conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions);
    isInit = true;
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.handler = handler.handler.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);

  isInit = false;
  return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}
await filesInit();

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`Updated plugin - '${filename}'`);
      else {
        conn.logger.warn(`Deleted plugin - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`New plugin - '${filename}'`);

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`Syntax error while loading '${filename}':\n${format(err)}`);
    else {
      try {
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`Error requiring plugin '${filename}':\n${format(e)}`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);

watch(pluginFolder, global.reload);
await global.reloadHandler();