// 使用dayjs处理时间格式
const dayjs = require('dayjs')

const filterTimes = (val, format = 'YYYY-MM-DD') => {
  if (!isNull(val)) {
    val = parseInt(val) * 1000
    return dayjs(val).format(format)
  } else {
    return '--'
  }
}

export const isNull = (date) => {
  if (!date) return true
  if (JSON.stringify(date) === '{}') return true
  if (JSON.stringify(date) === '[]') return true
}

export default app => {
  // 在app的全局属性上添加$filters
  app.config.globalProperties.$filters = {
    filterTimes
  }
}
