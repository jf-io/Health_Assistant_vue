<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showNotify } from 'vant'
import { UserStore } from '@/stores/user.js'
// 发送邮箱验证码
import { getEmailCode, register, LogCode, login } from '@/api/user.js'
/* 路由跳转 */
//首先在setup中定义
const router = useRouter()
/* 控制登录与注册 t登录 f注册*/
const re_control = ref(true)

/* 数据*/
/*注册数据 */
const re_form = ref({
  email: '',
  userPassword: '',
  emailCode: '',
  Confirm_your_password: '',
})

const onClickLeft = () => {
  /* 返回首页*/
}
const onClickRight = () => {
  /* 注册*/
  re_control.value = false
}
/* 登录表单校验规则*/

/* 注册 */
const onClickLeftLog = () => {
  /* 返回登录*/
  re_control.value = true
}
// 获取按钮的实例，方便设置60s后才能点击
const re_sty = ref()
// 创建按钮变量控制不可点击状态
const disabled_code = ref(false)
// 创建计时器文本变量
const time_text = ref(60)
// 定时器
let timer = ref()
/* 发送邮箱验证码 */
const re_but = async () => {
  disabled_code.value = true
  /* 开启定时器*/
  timer.value = setInterval(function () {
    // console.log("hello world");
    time_text.value -= 1
    // 如果倒计时结束，则可以点击
    if (time_text.value == 0) {
      time_text.value = 60
      disabled_code.value = false
      clearInterval(timer.value)
    }
  }, 1000)
  const req = await getEmailCode(re_form.value)
  console.log(req.data.code)
  // 如果用户已存在，则提示
  if (req.data.code == 400) {
    showNotify({ type: 'danger', message: req.data.msg })
  }
  // 修改按钮为不可点击
}

/* 表单校验规则 */
// 邮箱规则
const re_email_rules = ref([
  { required: true, message: '请填写邮箱' },
  {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱',
  },
])
// 密码规则
const re_password_rules = ref([
  { required: true, message: '请填写密码' },
  { pattern: /^\S+$/, message: '不能存在空格' },
])

/* 跳转定时器???????????????????????????????????? */
let re_outTime = ref()
// 发起注册
const register_but = async () => {
  console.log(re_form.value)
  const req = await register(re_form.value)
  console.log(req)
  if (req.data.code == 200) {
    UserStore().token = req.data.data
    /* 提示消息*/
    // 成功通知
    showNotify({ type: 'success', message: '注册成功' })
    /* 等到两秒后跳转*/
    re_outTime.value = setTimeout(function () {
      router.push({ path: '/Recording' })
    }, 3000)
  }
}

/* 登录数据 */
const form_login = ref({
  email: '',
  userPassword: '',
  emailCodeUUID: '',
  emailCode: '',
})
/* 登录校验规则 */
/* 登录验证码按钮计时器 */
let logTime = ref()
/* 倒计时计时器 */
let log_time_text = ref(60)
/* 控制按钮使用 */
let log_disabled_code = ref(false)
/* 登录发送验证码 */
const log_code_but = async () => {
  /* 开启倒计时*/
  logTime.value = setInterval(function () {
    log_disabled_code.value = true
    log_time_text.value -= 1
    // 如果倒计时结束，则可以点击
    if (log_time_text.value == 0) {
      log_time_text.value = 60
      log_disabled_code.value = false
      clearInterval(logTime.value)
    }
  }, 1000)
  // 发送验证码
  const req = await LogCode(form_login.value)

  // 将验证码唯一标识放入仓库
  UserStore().log_code_UUId = req.data.data
  form_login.value.emailCodeUUID = req.data.data
}

/* 跳转页面计时器 */
const tiaozhuan = ref()

/* 发起登录请求 */
const log_but = async () => {
  const req = await login(form_login.value)
  UserStore().token = req.data.data.token
  // 成功通知
  showNotify({ type: 'success', message: '登录成功，正在前往首页' })
  tiaozhuan.value = setTimeout(function () {
    router.push({ path: '/Recording' })
  }, 3000)
}

onMounted(() => {})

/* 在退出本页时清除计数器 */
onUnmounted(() => {
  clearInterval(timer.value)
  clearInterval(tiaozhuan.value)
  clearInterval(re_outTime.value)
})
</script>

<template>
  <div>
    <div class="log_n">
      <!-- 登录栏-->
      <van-nav-bar
        title="用户登录"
        left-text="返回"
        right-text="注册"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        v-show="re_control"
      />
      <!-- 登录表单 -->
      <van-form @submit="log_onSubmit" class="log_form" v-show="re_control">
        <van-cell-group inset>
          <van-field
            v-model="form_login.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="re_email_rules"
          />
          <van-field
            v-model="form_login.userPassword"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="re_password_rules"
          />
          <div class="yanznehngma">
            <van-field
              v-model="form_login.emailCode"
              type="text"
              name="验证码"
              label="验证码"
              placeholder="请填写验证码"
              :rules="[{ required: true, message: '请填写验证码' }]"
            />
            <van-button
              :disabled="log_disabled_code"
              plain
              type="primary"
              class="Captcha_but"
              @click="log_code_but"
              >{{
                log_disabled_code ? log_time_text : '发送验证码'
              }}</van-button
            >
          </div>
        </van-cell-group>
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          @click="log_but"
        >
          提交
        </van-button>
      </van-form>
    </div>
    <div class="re_n">
      <!-- 注册栏-->
      <van-nav-bar
        title="用户注册"
        left-text="返回登录"
        left-arrow
        @click-left="onClickLeftLog"
        v-show="!re_control"
      />
      <van-form @submit="re_onSubmit" v-show="!re_control">
        <van-cell-group inset>
          <van-field
            v-model="re_form.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="re_email_rules"
          />

          <van-field
            v-model="re_form.userPassword"
            name="密码"
            label="密码"
            placeholder="请输入你的密码"
            :rules="re_password_rules"
          />
          <van-field
            v-model="re_form.Confirm_your_password"
            name="确认密码"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ required: true, message: '请再次填入你的密码' }]"
          />
          <van-field
            v-model="re_form.emailCode"
            name="邮箱验证码"
            label="邮箱验证码"
            placeholder="邮箱验证码"
            :rules="[{ required: true, message: '请填入邮箱验证码' }]"
          />
          <van-button
            ref="re_sty"
            :disabled="disabled_code"
            plain
            type="primary"
            class="Captcha_but"
            @click="re_but"
            >{{ disabled_code ? time_text : '发送验证码' }}</van-button
          >
        </van-cell-group>
        <div class="form_but">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="register_but"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style>
.log_form {
  margin: 15px auto;
}
.Captcha_but {
  width: 102px;
  /* height:12px; */
  left: 240px;
  bottom: 49px;
}
.form_but {
  margin: 0 auto;
  width: 250px;
}
</style>
