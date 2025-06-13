<!-- components/CategoryTree.vue -->
<template>
  <div class="tree-aside">
    <div class="tree-header">列表导航</div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-click="handleClick"
      highlight-current
      default-expand-all
    />
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['tree-click'])

const treeData = ref([
  { label: '全部文章', id: 'all' },
  { label: '已发布', id: 'published' },
  { label: '草稿', id: 'draft' },
  { label: '已归档', id: 'archived' },
  { label: '已删除', id: 'del' },
])

const defaultProps = {
  children: 'children',
  label: 'label',
}

function handleClick(node) {
  emit('tree-click', node)
}
</script>

<style scoped>
.tree-aside {
  background: #f9f9f9;
  padding: 20px 10px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  height: 100%;
}

.tree-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
