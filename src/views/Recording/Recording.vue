<template>
  <div class="Reco_d">
    <!-- 我的方案和唤起ai -->
    <div class="myPlan_ai">
      <div class="myPlan" @click="myplan_but">我的方案</div>
      <div class="ai">
        <router-link to="/chat" class="aiLink">健康AI助手</router-link>
      </div>
    </div>
    <div class="weightShow">
      <!-- ai -->
      <!-- <van-button>dian</van-button> -->
      <!-- 头部-->
      <div class="initial_weight" @click="showPopup">
        {{ weight_form.initialWeight }}
      </div>
      <span class="initial_weight_text">初始</span>
      <!-- 底部弹出 -->
      <van-popup
        v-model:show="showBottom"
        position="bottom"
        :style="{ height: '60%' }"
      >
        <!-- 显示输入的体重 -->
        <div class="shw_weight" v-if="nu_key == 0">
          <span>{{ weight_form.initialWeight }}</span
          >公斤
        </div>
        <!-- 输入初始体重 -->
        <van-number-keyboard
          :show="show1"
          extra-key="."
          @blur="num_blur1"
          @input="onInput1"
          @delete="onDelete1"
          class="num_weight"
          v-if="nu_key == 0"
        />
        <!-- 显示输入的体重 -->
        <div class="shw_weight" v-if="nu_key == 1">
          <span>{{ weight_form.targetWeight }}</span
          >公斤
        </div>
        <!-- 输入目标体重 -->
        <van-number-keyboard
          :show="show2"
          extra-key="."
          @blur="num_blur2"
          @input="onInput2"
          @delete="onDelete2"
          class="num_weight"
          v-if="nu_key == 1"
        />
      </van-popup>

      <!-- 进度条-->
      <van-progress
        :percentage="percentageNUM"
        color="#74dc8e"
        class="Progress_bar_percentage"
      />
      <!-- 目标体重 -->
      <div class="target_weight" @click="showPopup2">
        {{ weight_form.targetWeight }}
      </div>
      <span class="target_weight_text">目标</span>
    </div>
    <!-- 头部-->
    <!-- 饮食&运动 -->
    <div class="total_energy">
      <!-- 时间-->
      <div class="total_time">{{ formattedTime }}</div>
      <div class="total_energy_detail">
        <span class="can_eat">还可吃(千卡)</span>
        <!-- 后续从后端获取 -->
        <div class="can_eat_text">
          {{
            Number(userStore.budget_text_number.BudgetAlories) -
              Number(calculateCalorieNumber) +
              Number(userStore.operationEnergy) <
            0
              ? 0
              : Number(userStore.budget_text_number.BudgetAlories) -
                Number(calculateCalorieNumber) -
                Number(userStore.operationEnergy)
          }}
        </div>
        <span class="equal_sign">=</span>
        <span class="budget">预算</span>
        <div class="budget_text" @click="budget">
          {{ userStore.budget_text_number.BudgetAlories }}
        </div>
        <span class="minus_sign">-</span>
        <span class="diet">饮食</span>
        <div class="diet_text">{{ calculateCalorieNumber }}</div>
        <span class="plus">+</span>
        <span class="motion">运动</span>
        <div class="motion_text">{{ userStore.operationEnergy }}</div>
      </div>
      <div class="food_motion">
        <!-- 记录食物和运动 -->
        <div class="breakfast" @click="breakfast">早餐</div>
        <div class="lunch" @click="lunch">午餐</div>
        <div class="dinner" @click="dinner">晚餐</div>
        <div class="motion_d" @click="motion">运动</div>
      </div>
    </div>
    <!-- 饮食&运动 -->

    <!-- 菜单栏部-->
    <div class="middle_part">
      <!-- 设置垂直间距 -->
      <van-row justify="space-between" :gutter="[20, 20]" class="row_div">
        <van-col span="12">
          <div class="weight_div" @click="toWeight_recording">
            <span>记录体重</span>
            <div class="wrap">
              <span class="wrap_kg"
                >{{ weight_form.currentWeight
                }}<span class="wrap_kg_text">公斤</span></span
              >
            </div>
          </div></van-col
        >
        <van-col span="12"><div class="step_div">步数：13560</div></van-col>
      </van-row>
    </div>
    <!-- 菜单栏部-->
    <!-- 记录体重弹出层 -->
    <!-- 右侧弹出 -->
    <van-popup
      v-model:show="weight_po"
      position="right"
      :style="{ width: '60%', height: '100%' }"
    >
      <div class="weight_po_div">
        <div>2002-10-11</div>
        <div>当前体重</div>
      </div>
      <div class="weight_po_number_show">
        <div class="weight_po_number_show_weight">
          {{ weight_form.currentWeight }}<span>公斤</span>
        </div>
        <div class="weight_po_number_show_weight2">————————</div>
        <div class="weight_po_number_show_weight3">体重</div>
      </div>
      <!-- 当前记录体重数字框 -->
      <van-number-keyboard
        show="true"
        theme="custom"
        extra-key="."
        @blur="weight_po_blur"
        @input="weight_po_inp"
        @delete="weight_po_del"
      />
    </van-popup>
    <!-- 摄入食物记录 -->
    <!-- 右侧弹出 -->
    <van-popup
      v-model:show="foodShowRight"
      position="right"
      :style="{ width: '50%', height: '100%' }"
      class="foodShowRight"
      @close="aiShowLeftClose"
    >
      <van-nav-bar left-text="关闭" left-arrow @click-left="onClickLeft" />
      <div class="notice_bar_div">
        <van-notice-bar
          color="#1989fa"
          background="#ecf9ff"
          left-icon="info-o"
          class="foodShowRight_div_notice-bar"
        >
          不知道摄入了多少千卡？唤醒健康AI，帮你计算！
        </van-notice-bar>
        <van-icon
          name="smile-comment-o"
          dot
          size="45"
          color="#1989fa"
          @click="aiShowLeftClick"
        />
      </div>
      <div class="foodShowRight_div">
        <!-- 纯数字键盘 -->
        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
        <van-cell-group inset>
          <van-field
            label-align="center"
            v-model="number"
            type="number"
            size="large"
            class="foodShowRight_div_input"
          />
        </van-cell-group>
      </div>
      <div class="foodShowRight_div2_text">单位：千卡</div>

      <van-button
        plain
        type="primary"
        class="Save_button_div"
        @click="SaveButton"
        >确定</van-button
      >
    </van-popup>

    <!-- 开始计算食物千卡ai唤醒 -->
    <!-- 弹出层 -->
    <!-- 左侧弹出 -->
    <van-popup
      v-model:show="aiShowLeft"
      position="left"
      :style="{ width: '50%', height: '100%' }"
      class="aiShowLeft_div"
    >
      <chatFood></chatFood>
    </van-popup>
    <!-- 结束计算食物千卡ai唤醒 -->

    <!-- 摄入食物记录 -->

    <!-- 预算摄入的热量弹出层 -->
    <!-- 底部弹出 -->
    <van-popup
      v-model:show="budget_showBottom"
      position="bottom"
      :style="{ height: '30%' }"
      style="background-color: #ffffffa2"
    >
      <div class="budget_div_unit">
        <div>单位千卡</div>
        <div>_________</div>
      </div>
      <!-- 数字输入框 -->
      <!-- 允许输入数字，调起带符号的纯数字键盘 -->
      <van-field
        v-model="budget_text_number"
        type="number"
        class="budget_text_number"
      />
      <div
        style="
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        "
      >
        <van-button
          plain
          type="primary"
          style="margin: 0 auto"
          @click="budget_text_number_but"
          >确定</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { showToast } from 'vant'
/* 导入记录体重请求 */
import {
  RecordingInitialWeight,
  RecordingTargetWeight,
  RecordingCurrentWeight,
} from '@/api/we'
/* 获取当前日期 */
import { formattedTime } from '@/util/getTime'
// 仓库
import { UserStore } from '@/stores/user'
// ai界面
import chatFood from '@/views/chat/chatFood.vue'

// 请求
import {
  updateBreakfast,
  updateLunch,
  updateDinner,
  calculateCalorie,
  BudgetCalories,
  Compute,
} from '@/api/ingestfood.js'
import { useRouter, useRoute } from 'vue-router'
/* 路由跳转 */
//首先在setup中定义
const router = useRouter()
// 获取仓库
const userStore = UserStore()
/* 控制初始数字隐藏 */
const show1 = ref(true)
const show2 = ref(true)
// 体重表单
const weight_form = ref({
  initialWeight: '0',
  targetWeight: '0',
  currentWeight: '0', // 当前体重
  startTime: '',
})
const percentageNUM = ref(0)

// 进度条

/* 控制初始还是目标体重的数字输入 */
const nu_key = ref(0)
/* 控制弹出层 */
const showBottom = ref(false)
const showPopup = () => {
  show1.value = true
  nu_key.value = 0
  showBottom.value = true
}
const showPopup2 = () => {
  show2.value = true
  nu_key.value = 1
  showBottom.value = true
}

// 数字键盘输入时
const onInput1 = value => {
  if (weight_form.value.initialWeight == 0) {
    weight_form.value.initialWeight = ''
  }

  weight_form.value.initialWeight += value
  // 检查输入的体重是否超过合理范围
  if (parseInt(weight_form.value.initialWeight) > 200) {
    weight_form.value.initialWeight = 200
    showToast('请输入合理的体重')
  }
}
/* 目标体重输入时 */
const onInput2 = value => {
  if (weight_form.value.targetWeight == 0) {
    weight_form.value.targetWeight = ''
  }

  weight_form.value.targetWeight += value
  // 检查输入的体重是否超过合理范围
  if (parseInt(weight_form.value.targetWeight) > 200) {
    weight_form.value.targetWeight = 200
    showToast('请输入合理的体重')
  }
}
// 键盘删除时
const onDelete1 = () => (weight_form.value.initialWeight = '')
const onDelete2 = () => (weight_form.value.targetWeight = '')
/* 键盘失去焦点时发起请求修改当前数据*/

/* 初始体重,在这里发起请求，记录体重 */
const num_blur1 = () => {
  show1.value = false
  // 获取当前日期
  weight_form.value.startTime = formattedTime
  // 发起请求
  const req = RecordingInitialWeight(weight_form.value)
  userStore.weightMsg.initialWeight = weight_form.value.initialWeight
}
/* 目标体重,在这里发起请求，记录体重 */
const num_blur2 = () => {
  show2.value = false
  // 获取当前日期
  weight_form.value.startTime = formattedTime
  // 发起请求
  const req = RecordingTargetWeight(weight_form.value)
  userStore.weightMsg.targetWeight = weight_form.value.targetWeight
}
// 监听体重数据变化
watch(
  weight_form,
  () => {
    percentageNUM.value = parseInt(
      (Number(weight_form.value.targetWeight) /
        Number(weight_form.value.currentWeight)) *
        100,
    )
    if (percentageNUM.value > 100) {
      percentageNUM.value = 100
    }
  },
  { deep: true },
)
// 控制记录体重弹出层
const weight_po = ref(false)
// 记录体重
const toWeight_recording = () => {
  console.log(11111)
  weight_po.value = true
}
// 当前体重键盘输入时
const weight_po_inp = value => {
  if (weight_form.value.currentWeight == 0) {
    weight_form.value.currentWeight = ''
  }
  weight_form.value.currentWeight += value
  if (weight_form.value.currentWeight > 200) {
    weight_form.value.currentWeight = 200
    showToast('请输入合理的体重')
  }
}
// 当前体重键盘删除时
const weight_po_del = () => {
  weight_form.value.currentWeight = '0'
}
// 当前体重失去焦点
const weight_po_blur = () => {
  // 获取当前日期
  weight_form.value.startTime = formattedTime
  // 发起请求
  const req = RecordingCurrentWeight(weight_form.value)
  // 保存数据到仓库
  userStore.weightMsg.currentWeight = weight_form.value.currentWeight
}
// 记录摄入的食物
// 数据
const food_form = ref({
  // 早餐
  breakfast: 0,
  // 午餐
  ingestFoodLunch: 0,
  // 晚餐
  ingestFoodDinner: 0,

  //时间
  ingestFoodTime: '',
})

// 控制记录摄入食物弹出层
const foodShowRight = ref(false)
//识别是哪一个功能,0是早餐,1是午餐,2是晚餐
const foodType = ref(0)
// 存放热量
const number = ref(Number)
// 早餐
const breakfast = () => {
  // 往foodType写入0，方便识别是哪一个功能
  foodType.value = 0
  // 控制弹出层
  foodShowRight.value = true
}
// 午餐
const lunch = () => {
  // 往foodType写入1，方便识别是哪一个功能
  foodType.value = 1
  // 控制弹出层
  foodShowRight.value = true
}
// 晚餐
const dinner = () => {
  // 往foodType写入1，方便识别是哪一个功能
  foodType.value = 2
  // 控制弹出层
  foodShowRight.value = true
}

// 计算ai左边弹出层
const aiShowLeft = ref(false)

// 点击图标弹出ai左边弹层
const aiShowLeftClick = () => {
  aiShowLeft.value = true
}

//饮食摄入热量
const calculateCalorieNumber = ref(0)

// 保存按钮
const SaveButton = async () => {
  if (foodType.value == 0) {
    // 获取当前时间
    food_form.value.ingestFoodTime = formattedTime
    // 保存到数据中
    food_form.value.breakfast = number.value
    // 发起请求
    const req = updateBreakfast(food_form.value)

    // 保存到仓库
    userStore.calorieMsg.breakfast = food_form.value.breakfast
    // 将number清空
    number.value = Number
    const reqf = await Compute(food_form.value)

    calculateCalorieNumber.value = reqf.data.data
    console.log(calculateCalorieNumber.value)
  }
  if (foodType.value == 1) {
    // 获取当前时间
    food_form.value.ingestFoodTime = formattedTime
    // 保存到数据中
    food_form.value.ingestFoodLunch = number.value
    // 发起请求
    const req = updateLunch(food_form.value)

    // 保存到仓库
    userStore.calorieMsg.ingestFoodLunch = food_form.value.ingestFoodLunch
    // 将number清空
    number.value = Number
    const reqf = await Compute(food_form.value)

    calculateCalorieNumber.value = reqf.data.data
  }
  if (foodType.value == 2) {
    // 获取当前时间
    food_form.value.ingestFoodTime = formattedTime
    // 保存到数据中
    food_form.value.ingestFoodDinner = number.value
    // 发起请求
    const req = updateDinner(food_form.value)

    // 保存到仓库
    userStore.calorieMsg.ingestFoodDinner = food_form.value.ingestFoodDinner
    // 将number清空
    number.value = Number
    const reqf = await Compute(food_form.value)

    calculateCalorieNumber.value = reqf.data.data
  }

  // 计算饮食总热量
  food_form.value.ingestFoodTime = formattedTime
  const req = await Compute(food_form.value)
  console.log(req.data.data)
  calculateCalorieNumber.value = req.data.data
  userStore.Compute = req.data.data
}

// 运动千卡
const operationEnergy = ref(0)
// 记录摄入的食物
// 计算摄入的热量
// 饮食摄入记录
// const calculateCalorieNumber = ref(0)
// const aiShowLeftClose = async () => {
//   console.log('触发了')

//   const req = await calculateCalorie(food_form.value)
//   calculateCalorieNumber.value = req.data.data
// }
// 计算摄入的热量

//控制预算弹出层
const budget_showBottom = ref(false)
// 输入预算
const budget = () => {
  budget_showBottom.value = true
}
// 预算热量
const budget_text_number = ref(Number)

// 预算数据
const BudgetCalories_form = ref({
  BudgetAlories: 0,
  ingestFoodTime: '',
})

// 点击预算确认按钮
const budget_text_number_but = () => {
  if (budget_text_number != null && budget_text_number.value != 0) {
    BudgetCalories_form.value.budgetAlories = budget_text_number.value
    console.log(BudgetCalories_form.value.budgetAlories)
    BudgetCalories_form.value.ingestFoodTime = formattedTime
    budget_showBottom.value = false
    // 在这里发请求
    BudgetCalories(BudgetCalories_form.value)
    //存进仓库
    userStore.budget_text_number.BudgetAlories = budget_text_number.value
  }
}

// 运动跳转
const motion = () => {
  router.push({ path: '/motion' })
}

onMounted(async () => {
  // 获取用户体重信息
  weight_form.value = userStore.weightMsg
  console.log(percentageNUM.value)
  percentageNUM.value = parseInt(
    (Number(weight_form.value.targetWeight) /
      Number(weight_form.value.currentWeight)) *
      100,
  )
  food_form.value.ingestFoodTime = formattedTime
  console.log(userStore.budget_text_number.BudgetAlories)
  BudgetCalories_form.value.BudgetAlories =
    userStore.budget_text_number.BudgetAlories

  // 初始化饮食热量
  // 计算饮食总热量
  food_form.value.ingestFoodTime = formattedTime
  // const req = await Compute(food_form.value)

  // calculateCalorieNumber.value = req.data.data
  // userStore.Compute = req.data.data

  // 计算饮食总热量
  const req = await Compute(food_form.value)

  calculateCalorieNumber.value = req.data.data
})

// 计算属性

const plusOne = computed(() => {
  return (
    Number(userStore.budget_text_number.BudgetAlories) +
    Number(calculateCalorieNumber) +
    Number(userStore.operationEnergy)
  )
})

//我的方案
const myplan_but = () => {
  router.push({ path: '/myplan' })
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-size: 16px;
}
/* 我的方案与ai */
.myPlan_ai {
  width: 100%;
  height: 30px;
  background: linear-gradient(to right, #fcfcfc, #d5edda, #ccf3c4);
  border-radius: 15px 15px 0 0;
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myPlan_ai > div {
  margin: 2px;
  font-size: 13px;
  font-weight: 700;
}
.Reco_d {
  position: relative;
  width: 100%;
  height: 110vh;
  /* background-color: #aaffff; */
  margin: 0 auto;
  border-radius: 10px;
}
.weightShow {
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  border-radius: 10px;
}
.circle {
  margin: 0 auto;
}

.Progress_bar_percentage {
  width: 50%;
  position: absolute;
  top: 70px;
  left: 90px;
}
.initial_weight {
  font-weight: 700;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 45px;
  left: 35px;
  text-align: center;
  /* box-shadow: 1px 1px #dadada; */
}
.initial_weight_text {
  font-weight: 700;
  position: absolute;
  top: 70px;
  left: 35px;
}

.initial_weight_inp {
  width: 100%;
}
.num_weight {
  width: 100%;
  height: 40%;
}
.shw_weight {
  /* font-size: 12px; */
  width: 20%;
  height: 20%;
  margin: 0 auto;
  background-color: #ffffff;
  font-weight: 700;
}
.shw_weight > span {
  color: #00d969;
}

.target_weight {
  text-align: center;
  font-weight: 700;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 45px;
  left: 295px;
  /* box-shadow: 1px 1px #da9877; */
}
.target_weight_text {
  position: absolute;
  top: 70px;
  left: 295px;
  font-weight: 700;
}
.middle_part {
  width: 100%;

  margin: 0 auto;
}
.row_div {
  margin: 0 auto;
}
.total_time {
  width: 70px;
  height: 10px;
  font-size: 12px;
  font-weight: 700;
  /* background-color: #00d969; */
  position: absolute;
  top: 140px;
  left: 12px;
  text-align: center;
}
.total_energy {
  width: 100%;
  height: 80px;
  border-radius: 10px;
  background-color: #ffffff;
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.total_energy_detail {
  width: 95%;
  height: 40%;
  background-color: rgb(0, 255, 255, 0.1);
  border-radius: 10px;
}
.can_eat {
  font-size: 8px;
  position: absolute;
  top: 165px;
  left: 20px;
  color: #747474;
}
.can_eat_text {
  width: 45px;
  height: 20px;
  font-size: 14px;
  position: absolute;
  top: 178px;
  left: 20px;
  /* background-color: #00d969; */
  text-align: center;
  font-weight: 600;
}
.equal_sign {
  width: 45px;
  height: 20px;
  position: absolute;
  top: 174px;
  left: 80px;
}
.budget {
  font-size: 8px;
  position: absolute;
  color: #747474;
  top: 165px;
  left: 110px;
}
.budget_text {
  width: 45px;
  height: 16px;
  font-size: 12px;
  position: absolute;
  top: 177px;
  left: 95px;
  /* background-color: #00d969; */
  text-align: center;
  font-weight: 600;
  background-color: #57d7d779;
  border-radius: 10px;
}
.minus_sign {
  width: 45px;
  height: 20px;
  position: absolute;
  top: 172px;
  left: 155px;
}
.diet {
  font-size: 8px;
  position: absolute;
  color: #747474;
  top: 165px;
  left: 185px;
}
.diet_text {
  width: 45px;
  height: 20px;
  font-size: 12px;
  position: absolute;
  top: 176px;
  left: 170px;
  /* background-color: #00d969; */
  text-align: center;
  font-weight: 600;
}
.plus {
  width: 45px;
  height: 20px;
  position: absolute;
  top: 173px;
  left: 228px;
}
.motion {
  font-size: 8px;
  position: absolute;
  color: #747474;
  top: 165px;
  left: 264px;
}
.motion_text {
  width: 45px;
  height: 20px;
  font-size: 12px;
  position: absolute;
  top: 176px;
  left: 248px;
  /* background-color: #00d969; */
  text-align: center;
  font-weight: 600;
}
.food_motion {
  width: 90%;
  height: 25px;

  /* background-color: #1ddb66; */
  position: absolute;
  top: 195px;
  left: 18px;
  border-radius: 10px;
  display: flex;
  align-items: end;
  justify-content: space-between;
}
.food_motion > div {
  width: 25px;
  height: 25px;
  font-size: 12px;
  /* background-color: #fff; */
  text-align: center;
  line-height: 30px;
  font-weight: 700;
}
.weight_div {
  width: 140px;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  font-weight: 700;
  margin: 0 auto;
}
.step_div {
  width: 140px;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  font-weight: 700;
  margin: 0 auto;
}
.motion_show {
  width: 140px;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  font-weight: 700;
  margin: 0 auto;
}
.habit {
  width: 140px;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  font-weight: 700;
  margin: 0 auto;
}
.wrap {
  width: 80%;
  border-bottom: 40px solid rgb(208, 236, 191);
  border-top: 70px solid transparent;
  /* border-left: 10px solid transparent; */
  border-right: 10px solid transparent;
  border-radius: 0 0 0 10px;
}
.wrap_kg {
  position: absolute;
  top: 330px;
  /* background-color: #fff; */
  left: 40px;
  font-size: 23px;
}
.wrap_kg_text {
  margin-left: 10px;
  font-size: 12px;
}
.weight_po_number_show {
  display: flex;
  width: 100%;
  height: 10%;
  /* background-color: #bc1818; */
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
  color: #3acf82;
}

.weight_po_div {
  display: flex;
  justify-content: space-between;
  background-color: rgba(179, 218, 250, 0.5);
}
.weight_po_div > div {
  font-size: 14px;
  font-weight: 700;
}
.weight_po_number_show_weight {
  font-size: 20px;
  font-weight: 700;
}
.aiLink {
  color: #000;
  font-size: 13px;
  font-weight: 800;
}
/* 食物弹出层背景颜色 */
.foodShowRight {
  background-color: #ffffffd8;
}
/* 食物记录弹出层 */
.foodShowRight_div {
  width: 100%;
  height: 50px;

  position: absolute;
  top: 250px;
  margin-top: 10px;
}
.foodShowRight_div_input {
  /* height: 30px; */
  font-weight: 700;
}
.foodShowRight_div2_text {
  width: 100%;
  position: absolute;
  top: 300px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #54b9d0;
  margin-top: 20px;
}
.notice_bar_div {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
/* 滚动条 */
.foodShowRight_div_notice-bar {
  width: 100px;
}
.aiShowLeft_div {
  background-color: #ffffff90;
}
.Save_button_div {
  position: absolute;
  top: 350px;
  left: 50%;
  transform: translateX(-50%);
}
.budget_text_number {
  width: 80%;
  margin: 10px auto;
  border-radius: 14px;
}
.budget_div_unit {
  width: 100%;
  margin: 0 auto;
}
.budget_div_unit > div {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #f3fdf8;
}
</style>
