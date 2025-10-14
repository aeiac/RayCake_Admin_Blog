<template>
  <div class="mac-login">
    <div class="login-box">
      <img class="avatar"
           src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png"
           alt="User Avatar" />
      <input v-model="username" type="text" placeholder="用户名" class="input" />
      <input v-model="password" type="password" placeholder="密码" class="input" />
      <button class="login-btn" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { login } from '../../api/auth.js'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

// 禁止滚动
function preventDefault(e: Event) { e.preventDefault() }
onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('touchmove', preventDefault, { passive: false })
})
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('touchmove', preventDefault)
})

async function handleLogin() {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  // 🔹 全屏 loading
  const loading = ElLoading.service({
    lock: true,
    text: '登录中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const result = await login(username.value, password.value)

    if (result?.code !== 200) {
      ElMessage.error(result.msg || '登录失败')
      return
    }
    localStorage.setItem('token', result.data.token)
    localStorage.setItem('userinfo', JSON.stringify(result.data))
	
    ElMessage.success('登录成功！')
    router.push('/index')
  } catch (err) {
    console.error(err)
    ElMessage.error('登录请求失败，请稍后重试')
  } finally {
    loading.close() // 🔹 关闭全屏 loading
  }
}
</script>

<style scoped>
html, body {
  height: 100%;
  overflow: hidden;
}

.mac-login {
  height: 100vh;
  background: url('../../../public/login-back.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 300px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 20%;
  margin-bottom: 20px;
  border: 2px solid white;
}

.input {
  width: 100%;
  padding: 10px 14px;
  margin: 8px 0;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.login-btn {
  margin-top: 16px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-btn:hover {
  background-color: #3698ff;
}
</style>
