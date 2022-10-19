import router from '@/router'
import store from '@/store'
import { asyncRoutes } from '@/router'
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  //   console.log(to)
  //   console.log(from)
  //   next(false)
  // token 存在 说明 处于登录状态
  // 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
  // token 不存在 说明 不处于登录状态
  // 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
  if (store.getters.token) { // 已经登陆
    if (!store.getters.userId) {
      // store.dispatch 返回值是Promise
      const roles = await store.dispatch('user/getUserInfo')
      // 1.动态路由的筛选在这个位置上写代码
      // 所有动态路由asyncRoutes   router/index.js
      const filterRouter = asyncRoutes.filter(item => {
        return roles.menus.includes(item.meta.id)
      })
      router.addRoutes([...filterRouter, { path: '*', redirect: '/404', hidden: true }])
      // 动态添加的路由规则，后续的next必须是next(to.path)
      next(to.path)
      store.commit('permission/setRouters', filterRouter)
      console.log(filterRouter)
      // console.log(asyncRoutes)
      // 2.当前用户角色拥有的权限 user/getUserInfo return 出来
      console.log(roles)
    }
    // await store.dispatch('user/getUserInfo')
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
