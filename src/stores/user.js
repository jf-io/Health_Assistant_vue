import { defineStore } from 'pinia'
import { ref } from 'vue'

export const UserStore = defineStore(
  'user-store',
  () => {
    const token = ref('')
    // 登录验证码唯一识别
    const log_code_UUId = ref('')
    // 体重信息
    const weightMsg = ref({
      // 初始体重
      initialWeight: '0',
      // 目标体重
      targetWeight: '0',
      // 当前体重
      currentWeight: '0',
      // 当前时间
      startTime: '',
    })

    // 热量千卡信息数据
    const calorieMsg = ref({
      // 早餐
      breakfast: 0,
      // 午餐
      ingestFoodLunch: 0,
      // 晚餐
      ingestFoodDinner: 0,
      // 预计热量
      BudgetAlories: 0,
      //时间
      ingestFoodTime: '',
    })
    // 预算热量
    const budget_text_number = ref({
      BudgetAlories: 0,
      ingestFoodTime: '',
    })

    const Compute = ref(0)

    // 运动项目
    const RecordingInitialWeightReq = ref([])

    const operationEnergy = ref(0)

    return {
      token,
      log_code_UUId,
      weightMsg,
      calorieMsg,
      budget_text_number,
      Compute,
      RecordingInitialWeightReq,
      operationEnergy,
    }
  },
  {
    // 仓库持久化
    persist: true,
  },
)
