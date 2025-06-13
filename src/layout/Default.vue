<template>
  <div>
    <div
      class="draggable-container"
      :style="{ transform: `translate(${pos.x}px, ${pos.y}px)` }"
      @mousedown="startDrag"
      @touchstart.prevent="startDragTouch"
    >
      <transition name="slide-fade-smooth" mode="out-in">
        <router-view />
	
      </transition>
    </div>
    <Menubar />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menubar from '../components/menubar/Index.vue'

const pos = ref({ x: 0, y: 0 })
const dragging = ref(false)
const start = { x: 0, y: 0 }

function startDrag(e) {
  dragging.value = true
  start.x = e.clientX - pos.value.x
  start.y = e.clientY - pos.value.y
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!dragging.value) return
  pos.value.x = e.clientX - start.x
  pos.value.y = e.clientY - start.y
}

function stopDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

// 移动端触摸支持
function startDragTouch(e) {
  dragging.value = true
  const touch = e.touches[0]
  start.x = touch.clientX - pos.value.x
  start.y = touch.clientY - pos.value.y
  window.addEventListener('touchmove', onDragTouch, { passive: false })
  window.addEventListener('touchend', stopDragTouch)
}

function onDragTouch(e) {
  if (!dragging.value) return
  const touch = e.touches[0]
  pos.value.x = touch.clientX - start.x
  pos.value.y = touch.clientY - start.y
}

function stopDragTouch() {
  dragging.value = false
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDragTouch)
}
</script>

<style scoped>
.draggable-container {
  cursor: grab;
  user-select: none;
  position: relative; /* 你可以根据需求调整，比如 fixed */
  /* 注意不要让菜单一起拖动，所以菜单单独放外面 */
}
.draggable-container:active {
  cursor: grabbing;
}

.slide-fade-smooth-enter-active,
.slide-fade-smooth-leave-active {
  position: relative;
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-smooth-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.97);
}

.slide-fade-smooth-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.slide-fade-smooth-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.slide-fade-smooth-leave-to {
  opacity: 0;
  transform: translateX(-80px) scale(0.97);
}
</style>
