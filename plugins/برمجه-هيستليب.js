/*
لا تحذف وسم الوصف

*اسم الإضافة: هيستليب*

✨ GISTLIB (برنامج سؤال وجواب للمبرمجين باستخدام الذكاء الاصطناعي) ✨

*[المصدر]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[المصدر سكرايب]*

https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L/190
*/

import axios from 'axios';
import qs from 'qs';

const gistlib = {
  api: {
    base: "https://api.gistlib.com/v1/prompt/query",
    token: "https://securetoken.googleapis.com/v1/token",
    userInfo: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo",
    key: "AIzaSyABSb80nLRB_FN2bdZrtIV5k7_oLRMQF9w"
  },
  headers: {
    'authority': 'api.gistlib.com',
    'accept': 'application/json, text/plain, */*',
    'origin': 'https://gistlib.com',
    'pragma': 'no-cache',
    'referer': 'https://gistlib.com/',
    'user-agent': 'Postify/1.0.0'
  },
  languages: [
    'javascript',
    'typescript',
    'python',
    'swift',
    'ruby',
    'csharp',
    'go',
    'rust',
    'php',
    'matlab',
    'r'
  ],
  refreshToken: 'AMf-vBxj8NY808dvIjtCj_1UzVZvqjiYAKwiDJHrd_CN7S9tfb9z8i9rQgn4JqpJ88mCD_bgYxP4mSwQEU341_2mzI5rNGD5RiRXnpMxvIxLLWSZz2Ofhf9tz3Lc31mGCeb3dLnwKr7XiSK89Sc77yS8ZqzXYGYJhEptXsm5XqNQHoX_St101c4',
  a: {
    token: null,
    expiresAt: null
  },
  async ensureToken() {
    const now = Date.now();
    if (this.a.token && this.a.expiresAt && now < this.a.expiresAt - 300000) {
      return {
        success: true,
        code: 200,
        result: {
          token: this.a.token
        }
      };
    }
    try {
      const data = {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      };
      const response = await axios.post(
        `${this.api.token}?key=${this.api.key}`,
        qs.stringify(data),
        { headers: this.headers }
      );
      if (!response.data?.access_token) {
        return {
          success: false,
          code: 400,
          result: {
            error: "رمز الوصول غير صالح، حاول مرة أخرى 🤣"
          }
        };
      }
      this.a = {
        token: response.data.access_token,
        expiresAt: now + (response.data.expires_in * 1000 || 3600000)
      };
      return {
        success: true,
        code: 200,
        result: {
          token: this.a.token
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error.response?.status || 500,
        result: {
          error: "حدث خطأ أثناء الحصول على رمز الوصول.. حاول مرة أخرى"
        }
      };
    }
  },
  isValid: (data) => {
    if (!data) {
      return {
        success: false,
        code: 400,
        result: {
          error: "البيانات غير موجودة! ماذا حاولت إدخاله؟ 🗿"
        }
      };
    }
    if (!data.prompt) {
      return {
        success: false,
        code: 400,
        result: {
          error: "أين الاستفسار؟ أرجو منك إدخال النص الذي ترغب في الحصول على إجابة عنه 🫵🏻"
        }
      };
    }
    if (!data.language) {
      return {
        success: false,
        code: 400,
        result: {
          error: "أين اللغة؟ أرجو منك تحديد اللغة البرمجية التي تريد استخدامها 🗿"
        }
      };
    }
    if (!gistlib.languages.includes(data.language.toLowerCase())) {
      return {
        success: false,
        code: 400,
        result: {
          error: `اللغة '${data.language}' غير مدعومة. يرجى اختيار إحدى اللغات التالية: ${gistlib.languages.join(', ')} 😑`
        }
      };
    }
    return {
      success: true,
      code: 200,
      result: {
        message: "البيانات صحيحة الآن! 💃🏻"
      }
    };
  },
  create: async (prompt, language) => {
    const validation = gistlib.isValid({ prompt, language });
    if (!validation.success) {
      return validation;
    }
    const ab = await gistlib.ensureToken();
    if (!ab.success) {
      return ab;
    }
    try {
      const response = await axios.get(gistlib.api.base, {
        headers: {
          ...gistlib.headers,
          'Authorization': `Bearer ${ab.result.token}`
        },
        params: { prompt, language }
      });
      return {
        success: true,
        code: 200,
        result: response.data
      };
    } catch (error) {
      return {
        success: false,
        code: error.response?.status || 500,
        result: {
          error: "حدث خطأ في الخادم، يرجى المحاولة لاحقاً 😌",
          details: error.message
        }
      };
    }
  }
};

const handler = async (m, { conn, text }) => {
  const [language, ...promptArray] = text.split(' ');
  const prompt = promptArray.join(' ');
  
  if (!language || !prompt) {
    return m.reply('مثال على الاستخدام: * .هيستليب javascript كيف أكتب دالة لحساب الفيبوناتشي؟ \n\n*اللغات المدعومة : \n\n- javascript\n\n- python\n\n- ruby\n\n- php\n\n- matlab\n\n- go\n\n- swift\n\n- csharp\n\n- r\n\n- typescript\n\n- rust');
  }
  
  const result = await gistlib.create(prompt, language.toLowerCase());
  
  if (!result.success) {
    return m.reply(`${result.result.error || 'خطأ'}`);
  }
  
  const codeResult = result.result;
  let responseText = `*نتيجة الكود ${language.toUpperCase()}*:\n\n`;
  responseText += `${codeResult.language}\n\n${codeResult.code}`;
  
  m.reply(responseText);
};

handler.help = ['هيستليب <اللغة البرمجية> <الاستفسار>'];
handler.command = ['هيستليب', 'gistlib'];
handler.tags = ['ai'];

export default handler;