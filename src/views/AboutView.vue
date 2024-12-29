<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const active = ref(0)

const onChange = index => {
  console.log(index)
  if (index == 0) {
    router.push({ path: '/Recording' })
  }
  if (index == 1) {
    router.push({ path: '/square' })
  }
  if (index == 2) {
    router.push({ path: '/healthytravel' })
  }
  if (index == 3) {
    router.push({ path: '/myMsg' })
  }
}
</script>

<template>
  <div class="Home_big">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <div class="Tail">
      <van-tabbar v-model="active" @change="onChange" fixed="true">
        <van-tabbar-item icon="coupon-o">记录</van-tabbar-item>
        <van-tabbar-item icon="fire-o">查看记录</van-tabbar-item>

        <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<style>
.Home_big {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
}

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
