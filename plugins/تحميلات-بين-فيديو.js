import axios from "axios";

let handler = async (m, { conn, text }) => {
    if (!text) throw "*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو توفير رابط فيديو بينترست لي تحميله 🪄📿*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*";

    try {
        m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*جاري تحميل الفيديو من بينترست.....💦*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

        const { medias, title } = await pindl(text);

        // Validate the response structure
        if (!medias || !Array.isArray(medias)) throw "رابط غير صالح";

        // Filter for MP4 media
        let mp4 = medias.filter(v => v.extension === "mp4");

        if (mp4.length > 0) {
            const size = formatSize(mp4[0].size); // Format the size here
            await conn.sendMessage(
                m.chat,
                { 
                    video: { url: mp4[0].url }, 
                    caption: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*_تم تحميل الفيديو من بينترست بنجاح 🪄✅_*\n*الجودة :  ${mp4[0].quality}*\n*الحجم :  ${size}*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*` 
                },
                { quoted: m }
            );
        } else if (medias[0]) {
            // Fallback to the first available media
            await conn.sendFile(m.chat, medias[0].url, '', `\`${title}\``, m);
        } else {
            throw "No downloadable media found for the provided link.";
        }
    } catch (e) {
        throw `An error occurred: ${e}`;
    }
};

handler.help = ["اوبيتو"];
handler.command = /^(بين-فيديو)$/i;
handler.tags = ["اوبيتو"];

export default handler;

async function pindl(url) {
    try {
        const apiEndpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
        const params = { url };
        
        // Fetch the data from the API
        let { data } = await axios.get(apiEndpoint, { params });
        
        // Ensure the response structure is as expected
        if (!data || !data.medias) throw "Invalid API response.";
        
        return data;
    } catch (e) {
        console.error("Error in pindl function:", e.message);
        throw "Failed to fetch data from Pinterest Downloader. Please try again.";
    }
}

// Helper function to format file size
function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}