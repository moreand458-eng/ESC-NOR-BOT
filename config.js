// يجب عليك عدم تعديل اي شئ من بدايه السطر ال13 لعدم تخريب اللبوت #
// 𝑬𝒔𝒄𝒂𝒏𝒐𝒓  𝑪𝒐𝒓𝒍𝒆𝒐𝒏𝒆 𝑩𝑶𝑻-𝑴𝑫
import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['201092178171', '𝑬𝒔𝒄𝒂𝒏𝒐𝒓', true],
  ['201092178171', 'إسِــــکْأّنِـوٌر أّلَـحًـأّکْــــمً', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = '𝑬𝑹'
global.namebot = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗕𝕠𝘁'
global.namedev = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗠𝕠𝗱𝕤'
global.tg = 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f'
global.sessions = 'bodesessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗕𝕠𝘁'
global.namebot = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗕𝕠𝘁'
global.author = '𝗕𝕪 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗠𝕠𝗱𝕤'
global.moneda = 'Dolar'
global.canalreg = '120363198000393338@newsletter'

global.namecanal = '⌜ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝗕𝕠𝘁 💀 ⌟  || بوت إسكانور 💀'
global.canal = 'https://whatsapp.com/channel/0029VaEvarZ47XeGMKmNbs3y'
global.idcanal = '120363198000393338@newsletter'

global.ch = {
ch1: '120363198000393338@newsletter',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})