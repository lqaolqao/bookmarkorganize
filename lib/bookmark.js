// 收藏夹HTML 解析/生成

export function parseBookmarkHtml(html) {
    const regex = /<A[^>]*HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
    const items = [];
    let m;
    while ((m = regex.exec(html))) {
      items.push({ url: m[1], title: m[2] });
    }
    return items;
  }
  
  export function generateBookmarkHtml(grouped) {
    let out = `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<DL><p>\n`;
    for (const category of Object.keys(grouped)) {
      out += `<DT><H3>${escapeHtml(category)}</H3>\n<DL><p>\n`;
      for (const it of grouped[category]) {
        out += `<DT><A HREF="${escapeAttr(it.url)}">${escapeHtml(it.title || it.url)}</A>\n`;
      }
      out += `</DL><p>\n`;
    }
    out += `</DL><p>\n`;
    return out;
  }
  
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
  
  function escapeAttr(s) {
    return String(s).replaceAll('"', "&quot;");
  }
  