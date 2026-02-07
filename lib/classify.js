// 分类（先占位，后面换AI）

export async function classifyBookmarks(items) {
    // 先做最简单：全部放“未分类”
    // 你后面用 AI 分类时，只需要改这个文件：内部调用 AI（后端读取 AI_API_KEY）
    return {
      "未分类": items
    };
  }
  
//这里暂时不使用 AI，避免你还没配好 key 就部署失败。
//但我们已经保留了 AI_API_KEY 设计位，后续替换很简单。