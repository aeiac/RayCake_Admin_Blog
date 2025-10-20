<template>
  <div class="container">
    <!-- 左列：头像 -->
    <div class="left-column">
      <div class="profile-header">
        <el-avatar
          :size="140"
          shape="square"
          :src="profile.avatar"
          class="avatar"
        >
          {{ profile.nickname ? profile.nickname[0] : 'U' }}
        </el-avatar>

        <h1>{{ profile.nickname || profile.username }}</h1>
        <p class="email">{{ profile.email }}</p>
        <p class="bio">{{ profile.bio || '这个人很神秘，没有填写简介。' }}</p>

        <div class="avatar-actions">
          <el-upload
            class="upload-btn"
            :show-file-list="false"
            :on-change="handleAvatarChange"
          >
            <el-button size="small" plain>更改头像</el-button>
          </el-upload>
          <el-button size="small" type="primary" plain @click="saveProfile">
            保存资料
          </el-button>
        </div>
      </div>
    </div>

    <!-- 中列：可编辑个人信息 -->
    <div class="middle-column">
      <div class="info-section">
        <h2>账户信息</h2>
        <div class="info-list-grid">
          <div v-for="field in editableFields" :key="field.key" class="info-item">
            <span class="label">{{ field.label }}</span>
            <component
              :is="field.type || 'el-input'"
              v-model="profile[field.key]"
              v-bind="field.props"
            ></component>
          </div>
        </div>
      </div>
    </div>

    <!-- 右列：系统信息 -->
    <div class="right-column">
      <div class="info-section">
        <h2>系统信息</h2>
        <div class="info-list-grid">
          <div v-for="field in readonlyFields" :key="field.key" class="info-item">
            <span class="label">{{ field.label }}</span>
            <span class="value">{{ profile[field.key] || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const profile = reactive({
  id: null,
  username: '',
  password: '',
  salt: '',
  nickname: '',
  status: 1,
  avatar: '',
  phone: '',
  email: '',
  last_login_ip: '',
  last_login_time: '',
  created_at: '',
  updated_at: '',
  bio: ''
})

const editableFields = [
  { key: 'nickname', label: '昵称', type: 'el-input', props: { placeholder: '未填写' } },
  { key: 'password', label: '密码', type: 'el-input', props: { type: 'password', placeholder: '修改密码' } },
  { key: 'phone', label: '电话', type: 'el-input', props: { placeholder: '未填写' } },
  { key: 'email', label: '邮箱', type: 'el-input', props: { placeholder: '未填写' } },
  { key: 'status', label: '管理员状态', type: 'el-select', props: { placeholder: '请选择状态' } }
]

const readonlyFields = [
  { key: 'salt', label: '盐值 (salt)' },
  { key: 'last_login_ip', label: '最后登录 IP' },
  { key: 'last_login_time', label: '最后登录时间' },
  { key: 'created_at', label: '创建时间' },
  { key: 'updated_at', label: '更新时间' }
]

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    profile.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const saveProfile = () => {
  localStorage.setItem('userinfo', JSON.stringify(profile))
  ElMessage.success('资料已保存')
}

onMounted(() => {
  const stored = localStorage.getItem('userinfo')
  if (stored) Object.assign(profile, JSON.parse(stored))
})
</script>

<style scoped>
.container {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
}

/* 左列：头像 */
.left-column {
  flex: 0 0 250px;
  display: flex;
  justify-content: center;
}

/* 中列：可编辑信息 */
.middle-column {
  flex: 1;
}

/* 右列：系统信息 */
.right-column {
  flex: 1;
}

/* 头像与基本信息 */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar {
  border-radius: 12px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.profile-header h1 {
  margin-top: 12px;
  font-size: 22px;
  font-weight: 600;
}

.email {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}

.bio {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.avatar-actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 横向信息列表 */
.info-section {
  margin-bottom: 30px;
}

.info-section h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  align-items: start;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 13px;
  color: #888;
}

.value {
  font-size: 14px;
  color: #555;
}

.el-input,
.el-textarea,
.el-select {
  width: 100%;
}

/* 响应式：单列排列 */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }
  .left-column,
  .middle-column,
  .right-column {
    min-width: 100%;
  }
  .info-list-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
