<template>
  <div class="mac-navbar">
    <!-- 左侧应用图标 -->
    <div class="mac-navbar-left">
      <img src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png" alt="App Icon" class="app-icon" />
      <span class="app-name">Finder</span>
    </div>

    <!-- 中间菜单 -->
    <div class="mac-navbar-center">
      <ul class="menu-list">
        <li class="menu-item">文件</li>
        <li class="menu-item">编辑</li>
        <li class="menu-item">显示</li>
        <li class="menu-item">窗口</li>
        <li class="menu-item">帮助</li>
      </ul>
    </div>

    <!-- 右侧状态图标 -->
    <div class="mac-navbar-right">
      <i class="status-icon">🔊</i>
      <i class="status-icon">🔋</i>
      <i class="status-icon">👤</i>
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref(new Date().toLocaleTimeString())

let timer
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>


<style scoped>
.mac-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.1);
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
  width: 18px;
  height: 18px;
  margin-right: 6px;
  border-radius: 4px;
}

.app-name {
  font-weight: 500;
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

.time {
  margin-left: 12px;
}
</style>
