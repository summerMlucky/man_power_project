import router from '@/router'
import store from '@/store'
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   next(false)
// token 存在 说明 处于登录状态
// 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// token 不存在 说明 不处于登录状态
// 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
  if (store.getters.token) { // 已经登陆
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else { // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
