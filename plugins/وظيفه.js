import cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  const listOptions = ["جميع", "تحميل"];
  const [feature, inputs] = text ? text.split("|") : ["جميع"];

  if (!listOptions.includes(feature)) {
    return conn.reply(
      m.chat,
      "❌ *يرجى اختيار وظيفة صحيحة* \n\n*الخيارات المتاحة:* \n" +
        listOptions.map((v) => `○ ${v}`).join("\n"),
      m
    );
  }

  if (feature === "جميع") {
    await conn.reply(m.chat, "⏳ *جارٍ جلب الوظائف... انتظر قليلاً* 🔍", m);
    try {
      let res = await scrapeData();

      const buttons = res.map((item, index) => ({
        header: "",
        title: item.title,
        description: `📜 المشاهدات : ${item.views}`,
        id: `.وظيفه تحميل|${index}`,
      }));


      conn.relayMessage(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "📋 *قائمة الوظائف المتوفره في المغرب*",
              },
              body: {
                text: "🔍 اختر وظيفة لقراءة التفاصيل وتسحيل",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "🔎 الوظائف",
                      sections: [
                        {
                          title: "📜 الوظائف المتوفرة",
                          highlight_label: "𝑀𝐼𝑁𝐴𝑇𝛩 𝐵𝛩𝑇",
                          rows: buttons,
                        },
                      ],
                    }),
                    messageParamsJson: "",
                  },
                ],
              },
            },
          },
        },
      }, {});
    } catch (e) {
      console.error(e);
      await conn.reply(m.chat, "❌ *حدث خطأ أثناء جلب الوظائف!*", m);
    }
  }

  if (feature === "تحميل") {
    if (!inputs) return conn.reply(m.chat, "❌ *يرجى تقديم رقم أو رابط الوظيفة لقراءتها!*", m);
    await conn.reply(m.chat, "⏳ *جارٍ قراءة تفاصيل الوظيفة... انتظر قليلاً* 🔍", m);
    try {
      let res = await scrapeData();
      let url;

      if (/^\d+$/.test(inputs)) {
        url = res[parseInt(inputs)].link;
      } else {
        url = inputs;
      }

      let paragraphs = await getParagraphsFromURL(url);
      const content = paragraphs.length
        ? paragraphs.join("\n")
        : "❌ *لم يتم العثور على محتوى لهذه الوظيفة!*";

      await conn.reply(m.chat, `🔍 *تفاصيل الوظيفة :*\n\n📜 ${content}`, m);
    } catch (e) {
      console.error(e);
      await conn.reply(m.chat, "❌ *حدث خطأ أثناء قراءة التفاصيل!*", m);
    }
  }
};

handler.help = ["اوبيتو"];
handler.tags = ["اوبيتو"];
handler.command = /^وظيفه$/i;

export default handler;

/* عدلت ليك على سورس */
async function scrapeData() {
  const url = "http://alwadifa-maroc.com/";
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const items = [];

  $(".bloc-content").each((index, element) => {
    const link = $(element).find("a:first-child").attr("href");
    const title = $(element).find("a:first-child").text().trim();
    const image = $(element).find("img").attr("src");
    const [info, views, comments] = $(element)
      .find("li")
      .map((i, el) => $(el).text().trim())
      .get();

    items.push({
      title,
      link: link.startsWith("/") ? `${new URL(url).origin}${link}` : link,
      image: image.startsWith("/") ? `${new URL(url).origin}${image}` : image,
      info,
      views,
      comments,
    });
  });

  return items;
}

async function getParagraphsFromURL(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);
    const paragraphs = $("p")
    .map((index, element) => $(element).text().trim())
      .get();

    return paragraphs;
  } catch (error) {
    console.error("Error fetching or parsing the page:", error);
    return [];
  }
}