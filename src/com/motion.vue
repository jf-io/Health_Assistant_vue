<template>
  <div class="motion_big_d_d">
    <van-nav-bar
      class="nav-bar"
      title="运动项目"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-sidebar v-model="active">
      <van-sidebar-item
        v-for="item in motion_text"
        :key="item.athleticProgramsID"
        :title="item.athleticPrograms"
        class="motion_text_class"
        @click="
          onChange_key(
            item.athleticProgramsID,
            item.athleticPrograms,
            item.consumesEnergy,
            item.exerciseTime,
          )
        "
      />
    </van-sidebar>

    <div class="Recorder">
      <div class="Recorder_text_title">添加运动</div>
      <div class="Recorder_text_content">
        {{ motion_text_data.athleticPrograms }}
      </div>
      <div class="Recorder_text_Heat">
        {{ motion_text_data.consumesEnergy }}<span>千卡/</span
        >{{ motion_text_data.exerciseTime }}<span>分钟</span>
      </div>
      <div>
        <van-field
          v-model="digit"
          type="digit"
          class="Recorder_text_input_field"
          label-align="center"
        />
        <div class="Recorder_text_input_div">
          <span>{{ Recorder_text_input_div_num }}</span
          >/<span>{{ digit }}分钟</span>
        </div>
      </div>
      <div class="Recorder_text_input_button">
        <van-button plain type="primary" @click="Recorder_text_input_button_res"
          >添加</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 请求运动项目
import { RecordingInitialWeightMo, UpdateMo } from '@/api/mo.js'
import { watch } from 'vue'
/* 获取当前日期 */
import { formattedTime } from '@/util/getTime'

import { UserStore } from '@/stores/user.js'
const userStore = UserStore()
const active = ref(0)
// 分钟
const digit = ref('')
const onChange_key = (
  athleticProgramsID,
  athleticPrograms,
  consumesEnergy,
  exerciseTime,
) => {
  motion_text_data.value.athleticPrograms = athleticPrograms
  motion_text_data.value.athleticProgramsID = athleticProgramsID
  motion_text_data.value.consumesEnergy = consumesEnergy
  motion_text_data.value.exerciseTime = exerciseTime
  // 发送数据
  motion_text_res.value.athleticProgramsID = athleticProgramsID
}

const motion_text = ref([])
// 初始化数据
const motion_text_data = ref({
  athleticProgramsID: 0,
  athleticPrograms: '',
  consumesEnergy: 0,
  exerciseTime: '',
})
//发送数据
const motion_text_res = ref({
  athleticProgramsID: 0,
  athleticPrograms: '',
  consumesEnergy: 0,
  exerciseTime: '',
})

const onClickLeft = () => {
  history.back()
}

//输入框变化时
const Recorder_text_input_div_num = ref(0)
watch(digit, () => {
  if (digit.value == '') {
  }
  Recorder_text_input_div_num.value =
    (Number(digit.value) * motion_text_data.value.consumesEnergy) /
    Number(motion_text_data.value.exerciseTime)
  motion_text_res.value.consumesEnergy = Recorder_text_input_div_num.value

  console.log(motion_text_res.value)
})
// 发起请求
const Recorder_text_input_button_res = () => {
  if (digit.value == '') {
    return
  }

  motion_text_res.value.exerciseTime = formattedTime
  UpdateMo(motion_text_res.value)
  //存进本地仓库
  userStore.operationEnergy = Recorder_text_input_div_num.value
  console.log(userStore.operationEnergy)
  //清空输入框
  digit.value = ''
}

onMounted(async () => {
  const res = await RecordingInitialWeightMo()
  motion_text.value = res.data.data
  console.log(res)
  motion_text_data.value.athleticPrograms = res.data.data[0].athleticPrograms
  motion_text_data.value.athleticProgramsID =
    res.data.data[0].athleticProgramsID
  motion_text_data.value.consumesEnergy = res.data.data[0].consumesEnergy
  motion_text_data.value.exerciseTime = res.data.data[0].exerciseTime
})
</script>

<style>
.motion_big_d_d {
  background-color: #d5d2d243;
}
.nav-bar {
  position: fixed; /* 固定在顶部 */
  top: 0; /* 距离顶部0 */
  left: 0; /* 距离左侧0 */
  right: 0; /* 距离右侧0 */
  z-index: 1000; /* 确保在其他元素之上 */
}
.motion_text_class {
  font-size: 12px;
  font-weight: 700;
}
.Recorder {
  width: 280px;
  height: 550px;
  background-color: #ffffff;
  position: sticky;
  bottom: 50px;
  left: 90px;
  padding-top: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25px;
}
.Recorder_text_title {
  font-size: 15px;
  font-weight: 700;
}
.Recorder_text_content {
  color: #0e0e0e;
  font-size: 19px;
  font-weight: 700;
}
.Recorder_text_Heat {
  color: #7c7878cb;
  font-size: 16px;
}
.Recorder_text_input_field {
  width: 150px;
  border-bottom: #7d817baa solid 1px;
}
.Recorder_text_input_button {
  margin: 50px auto;
}
.Recorder_text_input_div {
  margin: 0 auto;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #7c7878cb;
}
</style>
