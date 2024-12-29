<template>
  <div>
    <van-nav-bar
      title="修改密码"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username_data.userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            { pattern: /^\S+$/, message: '不能存在空格' },
          ]"
        />
      </van-cell-group>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="onSubmit"
      >
        提交
      </van-button>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { updateUserName } from '@/api/user.js'
import { showNotify } from 'vant'
const onClickLeft = () => history.back()
const username_data = ref({
  userName: '',
})

//定时器
const timer = ref(null)
// 表单提交
const onSubmit = () => {
  updateUserName(username_data.value)
  // 成功通知
  showNotify({ type: 'success', message: '修改成功' })
  // 三秒后返回
  timer.value = setTimeout(() => {
    history.back()
  }, 3000)
}

// 清除定时器
onBeforeUnmount(() => {
  clearTimeout(timer.value)
})
</script>

<style></style>
