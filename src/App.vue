<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeViewVue from './views/HomeView.vue'
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<style>
* {
  margin: 0;
  padding: 0;
}

/* 动画 */

.router-view {
  flex: 1; /* 使内容区域占据剩余空间 */
  overflow-y: auto; /* 允许内容区域滚动 */
}

.Tail {
  width: 100%; /* 宽度100% */
  background-color: #fff; /* 可选：设置背景颜色 */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* 可选：添加阴影效果 */
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s ease-out;
}

.fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
