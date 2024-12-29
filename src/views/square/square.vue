<template>
  <div>
    <van-cell title="选择单个日期" :value="date" @click="show = true" />
    <van-calendar
      v-model:show="show"
      @confirm="onConfirm"
      switch-mode="year-month"
    />
    <!-- 空状态 -->
    <van-empty description="暂无数据" v-if="EmptyState" />
    <!-- 单元格 -->
    <van-cell-group v-if="!EmptyState">
      <van-cell title="早餐" :value="data.breakfast" label="千卡" />
      <van-cell title="午餐" :value="data.ingestFoodLunch" label="千卡" />
      <van-cell title="晚餐" :value="data.ingestFoodDinner" label="千卡" />
    </van-cell-group>
    <!-- 手风琴 -->
    <van-collapse v-model="activeNames" v-if="!EmptyState">
      <van-collapse-item title="运动" name="1">
        <van-cell
          v-for="item in data_athle"
          :title="item.athleticPrograms"
          :value="item.operationEnergy"
          label="千卡"
        />
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QueryIngestfood, QuerySport } from '@/api/Query.js'
// 时间
const ingestFoodTime_data = ref({
  ingestFoodTime: '',
})
// 控制空状态
const EmptyState = ref(true)
// 返回的数据
const data = ref({})

const show = ref(false)

// 请求运动消耗的热量
const QueAthleVo_data = ref({
  exerciseTime: '',
})

// 请求回来运动数据
const data_athle = ref([])

const onConfirm = async value => {
  show.value = false

  ingestFoodTime_data.value.ingestFoodTime = formatDate(value)
  const req = await QueryIngestfood(ingestFoodTime_data.value)
  console.log(req.data.data)
  data.value = req.data.data
  if (data.value == null) {
    EmptyState.value = true
  } else {
    EmptyState.value = false
  }

  QueAthleVo_data.value.exerciseTime = formatDate(value)
  // 请求运动消耗的热量
  const req2 = await QuerySport(QueAthleVo_data.value)
  console.log(req2.data.data)
  data_athle.value = req2.data.data
}
// 将日期转换
const formatDate = date => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const activeNames = ref(['1'])
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
