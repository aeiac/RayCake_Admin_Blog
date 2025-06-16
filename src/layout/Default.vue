<script setup>
import { ref, defineAsyncComponent } from 'vue'
import Menubar from '../components/menubar/Index.vue'
import WindowBox from '../components/window/WindowBox.vue'

// 窗口列表
const windows = ref([])
let idCount = 0

// 图标点击状态，用于显示小黑点
const clickedIndices = ref([])

// 页面映射：使用 defineAsyncComponent 明确静态路径（解决动态导入错误）
const pageMap = {
  0: {
    title: '文章管理',
    component: defineAsyncComponent(() => import('../views/Article/Index.vue'))
  }
}

// 通过索引找当前窗口是否已存在
function findWindowByIndex(index) {
  const page = pageMap[index]
  return windows.value.find(w => w.title === page?.title)
}

// 通过 title 找对应索引
function findIndexByTitle(title) {
  return Object.entries(pageMap).find(([index, page]) => page.title === title)?.[0]
}

// 切换窗口（打开或关闭）
function toggleWindow(index) {
  const page = pageMap[index]
  if (!page) return

  const existing = findWindowByIndex(index)
  if (existing) {
    closeWindow(existing.id)
  } else {
    windows.value.push({
      id: ++idCount,
      title: page.title,
      component: page.component
    })
    if (!clickedIndices.value.includes(index)) {
      clickedIndices.value.push(index)
    }
  }
}

// 关闭窗口
function closeWindow(id) {
  const win = windows.value.find(w => w.id === id)
  if (!win) return

  const index = findIndexByTitle(win.title)
  if (index !== undefined) {
    clickedIndices.value = clickedIndices.value.filter(i => i !== Number(index))
  }
  windows.value = windows.value.filter(w => w.id !== id)
}
</script>

<template>
  <!-- 窗口区 -->
  <div v-for="win in windows" :key="win.id" class="window-box">
    <WindowBox
      :title="win.title"
      :component="win.component"
      @close="closeWindow(win.id)"
    />
  </div>

  <!-- 底部菜单栏 -->
  <Menubar
    :clickedIndices="clickedIndices"
    @icon-click="toggleWindow"
    @icon-close="closeWindow"
  />
</template>
