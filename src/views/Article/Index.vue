<template>
	<div class="mac-file-frame">
		<el-container style="height: 100%;">
			<!-- 左侧树型菜单 -->
			<el-aside class="tree-aside">
				<VerticalMenu :treeData="treeData" :defaultProps="defaultProps" @tree-click="handleTreeClick" />
			</el-aside>

			<!-- 右侧内容 -->
			<el-main class="article-main">

				<!-- 搜索与新增 -->
				<el-input v-model="searchKeyword" placeholder="搜索文章标题" clearable @clear="fetchArticles"
					@input="onSearch" style="margin-bottom: 20px; max-width: 300px" />

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
							<el-button type="text" size="small" style="color: red"
								@click="onDelete(row.id)">删除</el-button>
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
							<el-date-picker v-model="form.published_at" type="datetime" placeholder="选择发布时间"
								style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" />
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
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
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
		published_at: null,
	})

	const form = reactive({
		title: '',
		slug: '',
		content: '',
		status: 'draft',
		published_at: null,
	})

	const rules = {
		title: [{
			required: true,
			message: '请输入标题',
			trigger: 'blur'
		}],
		slug: [{
			required: true,
			message: '请输入Slug',
			trigger: 'blur'
		}],
		content: [{
			required: true,
			message: '请输入内容',
			trigger: 'blur'
		}],
		status: [{
			required: true,
			message: '请选择状态',
			trigger: 'change'
		}],
	}

	// 模拟 API
	async function apiFetchArticles(keyword = '') {
		let all = [{
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
			},
		]
		if (keyword.trim()) {
			all = all.filter((item) => item.title.toLowerCase().includes(keyword.toLowerCase()))
		}
		return all
	}

	async function apiCreateArticle(data) {
		data.id = Math.floor(Math.random() * 10000) + 3
		return data
	}

	async function apiUpdateArticle(id, data) {
		return {
			...data,
			id
		}
	}

	async function apiDeleteArticle(id) {
		return true
	}

	// 树菜单数据
	const treeData = ref([{
			label: '全部文章',
			id: 'all'
		},
		{
			label: '已发布',
			id: 'published'
		},
		{
			label: '草稿',
			id: 'draft'
		},
		{
			label: '已归档',
			id: 'archived'
		},
		{
			label: '已删除',
			id: 'del'
		},
	])

	const defaultProps = {
		children: 'children',
		label: 'label',
	}

	function handleTreeClick(node) {
		if (node.id === 'all') {
			fetchArticles()
		} else {
			apiFetchArticles().then((all) => {
				articles.value = all.filter((article) => article.status === node.id)
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
				type: 'warning',
			})
			.then(async () => {
				await apiDeleteArticle(id)
				ElMessage.success('删除成功')
				await fetchArticles()
			})
			.catch(() => {})
	}

	onMounted(() => {
		fetchArticles()
	})
</script>

<style scoped>
	.mac-file-frame {
		width: 95%;
		height: 90vh;
		border-radius: 20px;
		background: #f5f5f7;
/* 		margin: 30px auto; */
		display: flex;
		overflow: hidden;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		color: #1d1d1f;
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
		box-shadow:
			0 4px 8px rgba(0, 122, 255, 0.3);
		font-weight: 600;
		font-size: 14px;
		transition: background-color 0.3s ease;
	}

	.el-button--primary:hover {
		background-color: #005ecb;
		border-color: #005ecb;
		box-shadow:
			0 6px 12px rgba(0, 94, 203, 0.4);
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
		border-radius: 20px;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.1);
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
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.1);
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

	/* Tree 侧边栏 */
.tree-aside {
  background: #f7f7fa;
  min-width: 120px; /* 设置一个最小宽度 */
  width: auto;      /* 宽度由内容决定 */
  max-width: 100%;  /* 防止撑破容器 */
  border-radius: 20px 0 0 20px;
  padding: 20px;
  box-shadow: inset -8px 0 12px -8px rgba(0, 0, 0, 0.08);
  box-sizing: border-box; /* 确保 padding 不额外撑大宽度 */
  display: inline-block;  /* 或 flex 子项时使用 flex: 0 1 auto */
}

	/* 选中状态 */
	.el-tree-node.is-current .el-tree-node__content {
		background-color: #e6f0ff;
		border-radius: 12px;
		color: #007aff;
		font-weight: 600;
	}

	/* 滚动条 */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}
</style>