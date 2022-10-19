import { constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routers: []// 自己维护的路由规则
  },
  mutations: {
    setRouters(state, payload) {
      state.routers = [...constantRoutes, ...payload]
    }
  }
}
