 
 <!--
前端：上传 + 展示 + 下载
-->

<template>
    <div style="max-width: 720px; margin: 40px auto; font-family: sans-serif;">
      <h1>收藏夹整理（最简版）</h1>
  
      <p>上传浏览器导出的收藏夹 HTML 文件：</p>
      <input type="file" accept=".html,text/html" @change="onPickFile" />
  
      <div style="margin-top: 16px;" v-if="status">
        <strong>状态：</strong>{{ status }}
      </div>
  
      <div style="margin-top: 16px;" v-if="sessionId">
        <p><strong>session_id：</strong>{{ sessionId }}</p>
  
        <button @click="loadResultJson">查看分类结果（JSON）</button>
        <a :href="downloadUrl" style="margin-left: 12px;">下载整理后的收藏夹</a>
  
        <pre v-if="resultJson" style="margin-top: 16px; padding: 12px; background: #f6f6f6; overflow:auto;">
  {{ resultJson }}
        </pre>
      </div>
  
      <p style="margin-top: 24px; color: #666;">
        注：结果会在 KV 中临时保存，TTL 到期自动删除。
      </p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sessionId: null,
        status: "",
        resultJson: ""
      };
    },
    computed: {
      downloadUrl() {
        return this.sessionId ? `/api/result?session_id=${encodeURIComponent(this.sessionId)}` : "#";
      }
    },
    methods: {
      async onPickFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
  
        this.status = "上传中...";
        this.resultJson = "";
        this.sessionId = null;
  
        const form = new FormData();
        form.append("file", file);
  
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          this.status = `上传失败：${res.status}`;
          return;
        }
        const json = await res.json();
        this.sessionId = json.session_id;
        this.status = "已处理完成（最简版：目前全部放入“未分类”）";
      },
      async loadResultJson() {
        if (!this.sessionId) return;
        const res = await fetch(`/api/result?session_id=${encodeURIComponent(this.sessionId)}&format=json`);
        if (!res.ok) {
          this.resultJson = `获取失败：${res.status}`;
          return;
        }
        const json = await res.json();
        this.resultJson = JSON.stringify(json, null, 2);
      }
    }
  };
  </script>
  