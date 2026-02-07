// session_id 生成与 key 规范

export function createSessionId() {
    return crypto.randomUUID();
  }
  
  export function sessionKey(sessionId) {
    return `session:${sessionId}`;
  }