<script setup>
import { ref, defineAsyncComponent } from 'vue'
import VerticalMenu from '../../components/menubar/VerticalMenu.vue'

const treeData = ref([
  {
    label: '文章列表',
    id: 0,
    component: defineAsyncComponent(() => import('./components/ArticleList.vue'))
  },
  {
    label: '文章数据',
    id: 1,
    component: defineAsyncComponent(() => import('./components/ArticleList.vue'))
  }
])

const defaultProps = { children: 'children', label: 'label' }

// 默认加载第一条组件
const currentComponent = ref(treeData.value[0].component)

function handleTreeClick(data) {
  currentComponent.value = data.component || null
}
</script>

<template>
  <div class="mac-file-frame">
    <el-container style="height: 100%">
      <el-aside class="tree-aside">
        <VerticalMenu
          :treeData="treeData"
          :defaultProps="defaultProps"
          @tree-click="handleTreeClick"
        />
      </el-aside>

      <el-main class="article-main">
        <component v-if="currentComponent" :is="currentComponent" />
      </el-main>
    </el-container>
  </div>
</template>
