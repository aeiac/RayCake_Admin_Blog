<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center gap-2">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索IP、用户ID、理由"
        clearable
        style="width: 300px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="dialogVisible = true">添加黑名单</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="batchRemove">批量移除</el-button>
    </div>

    <el-table
      :data="blacklist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="ip_address" label="IP地址" width="160" />
      <el-table-column prop="reason" label="封禁理由" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'danger' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ban_type" label="封禁类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.ban_type === 1 ? 'warning' : 'danger'">
            {{ row.ban_type === 1 ? '临时' : '永久' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="expired_at" label="截止时间" width="180" />
      <el-table-column prop="created_at" label="添加时间" width="180" />
      <el-table-column label="操作" fixed="right" width="100">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="remove(row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加黑名单对话框 -->
    <el-dialog title="添加黑名单" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="IP地址">
          <el-input v-model="form.ip_address" />
        </el-form-item>
        <el-form-item label="封禁理由">
          <el-input v-model="form.reason" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="封禁类型">
          <el-select v-model="form.ban_type" style="width: 100%">
            <el-option label="临时" :value="1" />
            <el-option label="永久" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="form.expired_at" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const rawList = ref([
  {
    id: 1,
    ip_address: '192.168.1.1',
    reason: '暴力请求接口',
    status: 1,
    ban_type: 1,
    expired_at: '2025-07-01 12:00:00',
    created_at: '2025-06-01 10:00:00'
  },
  {
    id: 2,
    ip_address: '10.0.0.88',
    reason: '评论区刷屏',
    status: 0,
    ban_type: 2,
    expired_at: null,
    created_at: '2025-06-03 14:00:00'
  }
])

const blacklist = ref([...rawList.value])
const multipleSelection = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const form = ref({
  ip_address: '',
  reason: '',
  status: 1,
  ban_type: 1,
  expired_at: '',
})

const handleSelectionChange = val => multipleSelection.value = val

const handleSearch = () => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    blacklist.value = [...rawList.value]
  } else {
    blacklist.value = rawList.value.filter(item =>
      item.ip_address.toLowerCase().includes(keyword) ||
      item.reason.toLowerCase().includes(keyword) ||
      String(item.id).includes(keyword)
    )
  }
}

const add = () => {
  if (!form.value.ip_address || !form.value.reason) {
    ElMessage.warning('请输入完整信息')
    return
  }

  const newItem = {
    id: Date.now(), // 模拟唯一ID
    ...form.value,
    created_at: new Date().toLocaleString()
  }

  rawList.value.push(newItem)
  handleSearch()
  dialogVisible.value = false
  form.value = {
    ip_address: '',
    reason: '',
    status: 1,
    ban_type: 1,
    expired_at: ''
  }
  ElMessage.success('添加成功')
}

const remove = (id) => {
  rawList.value = rawList.value.filter(item => item.id !== id)
  handleSearch()
  ElMessage.success('移除成功')
}

const batchRemove = () => {
  const ids = multipleSelection.value.map(item => item.id)
  rawList.value = rawList.value.filter(item => !ids.includes(item.id))
  handleSearch()
  multipleSelection.value = []
  ElMessage.success('批量移除成功')
}
</script>

<style scoped>
</style>
