<template>
	<div class="article-main">
		<!-- 多字段搜索表单 -->
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
			<el-form-item label="发布时间">
				<el-date-picker v-model="filters.published_at" type="date" placeholder="选择日期" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchArticles">搜索</el-button>
				<el-button @click="resetFilters">重置</el-button>
			</el-form-item>
		</el-form>

		<el-button type="primary" @click="openAddDialog" style="margin: 10px 0">新增文章</el-button>

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

		<el-dialog :title="currentArticle.id ? '编辑文章' : '新增文章'" :visible.sync="showDialog" width="600px" :before-close="resetDialog">
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
					<el-date-picker v-model="form.published_at" type="datetime" placeholder="选择发布时间" style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const articles = ref([])
const showDialog = ref(false)
const formRef = ref(null)

const currentArticle = reactive({ id: null, title: '', slug: '', content: '', status: 'draft', published_at: null })
const form = reactive({ title: '', slug: '', content: '', status: 'draft', published_at: null })

const filters = reactive({ id: '', title: '', slug: '', status: '', published_at: '' })

const rules = {
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	slug: [{ required: true, message: '请输入Slug', trigger: 'blur' }],
	content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function resetFilters() {
	Object.assign(filters, { id: '', title: '', slug: '', status: '', published_at: '' })
	fetchArticles()
}

async function fetchArticles() {
	articles.value = await apiFetchArticles()
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
	formRef.value.validate(async (valid) => {
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
		type: 'warning'
	})
	.then(async () => {
		await apiDeleteArticle(id)
		ElMessage.success('删除成功')
		await fetchArticles()
	})
	.catch(() => {})
}

async function apiFetchArticles() {
	let all = [
		{ id: 1, title: '示例文章1', slug: 'example-1', content: '文章内容1', status: 'published', published_at: '2025-06-13 10:00:00' },
		{ id: 2, title: '示例文章2', slug: 'example-2', content: '文章内容2', status: 'draft', published_at: null }
	]
	return all.filter(item => {
		return (
			(!filters.id || String(item.id).includes(filters.id)) &&
			(!filters.title || item.title.toLowerCase().includes(filters.title.toLowerCase())) &&
			(!filters.slug || item.slug.toLowerCase().includes(filters.slug.toLowerCase())) &&
			(!filters.status || item.status === filters.status) &&
			(!filters.published_at || item.published_at?.startsWith(filters.published_at))
		)
	})
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

/* 搜索输入框 */
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
