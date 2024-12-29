/* 记录摄入的食物 */
import request from '../axios/index.js'

// 更新早餐
export const updateBreakfast = ingestfood => {
  return request.post('/ingestfood/updatebreakfast', ingestfood)
}

// 更新午餐
export const updateLunch = ingestfood => {
  return request.post('/ingestfood/Updatelunchdata', ingestfood)
}
// 更新晚餐
export const updateDinner = ingestfood => {
  return request.post('/ingestfood/UpdateDinnerData', ingestfood)
}

// 计算摄入热量
export const calculateCalorie = ingestfood => {
  return request.post('/ingestfood/CalculateCalories', ingestfood)
}

// 预算热量
export const BudgetCalories = BudgetCalories => {
  return request.post('/ingestfood/BudgetCalories', BudgetCalories)
}

// 计算饮食
export const Compute = Compute => {
  return request.post('/ingestfood/Compute', Compute)
}
