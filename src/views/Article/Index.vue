<template>
  <div class="mac-file-frame">
    <el-container style="height: 100%;">
		
      <!-- 左侧树型菜单 -->
      <el-aside width="250px" class="tree-aside">
		<VerticalMenu />
      </el-aside>

      <!-- 右侧内容 -->
      <el-main class="article-main">
        <!-- 页头 -->
        <header class="mac-header">
          <div class="page-title">文章管理</div>
          <div class="window-controls">
            <span class="circle yellow"></span>
            <span class="circle green"></span>
            <span class="circle red" @click="goToArticle()"></span>
          </div>
        </header>

        <!-- 搜索与新增 -->
        <el-input v-model="searchKeyword" placeholder="搜索文章标题" clearable @clear="fetchArticles" @input="onSearch"
          style="margin-bottom: 20px; max-width: 300px" />

        <el-button type="primary" @click="openAddDialog" style="margin-bottom: 20px;">
          新增文章
        </el-button>

        <!-- 表格展示 -->
        <el-table :data="articles" stripe border style="width: 100%" :row-key="row => row.id">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="slug" label="Slug" />
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column prop="published_at" label="发布时间" width="160" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="openEditDialog(row)">编辑</el-button>
              <el-button type="text" size="small" style="color: red" @click="onDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="currentArticle.id ? '编辑文章' : '新增文章'" :visible.sync="showDialog" width="600px"
          :before-close="resetDialog">
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
              <el-date-picker v-model="form.published_at" type="datetime" placeholder="选择发布时间" style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-form>

          <template #footer>
            <el-button @click="resetDialog">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import VerticalMenu from '../../components/menubar/VerticalMenu.vue'


const router = useRouter()

const articles = ref([])
const searchKeyword = ref('')
const showDialog = ref(false)
const formRef = ref(null)

const currentArticle = reactive({
  id: null,
  title: '',
  slug: '',
  content: '',
  status: 'draft',
  published_at: null
})

const form = reactive({
  title: '',
  slug: '',
  content: '',
  status: 'draft',
  published_at: null
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入Slug', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 模拟 API
async function apiFetchArticles(keyword = '') {
  let all = [
    {
      id: 1,
      title: '示例文章1',
      slug: 'example-1',
      content: '文章内容1',
      status: 'published',
      published_at: '2025-06-13 10:00:00',
    },
    {
      id: 2,
      title: '示例文章2',
      slug: 'example-2',
      content: '文章内容2',
      status: 'draft',
      published_at: null,
    }
  ]
  if (keyword.trim()) {
    all = all.filter(item =>
      item.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  return all
}

async function apiCreateArticle(data) {
  data.id = Math.floor(Math.random() * 10000) + 3
  return data
}

async function apiUpdateArticle(id, data) {
  return { ...data, id }
}

async function apiDeleteArticle(id) {
  return true
}

// 树菜单数据
const treeData = ref([
  { label: '全部文章', id: 'all' },
  { label: '已发布', id: 'published' },
  { label: '草稿', id: 'draft' },
  { label: '已归档', id: 'archived' },
  { label: '已删除', id: 'del' },
])

const defaultProps = {
  children: 'children',
  label: 'label',
}

function handleTreeClick(node) {
  if (node.id === 'all') {
    fetchArticles()
  } else {
    apiFetchArticles().then(all => {
      articles.value = all.filter(article => article.status === node.id)
    })
  }
}

async function fetchArticles() {
  articles.value = await apiFetchArticles(searchKeyword.value)
}

function onSearch() {
  fetchArticles()
}

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
  formRef.value.validate(async valid => {
    if (!valid) return
    if (currentArticle.id) {
      await apiUpdateArticle(currentArticle.id, form)
      ElMessage.success('更新成功')
    } else {
      await apiCreateArticle(form)
      ElMessage.success('新增成功')
    }
    showDialog.value = false
    await fetchArticles()
  })
}

function onDelete(id) {
  ElMessageBox.confirm('确定删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await apiDeleteArticle(id)
    ElMessage.success('删除成功')
    await fetchArticles()
  }).catch(() => { })
}

function goToArticle() {
  router.push('/')
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.mac-file-frame {
  width: 95%;
  height: 90vh;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f0f3, #d9d9dc);
  box-shadow: 5px 5px 15px #b8b9be, -5px -5px 15px #ffffff;
  margin: 40px auto;
  display: flex;
  overflow: hidden;
}

.mac-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #e0e0e0;
  border-radius: 12px 12px 0 0;
  user-select: none;
  margin-bottom: 20px;
}

.page-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.window-controls {
  display: flex;
  gap: 10px;
}

.circle {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.circle::after {
  content: "×";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
  user-select: none;
  pointer-events: none;
}

.red {
  background: #ff5f56;
}

.yellow {
  background: #ffbd2e;
}

.green {
  background: #27c93f;
}

.tree-aside {
  background: #f9f9f9;
  padding: 20px 10px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.tree-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.article-main {
  padding: 20px;
  overflow-y: auto;
}
</style>
