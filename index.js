console.log('Michi Wa Bot ...')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

cfonts.say('The - Michi\nWa', {
  font: 'block',
  align: 'center',
  gradient: ['cyan', 'white']
})

cfonts.say('Bot Multi Device', {
  font: 'simple',
  align: 'center',
  gradient: ['red', 'white']
})

// تشغيل البوت مباشرة
import('./main.js')