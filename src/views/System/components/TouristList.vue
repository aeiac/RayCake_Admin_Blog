<template>
  <div>
    <h1>网站访客管理列表</h1>

    <!-- 搜索区域 -->
    <el-form :inline="true" size="small" class="search-form" @submit.native.prevent>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="IP地址">
        <el-input v-model="searchForm.ip" placeholder="请输入IP"></el-input>
      </el-form-item>

      <el-form-item label="访问页面">
        <el-input v-model="searchForm.page" placeholder="请输入访问页面"></el-input>
      </el-form-item>

      <el-form-item label="访问时间">
        <el-date-picker
          v-model="searchForm.visitRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          unlink-panels
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作按钮 -->
    <div style="margin: 10px 0;">
      <el-button 
        type="danger" 
        :disabled="!multipleSelection.length"
        @click="batchDelete"
      >批量删除</el-button>

      <el-button 
        type="warning" 
        :disabled="!multipleSelection.length"
        @click="openBatchRemarkDialog"
      >批量添加备注</el-button>
    </div>

    <!-- 访客列表表格 -->
    <el-table
      :data="pagedVisitors"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-key="row => row.id"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="姓名/昵称" width="140" />
      <el-table-column prop="lastVisit" label="访问时间" width="180" />
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column prop="page" label="访问页面" />
      <el-table-column prop="device" label="设备/浏览器" width="180" />
      <el-table-column label="备注" width="220">
        <template #default="{ row }">
          <el-tooltip effect="dark" content="点击编辑备注" placement="top">
            <span @click="openRemarkDialog(row)" style="cursor: pointer; color: #409eff;">
              {{ row.remark || '无备注' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="deleteVisitor(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 20px; text-align: right;">
      <el-pagination
        @current-change="pageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="filteredVisitors.length"
      />
    </div>

    <!-- 编辑备注弹窗 -->
    <el-dialog
      title="编辑备注"
      :visible.sync="remarkDialogVisible"
      width="400px"
    >
      <el-input
        type="textarea"
        v-model="currentRemark"
        placeholder="请输入备注"
        rows="4"
      />
      <template #footer>
        <el-button @click="remarkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRemark">保存</el-button>
      </template>
    </el-dialog>

    <!-- 批量备注弹窗 -->
    <el-dialog
      title="批量添加备注"
      :visible.sync="batchRemarkDialogVisible"
      width="400px"
    >
      <el-input
        type="textarea"
        v-model="batchRemark"
        placeholder="请输入备注"
        rows="4"
      />
      <template #footer>
        <el-button @click="batchRemarkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBatchRemark">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟数据
const visitors = ref([
  { id: 1, name: '访客A', lastVisit: '2025-06-19 09:20:15', ip: '192.168.1.100', page: '/home', device: 'Chrome on Windows 10', remark: '' },
  { id: 2, name: '匿名用户', lastVisit: '2025-06-19 10:05:30', ip: '192.168.1.101', page: '/product/123', device: 'Firefox on MacOS', remark: '可能是客户' },
  { id: 3, name: '访客C', lastVisit: '2025-06-18 22:15:45', ip: '10.10.10.10', page: '/contact', device: 'Safari on iPhone', remark: '' },
  // 假设更多数据...
])

// 搜索条件表单
const searchForm = reactive({
  name: '',
  ip: '',
  page: '',
  visitRange: []
})

// 当前页码及分页大小
const currentPage = ref(1)
const pageSize = 5

// 选中的多行
const multipleSelection = ref([])

// 备注编辑弹窗相关
const remarkDialogVisible = ref(false)
const currentRemark = ref('')
const currentVisitorId = ref(null)

// 批量备注弹窗相关
const batchRemarkDialogVisible = ref(false)
const batchRemark = ref('')

// 过滤函数
function filterBySearch(visitor) {
  const nameMatch = !searchForm.name || visitor.name.toLowerCase().includes(searchForm.name.toLowerCase())
  const ipMatch = !searchForm.ip || visitor.ip.toLowerCase().includes(searchForm.ip.toLowerCase())
  const pageMatch = !searchForm.page || visitor.page.toLowerCase().includes(searchForm.page.toLowerCase())
  
  let dateMatch = true
  if (searchForm.visitRange.length === 2) {
    const visitTime = new Date(visitor.lastVisit)
    const start = new Date(searchForm.visitRange[0] + ' 00:00:00')
    const end = new Date(searchForm.visitRange[1] + ' 23:59:59')
    dateMatch = visitTime >= start && visitTime <= end
  }

  return nameMatch && ipMatch && pageMatch && dateMatch
}

const filteredVisitors = computed(() => visitors.value.filter(filterBySearch))

const pagedVisitors = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredVisitors.value.slice(start, start + pageSize)
})

// 搜索按钮点击
function handleSearch() {
  currentPage.value = 1
}

// 重置搜索
function resetSearch() {
  searchForm.name = ''
  searchForm.ip = ''
  searchForm.page = ''
  searchForm.visitRange = []
  currentPage.value = 1
}

// 处理多选框
function handleSelectionChange(val) {
  multipleSelection.value = val
}

// 删除单条访客
function deleteVisitor(id) {
  ElMessageBox.confirm('确认删除该访客？', '删除提示', {
    type: 'warning',
  }).then(() => {
    visitors.value = visitors.value.filter(v => v.id !== id)
    ElMessage.success('删除成功')
    // 取消选择中该项
    multipleSelection.value = multipleSelection.value.filter(v => v.id !== id)
  }).catch(() => {})
}

// 批量删除
function batchDelete() {
  ElMessageBox.confirm(`确认删除选中的${multipleSelection.value.length}个访客？`, '批量删除', {
    type: 'warning',
  }).then(() => {
    const ids = multipleSelection.value.map(v => v.id)
    visitors.value = visitors.value.filter(v => !ids.includes(v.id))
    ElMessage.success('批量删除成功')
    multipleSelection.value = []
  }).catch(() => {})
}

// 打开编辑备注弹窗
function openRemarkDialog(visitor) {
  currentVisitorId.value = visitor.id
  currentRemark.value = visitor.remark || ''
  remarkDialogVisible.value = true
}

// 保存备注
function saveRemark() {
  const idx = visitors.value.findIndex(v => v.id === currentVisitorId.value)
  if (idx !== -1) {
    visitors.value[idx].remark = currentRemark.value.trim()
    ElMessage.success('备注已保存')
  }
  remarkDialogVisible.value = false
}

// 打开批量备注弹窗
function openBatchRemarkDialog() {
  batchRemark.value = ''
  batchRemarkDialogVisible.value = true
}

// 保存批量备注
function saveBatchRemark() {
  const remarkText = batchRemark.value.trim()
  if (!remarkText) {
    ElMessage.error('备注内容不能为空')
    return
  }
  multipleSelection.value.forEach(visitor => {
    const idx = visitors.value.findIndex(v => v.id === visitor.id)
    if (idx !== -1) {
      visitors.value[idx].remark = remarkText
    }
  })
  ElMessage.success('批量备注添加成功')
  batchRemarkDialogVisible.value = false
  multipleSelection.value = []
}

// 分页切换
function pageChange(page) {
  currentPage.value = page
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #333;
}

.search-form {
  margin-bottom: 10px;
}
</style>
