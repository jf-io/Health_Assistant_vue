<template>
  <div>
    <van-nav-bar
      title="我的方案"
      left-text="返回"
      left-arrow
      @click-left="MypqlnOnClickLeft"
    />
    <div class="myplan_content">
      <van-swipe-cell v-for="item in myplan_req_data" :key="item.myPlanId">
        <van-cell :border="false" title="方案" :value="item.myPlanTime" />
        <van-text-ellipsis
          rows="3"
          :content="item.myPlanCoent"
          expand-text="展开"
          collapse-text="收起"
          class="myplan_text_ellipsis"
        />
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getMyPlan } from '@/api/myplan.js'

// 数据
const myplan_req_data = ref([])

const MypqlnOnClickLeft = () => {
  history.back()
}

onMounted(async () => {
  // 获取方案
  const req = await getMyPlan()

  myplan_req_data.value = req.data.data
})
</script>

<style>
.delete-button {
  height: 100%;
}
.myplan_text_ellipsis {
  font-size: 14px;
}
</style>
