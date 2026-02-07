// 上传收藏夹HTML → 解析 → 分类（占位）→ KV存 session（带TTL）

import Busboy from "busboy";
import { createSessionId, sessionKey } from "../lib/session.js";
import { kvSet } from "../lib/kv.js";
import { parseBookmarkHtml } from "../lib/bookmark.js";
import { classifyBookmarks } from "../lib/classify.js";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  // 基础限额：防止超大文件
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB
  const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_BYTES } });

  let fileText = "";
  let gotFile = false;

  bb.on("file", (name, file, info) => {
    if (name !== "file") {
      file.resume();
      return;
    }
    gotFile = true;
    file.setEncoding("utf8");
    file.on("data", (d) => (fileText += d));
  });

  bb.on("error", (err) => {
    res.statusCode = 400;
    res.end(`Upload error: ${String(err)}`);
  });

  bb.on("finish", async () => {
    if (!gotFile) {
      res.statusCode = 400;
      return res.end("No file");
    }

    try {
      const items = parseBookmarkHtml(fileText);

      // （可选）限制 URL 数量，防刷账单/防超时
      if (items.length > 500) {
        res.statusCode = 400;
        return res.end("Too many bookmarks (max 500)");
      }

      const grouped = await classifyBookmarks(items);

      const sessionId = createSessionId();
      await kvSet(sessionKey(sessionId), {
        status: "done",
        createdAt: Date.now(),
        count: items.length,
        grouped
      });

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ session_id: sessionId }));
    } catch (e) {
      res.statusCode = 500;
      res.end(`Server error: ${String(e?.message || e)}`);
    }
  });

  req.pipe(bb);
}
