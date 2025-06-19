<template>
  <div class="container">
    <div class="editor-header">

      <el-input
        v-model="article.title"
        placeholder="文章标题"
        class="input-title"
        clearable
        maxlength="255"
      />
      <el-input
        v-model="article.slug"
        placeholder="文章Slug"
        class="input-slug"
        clearable
        maxlength="255"
      />
      <el-select v-model="article.status" placeholder="发布状态" class="select-status">
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
        <el-option label="归档" value="archived" />
        <el-option label="禁用" value="disabled" />
      </el-select>

      <el-button type="info" @click="saveDraft">存为草稿</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button type="success" @click="publishArticle">发布</el-button>
      <el-button type="warning" @click="dialogVisible = true">定时发布</el-button>
      <el-button type="danger" @click="confirmReset">重置</el-button>

      <!-- 定时发布弹窗 -->
      <el-dialog
        title="定时发布"
        :visible.sync="dialogVisible"
        width="400px"
        @close="resetSchedule"
      >
        <el-date-picker
          v-model="scheduleTime"
          type="datetime"
          placeholder="选择发布时间"
          class="date-picker"
          :disabled-date="disabledDate"
        />
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSchedule">确认</el-button>
        </template>
      </el-dialog>

      <!-- 重置确认弹窗 -->
      <el-dialog
        title="确认重置"
        :visible.sync="resetConfirmVisible"
        width="300px"
        center
      >
        <span>确定要清空所有内容并重置表单吗？</span>
        <template #footer>
          <el-button @click="resetConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="resetArticle">确定</el-button>
        </template>
      </el-dialog>

    </div>

    <div class="editor-container">
      <div class="editor-wrapper">
        <Toolbar :editor="editorRef" />
        <Editor
          v-model="article.content"
          :default-config="editorConfig"
          @onCreated="handleCreated"
          class="custom-editor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const article = ref({
  title: '',
  slug: '',
  status: 'draft',
  content: '<p>欢迎使用富文本编辑器</p>',
})

const editorRef = ref(null)
const dialogVisible = ref(false)
const resetConfirmVisible = ref(false)
const scheduleTime = ref(null)

const editorConfig = {
  placeholder: '请输入内容...',
  editable: {
    style: {
      maxHeight: '100%',
      overflowY: 'auto',
    },
  },
}

function handleCreated(editor) {
  editorRef.value = editor

  const editorDom = editorRef.value.getEditableContainer()
  if (editorDom) {
    editorDom.addEventListener(
      'wheel',
      (e) => {
        const atTop = editorDom.scrollTop === 0
        const atBottom =
          editorDom.scrollHeight - editorDom.scrollTop === editorDom.clientHeight

        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          e.preventDefault()
          e.stopPropagation()
          editorDom.scrollTop += e.deltaY
        }
      },
      { passive: false }
    )
  }
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    const editorDom = editorRef.value.getEditableContainer()
    if (editorDom) {
      editorDom.removeEventListener('wheel', () => {})
    }
  }
})

function saveDraft() {
  article.value.status = 'draft'
  alert('文章已保存为草稿（演示）')
  console.log('草稿数据:', JSON.stringify(article.value, null, 2))
}

function handleSubmit() {
  if (!article.value.title.trim()) {
    alert('请输入文章标题')
    return
  }
  if (!article.value.slug.trim()) {
    alert('请输入文章Slug')
    return
  }
  if (!article.value.content || article.value.content === '<p><br></p>') {
    alert('请输入文章内容')
    return
  }

  alert('文章提交成功（演示）')
  console.log('提交数据:', JSON.stringify(article.value, null, 2))
}

function publishArticle() {
  article.value.status = 'published'
  alert('文章已发布（演示）')
  console.log('发布数据:', JSON.stringify(article.value, null, 2))
}

function confirmSchedule() {
  if (!scheduleTime.value) {
    alert('请选择发布时间')
    return
  }
  article.value.status = 'scheduled'
  article.value.published_at = scheduleTime.value
  dialogVisible.value = false
  alert(`文章定时发布，发布时间：${scheduleTime.value}`)
  console.log('定时发布数据:', JSON.stringify(article.value, null, 2))
}

function resetSchedule() {
  scheduleTime.value = null
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 86400000
}

function confirmReset() {
  resetConfirmVisible.value = true
}

function resetArticle() {
  article.value = {
    title: '',
    slug: '',
    status: 'draft',
    content: '',
  }
  resetConfirmVisible.value = false
  alert('表单已重置')
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  padding: 20px;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.input-title,
.input-slug {
  width: 300px;
}

.select-status {
  width: 160px;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  overflow: hidden;
  min-height: 500px;
  max-height: 500px;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-editor {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 16px 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  border-top: 1px solid #eee;
  outline: none;
  background: white;
  scroll-behavior: smooth;
}

.custom-editor::-webkit-scrollbar {
  width: 6px;
}

.custom-editor::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.custom-editor::-webkit-scrollbar-track {
  background-color: transparent;
}

.w-e-toolbar {
  padding: 8px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
  user-select: none;
}

.w-e-toolbar .w-e-btn {
  background: transparent;
  border: none;
  margin-right: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.w-e-toolbar .w-e-btn:hover {
  background-color: #e6f0ff;
}

.w-e-toolbar .w-e-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #409eff;
}

.date-picker {
  width: 100%;
}
</style>
