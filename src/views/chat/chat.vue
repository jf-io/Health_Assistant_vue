<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <van-nav-bar
        title="健康助手"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>

    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.isMine ? 'mine' : 'other']"
      >
        <p>{{ message.text }}</p>
        <!-- 如果是AI的消息，显示保存按钮 -->
        <button
          v-if="!message.isMine"
          class="save-button"
          @click="saveMessage(message.text)"
        >
          保存到我的方案
        </button>
      </div>
    </div>

    <div class="input-area">
      <input v-model="inputText" placeholder="请输入问题" />
      <button @click="sendSSEMessage" class="send-button" :disabled="isSending">
        发送
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount, nextTick } from 'vue'
import { showToast } from 'vant'
import router from '@/router'
import { insertMyPlan } from '@/api/myplan.js'
/* 获取当前日期 */
import { formattedTime } from '@/util/getTime'
export default {
  name: 'Home',

  setup() {
    const inputText = ref('') // 要发送的问题
    const messages = ref([
      { text: '你好，我是健康助手，有什么我能帮助你的吗？', isMine: false },
    ])
    const eventSource = ref(null) // EventSource 实例
    const messagesContainer = ref(null) // 用于引用消息容器
    const isSending = ref(false) // 用于标记是否正在发送消息

    // 在组件卸载前关闭 EventSource
    onBeforeUnmount(() => {
      if (eventSource.value) {
        eventSource.value.close()
      }
    })

    const sendSSEMessage = () => {
      if (!inputText.value.trim()) {
        // 检查输入是否为空
        showToast('请输入问题！')
        return
      }

      if (isSending.value) {
        // 如果正在发送消息，阻止发送
        showToast('请等待助手回答完成！')
        return
      }

      isSending.value = true // 设置为正在发送状态
      messages.value.push({ text: inputText.value, isMine: true })
      messages.value.push({ text: '', isMine: false })

      eventSource.value = new EventSource(
        'http://127.0.0.1:8081/chat?content=' + inputText.value,
      )

      eventSource.value.onmessage = async event => {
        const data = JSON.parse(event.data)
        console.info(data.result)
        messages.value[messages.value.length - 1].text += data.result

        // 确保 DOM 更新后滚动到最新消息
        await nextTick()
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }

      eventSource.value.onerror = event => {
        console.error('EventSource failed:', event)
        eventSource.value.close()
        eventSource.value = null
        isSending.value = false // 发送结束，重置状态
      }

      // 清空输入框
      inputText.value = ''
    }

    // 发送的数据
    const myplanData = ref({
      myPlanId: '',
      userID: '',
      myPlanCoent: '',
      myPlanTime: '',
    })

    // 保存消息
    const saveMessage = async message => {
      // 这里可以实现保存功能，比如调用API或将消息保存到本地
      console.log('保存的消息:', message)
      myplanData.value.myPlanCoent = message
      myplanData.value.myPlanTime = formattedTime
      // 发起保存方案的请求
      const req = await insertMyPlan(myplanData.value)
      console.log(req)
    }

    // 返回上一级
    const onClickLeft = () => {
      router.push('/Recording')
    }

    return {
      inputText,
      messages,
      sendSSEMessage,
      messagesContainer,
      onClickLeft,
      saveMessage,
      isSending,
    }
  },
}
</script>

<style>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative; /* 使用相对定位 */
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* 使用列方向布局 */
}

.nav-bar {
  position: sticky; /* 使用粘性定位 */
  top: 0; /* 固定在顶部 */
  z-index: 10; /* 确保在其他元素之上 */
}

.messages {
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
  font-size: 12px;
  font-weight: 700;
  flex: 1; /* 使消息区域占据剩余空间 */
}

.message {
  max-width: 70%; /* 最大宽度设置为 70% */
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  line-height: 1.5;
  word-wrap: break-word; /* 允许单词换行 */
}

.mine {
  align-self: flex-end;
  background-color: #dcf8c6; /* 自己的消息背景色 */
}

.other {
  align-self: flex-start;
  background-color: #fff; /* 其他人的消息背景色 */
  border: 1px solid #ddd; /* 其他人的消息边框 */
}

.input-area {
  position: sticky; /* 使用粘性定位 */
  bottom: 0; /* 固定在底部 */
  left: 0;
  width: 100%;
  display: flex;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
  justify-content: space-around;
  align-items: center;
}

input {
  height: 20px; /* 设置输入框高度 */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 15px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background-color: #3f93ee;
  color: white;
  cursor: pointer;
}

.send-button {
  font-size: 15px;
  width: 90px;
  height: 40px;
}

/* 新增保存按钮的样式 */
.save-button {
  margin-top: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #5de1c4; /* 保存按钮的背景色 */
  color: white;
  cursor: pointer;
}
</style>
