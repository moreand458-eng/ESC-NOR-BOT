import fetch from 'node-fetch';

export const pinterest = {
  async search(query, limit = 6) {
    try {
      const res = await fetch(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const pins = data.slice(0, limit).map(item => ({
        media: { images: { orig: { url: item.image || item.url || '' } } }
      }));
      return { result: { pins } };
    } catch (e) {
      const res2 = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
      const data2 = await res2.json();
      const pins = (data2.data || []).slice(0, limit).map(item => ({
        media: { images: { orig: { url: item.images_url || '' } } }
      }));
      return { result: { pins } };
    }
  }
};

export default { pinterest };
