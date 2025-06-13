<template>
  <div>
    <transition name="slide-fade-smooth" mode="out-in">
      <router-view />
    </transition>
    <Menubar />
  </div>
</template>

<script setup>
import Menubar from '../components/menubar/Index.vue'
</script>

<style scoped>
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
