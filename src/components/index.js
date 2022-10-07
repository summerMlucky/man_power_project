// import PageTools from './PageTools'
import * as imgErrors from '@/directives'
// const components = [PageTools]
// export default {
//   install(Vue) {
//     components.forEach(ele => {
//       Vue.component(ele.name, ele)
//     })
//   }
// }

// 如何一次性导入所有模块
// require.context()
const fn = require.context('./', true, /\.vue$/)
// console.log(fn.keys())// 路径
// console.log(fn('./PageTools/index.vue'))// 根据路径查找模块
const components = fn.keys().map(ele => {
  // 一次性导入所有模块
  return fn(ele)
})
export default (Vue) => {
//   对象默认执行install函数
  components.forEach(ele => {
    Vue.component(ele.default.name, ele)
  })
  Object.keys(imgErrors).forEach(ele => {
    Vue.directive(ele, imgErrors[ele])
  })
}

