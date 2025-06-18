<template>
  <div class="mac-login">
    <div class="login-box">
      <img
        class="avatar"
        src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png"
        alt="User Avatar"
      />
      <input
        v-model="username"
        type="text"
        placeholder="用户名"
        class="input"
      />
      <input
        v-model="password"
        type="password"
        placeholder="密码"
        class="input"
      />
      <button @click="handleLogin" class="login-btn">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

function handleLogin() {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }
  alert(`欢迎你，${username.value}`)
}
</script>

<style scoped>
.mac-login {
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 毛玻璃核心样式 */
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
