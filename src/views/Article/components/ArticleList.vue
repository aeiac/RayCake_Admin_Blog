<template>
  <div class="article-main">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="filters" class="search-form" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input v-model="filters.id" placeholder="文章ID" clearable />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="filters.title" placeholder="文章标题" clearable />
      </el-form-item>
      <el-form-item label="Slug">
        <el-input v-model="filters.slug" placeholder="Slug" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="选择状态" clearable>
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="已归档" value="archived" />
          <el-option label="已删除" value="del" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间区间">
        <el-date-picker
          v-model="filters.published_at_range"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          unlink-panels
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchArticles">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作按钮 -->
    <div style="margin: 10px 0;">
      <el-button
        type="danger"
        :disabled="!selectedArticles.length"
        @click="batchDelete"
      >
        批量删除
      </el-button>
      <el-button
        type="success"
        :disabled="!selectedArticles.length"
        @click="batchPublish"
        style="margin-left: 10px"
      >
        批量发布
      </el-button>
      <el-button
        type="warning"
        :disabled="!selectedArticles.length"
        @click="batchArchive"
        style="margin-left: 10px"
      >
        批量归档
      </el-button>
      <span style="margin-left: 20px;">
        已选择 {{ selectedArticles.length }} 条
      </span>
    </div>

    <!-- 文章表格 -->
    <el-table
      :data="pagedArticles"
      stripe
      border
      style="width: 100%"
      :row-key="row => row.id"
      @selection-change="handleSelectionChange"
      ref="articleTable"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="slug" label="Slug" />

      <!-- 状态列，纯显示 -->
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" effect="dark">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="published_at" label="发布时间" width="160" />

      <!-- 操作列，编辑蓝色按钮，删除红色文字按钮，新增快捷操作按钮 -->
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="openEditDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="onDelete(row.id)"
          >
            删除
          </el-button>

          <!-- 快捷操作按钮示例 -->
          <el-button
            type="success"
            size="small"
            style="margin-left: 8px"
            @click="changeStatus(row, 'published')"
            v-if="row.status !== 'published'"
          >
            发布
          </el-button>
          <el-button
            type="warning"
            size="small"
            style="margin-left: 8px"
            @click="changeStatus(row, 'archived')"
            v-if="row.status !== 'archived'"
          >
            归档
          </el-button>
          <el-button
            type="info"
            size="small"
            style="margin-left: 8px"
            @click="changeStatus(row, 'draft')"
            v-if="row.status !== 'draft'"
          >
            设为草稿
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="filteredArticles.length"
      style="margin-top: 20px; text-align: right;"
    />

    <!-- 弹窗 -->
    <el-dialog
      :title="currentArticle.id ? '编辑文章' : '新增文章'"
      :visible.sync="showDialog"
      width="600px"
      :before-close="resetDialog"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" rows="6" v-model="form.content" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已归档" value="archived" />
            <el-option label="已删除" value="del" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="published_at">
          <el-date-picker
            v-model="form.published_at"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetDialog">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const articles = ref([])
const showDialog = ref(false)
const formRef = ref(null)

const currentArticle = reactive({ id: null, title: '', slug: '', content: '', status: 'draft', published_at: null })
const form = reactive({ title: '', slug: '', content: '', status: 'draft', published_at: null })

const filters = reactive({
  id: '',
  title: '',
  slug: '',
  status: '',
  published_at_range: [], // 时间区间
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入Slug', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const selectedArticles = ref([]) // 批量选中数据

// 分页相关
const currentPage = ref(1)
const pageSize = 10

// 过滤文章（根据搜索条件）
const filteredArticles = computed(() => {
  const [start, end] = filters.published_at_range || []
  return articles.value.filter(item => {
    const publishedAt = item.published_at ? item.published_at.substring(0, 10) : null
    return (
      (!filters.id || String(item.id).includes(filters.id)) &&
      (!filters.title || item.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.slug || item.slug.toLowerCase().includes(filters.slug.toLowerCase())) &&
      (!filters.status || item.status === filters.status) &&
      (!start || !end || (publishedAt >= start && publishedAt <= end))
    )
  })
})

// 当前分页的数据
const pagedArticles = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(startIdx, startIdx + pageSize)
})

function resetFilters() {
  Object.assign(filters, { id: '', title: '', slug: '', status: '', published_at_range: [] })
  fetchArticles()
  currentPage.value = 1
}

async function fetchArticles() {
  // 模拟API数据
  const all = [
    { id: 1, title: '示例文章1', slug: 'example-1', content: '文章内容1', status: 'published', published_at: '2025-06-13 10:00:00' },
    { id: 2, title: '示例文章2', slug: 'example-2', content: '文章内容2', status: 'draft', published_at: null },
    { id: 3, title: '测试文章3', slug: 'test-3', content: '内容3', status: 'archived', published_at: '2025-06-14 12:00:00' },
  ]
  articles.value = all
}

function handleSelectionChange(selection) {
  selectedArticles.value = selection
}

function statusTagType(status) {
  switch (status) {
    case 'draft': return 'info'
    case 'published': return 'success'
    case 'archived': return 'warning'
    case 'del': return 'danger'
    default: return 'default'
  }
}

function statusText(status) {
  switch (status) {
    case 'draft': return '草稿'
    case 'published': return '已发布'
    case 'archived': return '已归档'
    case 'del': return '已删除'
    default: return '未知'
  }
}

// 直接设置状态（快捷按钮调用）
function changeStatus(row, status) {
  if (row.status === status) {
    ElMessage.info('状态已是当前状态')
    return
  }
  row.status = status
  ElMessage.success(`状态已更新为${statusText(status)}`)
  // TODO: 后端接口同步状态更新
}

// 新增/编辑弹窗
function openAddDialog() {
  resetForm()
  showDialog.value = true
}

function openEditDialog(row) {
  Object.assign(currentArticle, row)
  Object.assign(form, row)
  showDialog.value = true
}

function resetForm() {
  currentArticle.id = null
  form.title = ''
  form.slug = ''
  form.content = ''
  form.status = 'draft'
  form.published_at = null
  formRef.value?.clearValidate()
}

function resetDialog() {
  showDialog.value = false
  resetForm()
}

async function onSave() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    if (currentArticle.id) {
      // 更新文章
      const index = articles.value.findIndex(a => a.id === currentArticle.id)
      if (index !== -1) {
        articles.value[index] = { ...articles.value[index], ...form }
      }
      ElMessage.success('更新成功')
    } else {
      // 新增文章
      const newId = articles.value.length ? Math.max(...articles.value.map(a => a.id)) + 1 : 1
      articles.value.push({ id: newId, ...form })
      ElMessage.success('新增成功')
    }
    showDialog.value = false
    resetForm()
  })
}

function onDelete(id) {
  ElMessageBox.confirm('确定删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value.splice(idx, 1)
      ElMessage.success('删除成功')
    }
    selectedArticles.value = selectedArticles.value.filter(item => item.id !== id)
  }).catch(() => {})
}

// 批量删除
function batchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedArticles.value.length} 条文章吗？`, '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedArticles.value.map(a => a.id)
    articles.value = articles.value.filter(a => !ids.includes(a.id))
    ElMessage.success('批量删除成功')
    selectedArticles.value = []
  }).catch(() => {})
}

// 批量发布
function batchPublish() {
  selectedArticles.value.forEach(article => {
    article.status = 'published'
  })
  ElMessage.success('批量发布成功')
  selectedArticles.value = []
}

// 批量归档
function batchArchive() {
  selectedArticles.value.forEach(article => {
    article.status = 'archived'
  })
  ElMessage.success('批量归档成功')
  selectedArticles.value = []
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.article-main {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* 输入框样式 */
.el-input {
  --el-input-bg-color: #f2f2f7;
  --el-input-border-color: #d2d2d7;
  --el-input-text-color: #1d1d1f;
  border-radius: 14px;
  box-shadow:
    inset 2px 2px 5px #dcdce3,
    inset -2px -2px 5px #ffffff;
}

/* 按钮风格 */
.el-button--primary {
  background-color: #007aff;
  border-color: #007aff;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 122, 255, 0.3);
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.el-button--primary:hover {
  background-color: #005ecb;
  border-color: #005ecb;
  box-shadow: 0 6px 12px rgba(0, 94, 203, 0.4);
}

/* 表格 */
.el-table {
  background: #fefefe;
  border-radius: 20px;
  box-shadow:
    5px 5px 12px #d6d6db,
    -5px -5px 12px #ffffff;
  overflow: hidden;
  font-size: 14px;
  color: #1d1d1f;
}

.el-table th,
.el-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e2e7;
}

/* 弹窗 */
.el-dialog {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  color: #1d1d1f;
}

.el-dialog__header {
  font-weight: 700;
  font-size: 1.4rem;
  border-bottom: none;
  padding: 20px 24px;
  background: #f8f8f8;
  border-radius: 20px 20px 0 0;
}

/* 表单输入 */
.el-input__inner,
.el-select .el-input__inner,
.el-date-editor.el-input__inner {
  border-radius: 14px;
  background: #f2f2f7;
  border: 1px solid #d2d2d7;
  box-shadow:
    inset 2px 2px 5px #dcdce3,
    inset -2px -2px 5px #ffffff;
  color: #1d1d1f;
}

/* 下拉选择 */
.el-select-dropdown {
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 按钮底部 */
.el-dialog__footer {
  padding: 16px 24px;
  background: #f8f8f8;
  border-radius: 0 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

/* 删除按钮颜色 */
.el-button--text {
  color: #ff3b30;
  font-weight: 600;
}
</style>
