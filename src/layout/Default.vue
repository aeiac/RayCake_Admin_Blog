<template>
  <Menubar @icon-click="openWindow" />

  <div v-for="win in windows" :key="win.id" class="window-box">
    <WindowBox :title="win.title" :component="win.component" @close="closeWindow(win.id)" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import Menubar from '../components/menubar/Index.vue'
import WindowBox from '../components/window/WindowBox.vue'

const windows = ref([])
let idCount = 0

const pageMap = {
  0: { title: 'Finder', component: 'Finder' },
  1: { title: 'Map', component: 'Map' },
  2: { title: 'Messages', component: 'Messages' },
  3: { title: 'Notes', component: 'Notes' },
  // 按需补充
}

function openWindow(index) {
  const page = pageMap[index]
  if (!page) return
  windows.value.push({
    id: ++idCount,
    title: page.title,
    component: defineAsyncComponent(() => import(`./views/${page.component}.vue`))
  })
}

function closeWindow(id) {
  windows.value = windows.value.filter(w => w.id !== id)
}
</script>
