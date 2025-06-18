<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <!-- 顶部文章信息表单 -->
    <el-form
      :model="article"
      label-width="70px"
      size="small"
      style="padding: 10px 20px; background: #f9fafc; border-bottom: 1px solid #e4e7ed; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;"
    >
      <el-form-item label="文章ID" style="flex: 0 0 110px; min-width: 110px;">
        <el-input v-model="article.article_id" clearable size="small" />
      </el-form-item>
      <el-form-item label="编码" style="flex: 0 0 130px; min-width: 130px;">
        <el-input v-model="article.code" clearable size="small" />
      </el-form-item>
      <el-form-item label="标题" style="flex: 1 1 250px; min-width: 200px;">
        <el-input v-model="article.title" clearable size="small" />
      </el-form-item>
      <el-form-item label="Slug" style="flex: 0 0 150px; min-width: 150px;">
        <el-input v-model="article.slug" clearable size="small" />
      </el-form-item>
      <el-form-item label="作者ID" style="flex: 0 0 90px; min-width: 90px;">
        <el-input v-model="article.author_id" clearable size="small" />
      </el-form-item>
      <el-form-item label="分类ID" style="flex: 0 0 90px; min-width: 90px;">
        <el-input v-model="article.type_id" clearable size="small" />
      </el-form-item>
      <el-form-item label="类型" style="flex: 0 0 110px; min-width: 110px;">
        <el-input v-model="article.type" clearable size="small" />
      </el-form-item>
      <el-form-item label="状态" style="flex: 0 0 120px; min-width: 120px;">
        <el-select v-model="article.status" placeholder="请选择" size="small" clearable>
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="已归档" value="archived" />
          <el-option label="禁用" value="disabled" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" style="flex: 0 0 90px; min-width: 90px;">
        <el-input-number v-model="article.sort" :min="0" size="small" controls-position="right" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="发布时间" style="flex: 0 0 180px; min-width: 180px;">
        <el-date-picker
          v-model="article.published_at"
          type="datetime"
          placeholder="选择日期时间"
          size="small"
          style="width: 100%;"
          clearable
        />
      </el-form-item>
    </el-form>

    <!-- 编辑器和预览 -->
    <div
      class="editor-container"
      style="flex: 1; display: flex; gap: 20px; padding: 10px; box-sizing: border-box;"
    >
      <div style="flex: 1; border: 1px solid #ccc; display: flex; flex-direction: column;">
        <Toolbar :editor="editorRef" />
        <Editor
          v-model="article.content"
          :default-config="editorConfig"
          @onCreated="handleCreated"
          style="flex: 1; overflow-y: auto; padding: 10px; box-sizing: border-box;"
        />
      </div>

      <div
        style="flex: 1; border: 1px solid #ccc; padding: 10px; overflow-y: auto; background: #fff;"
      >
        <h3>实时预览</h3>
        <div v-html="article.content" style="min-height: 300px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const article = ref({
  article_id: '',
  code: '',
  title: '',
  slug: '',
  content: '<p>欢迎使用富文本编辑器</p>',
  author_id: '',
  type_id: '',
  type: '',
  status: 'draft',
  sort: 0,
  published_at: '',
})

const editorRef = ref(null)

const editorConfig = {
  placeholder: '请输入内容...',
}

function handleCreated(editor) {
  editorRef.value = editor
}
</script>

<style>
.editor-container,
.editor-container * {
  user-select: text !important;
}
</style>
