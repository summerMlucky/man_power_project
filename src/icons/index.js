import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// req函数===>根据路径 对应的模块 导入进来

// 函数keys属性===>方法 ====>数组
// console.log(req.keys())
console.log(require.context('./svg', false, /\.svg$/)('./dashboard.svg'))
// console.log(req('./dashboard.svg'))
// console.log(req => req.keys().map(req))
// console.log(req.keys().map(req))
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// console.log(requireAll(req))
