// 查询 session 状态

import { kvGet } from "../lib/kv.js";
import { sessionKey } from "../lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  const { session_id } = req.query || {};
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

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: data.status, count: data.count }));
  } catch (e) {
    res.statusCode = 500;
    res.end(`Server error: ${String(e?.message || e)}`);
  }
}
