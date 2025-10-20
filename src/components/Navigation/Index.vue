<template>
  <div class="mac-navbar">
    <!-- 左侧应用图标 + 用户信息 -->
    <div class="mac-navbar-left">
		<img
		  :src="user.avatar || defaultAvatar"
		  alt="User Avatar"
		  class="app-icon"
		  @click="$emit('avatar-click')"
		/>
      <span v-if="user.nickname" class="user-name">{{ user.nickname }}</span>
	  <ul class="menu-list">
	    <li class="menu-item">文件</li>
	    <li class="menu-item">编辑</li>
	    <li class="menu-item">显示</li>
	    <li class="menu-item">窗口</li>
	    <li class="menu-item">帮助</li>	
	  </ul>
    </div>

    <!-- 中间菜单 -->
    <div class="mac-navbar-center"></div>

    <!-- 右侧状态图标 -->
    <div class="mac-navbar-right">
      <i class="status-icon">🔊</i>
      <i class="status-icon">🔋</i>
      <i class="status-icon" @click="handleLogout" title="退出">✖</i>
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'

import 'element-plus/theme-chalk/el-loading.css'
import { out } from '../../api/auth'

const router = useRouter()
const currentTime = ref(new Date().toLocaleTimeString())
const user = ref({})
const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

// 加载本地用户信息
onMounted(() => {
  const info = localStorage.getItem('userinfo')
  if (info) {
    try {
      user.value = JSON.parse(info)
    } catch (e) {
      console.error('userinfo 解析失败:', e)
    }
  }

  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

let timer

// 退出函数（带 Element Plus Loading）
const handleLogout = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在退出，请稍候...',
    background: 'rgba(0, 0, 0, 0.4)',
  })

  try {
    await out()
    localStorage.removeItem('token')
    localStorage.removeItem('userinfo')
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
    ElMessage.error('退出失败，请稍后重试')
  } finally {
    loading.close()
  }
}
</script>

<style scoped>
.mac-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background: rgb(0 0 0 / 10%);
  backdrop-filter: blur(15px) saturate(180%);
  -webkit-backdrop-filter: blur(15px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.mac-navbar-left,
.mac-navbar-center,
.mac-navbar-right {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 25px;
  height: 25px;
  margin-right: 6px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  margin-left: 8px;
  font-size: 14px;
  color: #fff;
  opacity: 0.9;
}

.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0 8px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.status-icon {
  margin-left: 10px;
  cursor: pointer;
}

.status-icon:hover {
  opacity: 0.8;
}

.time {
  margin-left: 12px;
}
</style>
