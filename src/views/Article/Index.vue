<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import VerticalMenu from '../../components/menubar/VerticalMenu.vue'

const treeData = ref([
  {
    label: '文章列表',
    id: 0,
    component: defineAsyncComponent(() => import('./components/ArticleList.vue'))
  },
  {
    label: '文章创作',
    id: 1,
    component: defineAsyncComponent(() => import('./components/WriteArticle.vue'))
  }
])

const defaultProps = { children: 'children', label: 'label' }
const currentComponent = ref(treeData.value[0].component)

// 响应式宽度，默认200px
const asideWidth = ref('200px')

function updateWidth() {
  const w = window.innerWidth
  if (w < 768) {
    asideWidth.value = '80px'  // 小屏窄一点
  } else {
    asideWidth.value = '200px' // 大屏正常宽度
  }
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)

  // 禁止页面滚动
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)

  // 恢复滚动
  document.body.style.overflow = ''
})

function handleTreeClick(data) {
  currentComponent.value = data.component || null
}
</script>

<template>
  <div class="mac-file-frame" >
    <el-container >
      <el-aside :style="{ width: asideWidth }" class="tree-aside">
        <VerticalMenu
          :treeData="treeData"
          :defaultProps="defaultProps"
          @tree-click="handleTreeClick"
        />
      </el-aside>

      <el-main class="article-main" style="padding: 12px;">
        <component v-if="currentComponent" :is="currentComponent" />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.tree-aside {
  transition: width 0.3s ease;
  overflow: hidden;
}
</style>
