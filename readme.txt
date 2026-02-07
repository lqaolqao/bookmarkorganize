项目名称：Bookmark Organizer（收藏夹整理工具）

一、项目目标
本项目是一个基于 Web 的收藏夹整理工具，用户可以：
1. 在前端页面上传浏览器导出的收藏夹 HTML 文件
2. 后端解析收藏夹中的所有 URL
3. 根据 URL 的标题（后续可扩展为网页内容或 AI 语义）对收藏进行分类
4. 在前端查看分类结果
5. 下载重新整理后的收藏夹 HTML 文件

项目采用 Serverless 架构，部署在 Vercel 上，前端为 Vue + JavaScript，后端为 Vercel Serverless Functions。

二、当前已实现功能（最小可运行版本）
1. 前端（Vue + JS）
   - 单页面应用
   - 支持上传收藏夹 HTML 文件
   - 获取后端返回的 session_id
   - 可查看分类结果（JSON 形式）
   - 可下载重新生成的收藏夹 HTML 文件

2. 后端（/api Serverless Functions）
   - /api/upload
     - 接收 multipart/form-data 上传的 HTML 文件
     - 解析收藏夹中的 <A HREF> 链接
     - 调用分类逻辑（当前为占位实现）
     - 创建随机 session_id
     - 将结果写入 KV（带 TTL）
   - /api/status
     - 根据 session_id 查询处理状态
   - /api/result
     - 根据 session_id 返回分类 JSON
     - 或返回可下载的收藏夹 HTML 文件

3. 数据存储
   - 使用 KV / JSON 风格存储（Upstash Redis via Vercel）
   - 所有 session 数据均设置 TTL（默认 3600 秒）
   - 数据为临时数据，自动过期删除

4. 安全与隔离
   - 不使用登录系统
   - 使用不可预测的 session_id 作为临时访问凭证
   - KV_REST_API_URL / KV_REST_API_TOKEN 仅在后端使用
   - AI_API_KEY 仅在后端使用
   - 前端无法访问任何密钥

三、当前的简化/占位实现
1. 分类逻辑（lib/classify.js）
   - 目前所有书签统一放入“未分类”
   - 未调用任何 AI 服务
   - 该模块为后续扩展重点

2. HTML 解析
   - 仅使用正则解析 <A HREF="...">Title</A>
   - 未处理嵌套文件夹、图标、时间戳等复杂结构

3. 状态管理
   - 当前上传后即同步完成处理
   - 未实现异步进度或长任务拆分

四、明确的后续待实现方向（供 AI 参考）
1. 使用 AI 对书签进行智能分类
   - 基于标题
   - 可选：抓取网页 title / description
   - 可选：多分类或层级分类
2. 分类逻辑的稳定性与限额控制
   - URL 数量分批处理
   - 防止超时和费用失控
3. 前端 UI 优化
   - 分类树展示
   - 进度提示
4. 收藏夹 HTML 解析与生成增强
   - 更完整地支持浏览器导出格式

五、非目标（当前阶段不做）
- 用户登录/注册
- 长期保存用户数据
- 数据分析或统计
- 向量数据库或相似度搜索

六、部署与运行说明
- 项目通过 GitHub 自动部署到 Vercel
- Vercel 项目中必须配置以下环境变量：
  - KV_REST_API_URL
  - KV_REST_API_TOKEN
  - AI_API_KEY（后续使用）
  - SESSION_TTL_SECONDS（可选，默认 3600）
