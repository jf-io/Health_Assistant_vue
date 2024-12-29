<template>
  <div>
    <van-cell-group inset>
      <van-cell
        title="姓名"
        :value="user_data.userName"
        @click="ModifyUsername"
      />
      <van-cell title="邮箱" :value="user_data.userEmail" />
      <van-cell title="修改密码" @click="ChangePassword"
        ><van-icon name="arrow" />
      </van-cell>
    </van-cell-group>

    <!-- 修改密码弹出层 -->

    <van-popup v-model:show="show" :style="{ padding: '64px' }">
      <!-- 原密码与新密码对比 -->
      <van-form @submit="newPasswordOnSubmit">
        <van-cell-group inset>
          <van-field
            v-model="ChangePassword_data.userPassword"
            name="原密码"
            label="原密码"
            placeholder="原密码"
            :rules="[{ required: true, message: '请填写原密码' }]"
          />
          <van-field
            v-model="ChangePassword_data.newPassword"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
  <!-- 退出登录 -->
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { getUserInfo, updateUserPassword } from '@/api/user.js'
import { useRouter } from 'vue-router'
const router = useRouter()
// 请求回来的信息
const user_data = ref({})

// 修改用户名
const ModifyUsername = () => {
  router.push({ path: '/ChangeUser' })
  console.log('修改用户名')
}

//控制弹出层
const show = ref(false)
// 请求修改密码数据
const ChangePassword_data = ref({
  userPassword: '',
  newPassword: '',
})

// 修改密码
const ChangePassword = () => {
  show.value = true
}

//修改密码提交表单
const newPasswordOnSubmit = async values => {
  // 发起请求
  const req = await updateUserPassword(ChangePassword_data.value)
}

onMounted(async () => {
  const user = await getUserInfo()
  console.log(user)
  user_data.value = user.data.data
})
</script>
<style></style>
