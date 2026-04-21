import fetch from "node-fetch"

const handler = async (m, { text, usedPrefix, command }) => {
  // التأكد من أن المستخدم قد أدخل اسم النطاق
  if (!text) throw `💀 يرجى إدخال اسم النطاق أو الساب-دومين! 😕\n\n*مثال:* ${command} s.id`

  // التأكد من أن المدخلات لا تحتوي على روابط https أو http
  if (text.includes("https://") || text.includes("http://")) throw `💀 يرجى إدخال النطاق أو الساب-دومين بشكل صحيح. مثال: ${command} s.id`
  
  // إبلاغ المستخدم بأنه يتم معالجة الطلب
  await m.reply("💀⌛ الرجاء الانتظار قليلاً...") 

  try {
    let output = await convertRecords(text)
    // إرسال نتائج البحث للمستخدم
    await m.reply(`💀📋 *نتائج بحث DNS:*\n${output}`);
  } catch (error) {
    console.log(error)
    await m.reply("💀❌ حدث خطأ أثناء محاولة البحث عن سجلات DNS.")
  }
}

handler.command = ["dnslookup", "dns", "دي-ان-اس", "hackertarget", "lookup"]
handler.help = ["dnslookup", "dns", "دي-ان-اس", "hackertarget", "lookup"]
handler.tags = ["internet"]
handler.premium = false
export default handler

const api_key = "E4/gdcfciJHSQdy4+9+Ryw==JHciNFemGqOVIbyv"

async function fetchDNSRecords(apiKey, domain) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/dnslookup?domain=${domain}`, {
      headers: { "X-Api-Key": apiKey },
      contentType: "application/json"
    })
    const records = await response.json()
    return records
  } catch (error) {
    console.log(error)
    throw new Error("💀❌ فشل في جلب سجلات DNS.")
  }
}

async function fetchDNSRecordsFromHackertarget(domain) {
  try {
    const response = await fetch(`https://api.hackertarget.com/dnslookup/?q=${domain}`)
    return await response.text()
  } catch (error) {
    console.log(error)
    throw new Error("💀❌ فشل في جلب سجلات DNS من Hackertarget.")
  }
}

async function convertRecords(domain) {
  try {
    const records = await fetchDNSRecords(api_key, domain)
    return records.map((record, index) => {
      return `💀🔍 [${index + 1}]:\n${Object.entries(record).map(([key, value]) => {
        const input = key;
        const output = input.charAt(0).toUpperCase() + input.slice(1).replace(/_/g, " ");
        return `*${output}:* ${typeof value === 'string' ? value.replace(/\.$/, '') : value}`;
      }).join('\n')}`;
    }).join('\n')
  } catch (error) {
    console.log(error)
    return await fetchDNSRecordsFromHackertarget(domain)
  }
}