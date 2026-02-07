// KV REST 封装（强制 TTL）

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const DEFAULT_TTL = Number(process.env.SESSION_TTL_SECONDS || 3600);

function assertEnv() {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error("Missing KV_REST_API_URL or KV_REST_API_TOKEN");
  }
}

// 说明：这里采用“POST /set/<key> + JSON body({value, ttl})”的最简形式。
// 如果你使用的 KV REST 端点格式不同（不同厂商会有差异），只需要改这个文件即可。
export async function kvSet(key, value, ttlSeconds = DEFAULT_TTL) {
  assertEnv();
  const res = await fetch(`${KV_URL.replace(/\/$/, "")}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ value, ttl: ttlSeconds })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`kvSet failed: ${res.status} ${text}`);
  }
}

export async function kvGet(key) {
  assertEnv();
  const res = await fetch(`${KV_URL.replace(/\/$/, "")}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`kvGet failed: ${res.status} ${text}`);
  }
  const json = await res.json().catch(() => null);
  return json?.result ?? null;
}
//你后续如果换成 Vercel KV 官方 SDK，也可以只改这个文件（但你要求的 env 名就继续保留）