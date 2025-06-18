<template>
  <div class="tree-aside">
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="defaultProps"
      @node-click="handleClick"
      @node-expand="onExpand"
      @node-collapse="onCollapse"
      highlight-current
      default-expand-all
      :expand-on-click-node="false"
      class="mac-tree"
    />
  </div>
</template>

<script setup>
import {ref } from 'vue'

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  defaultProps: {
    type: Object,
    default: () => ({
      children: 'children',
      label: 'label'
    })
  }
})

const emit = defineEmits(['tree-click'])

function handleClick(node) {
  emit('tree-click', node)
}

// 展开/收起图标旋转动画处理
function onExpand(data, node, comp) {
  const icon = node.$el.querySelector('.el-tree-node__expand-icon')
  if (icon) icon.classList.add('expanded')
}

function onCollapse(data, node, comp) {
  const icon = node.$el.querySelector('.el-tree-node__expand-icon')
  if (icon) icon.classList.remove('expanded')
}
</script>

<style scoped>
.tree-aside {
  background-color: transparent;
  padding: 8px;
}

/* 全局字体与颜色贴近 macOS */
.mac-tree {
  background-color: transparent;
  color: #1d1d1f;
  padding: 0 8px;
  font-weight:500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  
}

/* 节点 hover 与选中状态 */
.el-tree-node__content {
  border-radius: 12px;
  padding: 6px 12px;
  margin: 6px 0;
  line-height: 32px;
  height: 32px;
  transition: all 0.25s ease-in-out;
}

.el-tree-node__content:hover {
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.el-tree-node.is-current > .el-tree-node__content {
  background-color: #d0e4ff;
  font-weight: 600;
  color: #007aff;
  box-shadow: inset 0 0 0 1px #007aff;
}

/* 子节点缩进优化 */
.el-tree-node__children {
  border-left: none !important;
  padding-left: 12px;
}

/* 展开/收起图标动画 */
.el-tree-node__expand-icon {
  transition: transform 0.3s ease;
}

.el-tree-node__expand-icon.expanded {
  transform: rotate(90deg);
}

/* 自定义滚动条（mac风） */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
/* 深度作用于 el-tree 内部的节点内容 */
::v-deep(.el-tree-node__content) {
  border-radius: 12px;
  padding: 6px 12px;
  margin: 6px 0;
  line-height: 32px;
  height: 32px;
  transition: all 0.25s ease-in-out;
}

::v-deep(.el-tree-node__content:hover) {
  background-color: #e5f0ff;
  color: #007aff;
  cursor: pointer;
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(0, 122, 255, 0.15);
}

</style>
