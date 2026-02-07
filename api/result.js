// 返回结果JSON 或 下载HTML

import { kvGet } from "../lib/kv.js";
import { sessionKey } from "../lib/session.js";
import { generateBookmarkHtml } from "../lib/bookmark.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  const { session_id, format } = req.query || {};
  if (!session_id) {
    res.statusCode = 400;
    return res.end("Missing session_id");
  }

  try {
    const data = await kvGet(sessionKey(session_id));
    if (!data) {
      res.statusCode = 404;
      return res.end("Not found");
    }

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ grouped: data.grouped }));
    }

    const html = generateBookmarkHtml(data.grouped);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="bookmarks_sorted.html"`);
    res.end(html);
  } catch (e) {
    res.statusCode = 500;
    res.end(`Server error: ${String(e?.message || e)}`);
  }
}
