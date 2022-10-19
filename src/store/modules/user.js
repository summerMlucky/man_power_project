import { login } from '@/api/login'
import { getUserInfo, getDetailUserInfo } from '@/api/user'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: 0
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload
    },
    SET_USER_INFO(state, payload) {
      state.userInfo = payload
    },
    SET_HRSAAS_TIME(state, payload) {
      state.hrsaasTime = payload
    },
    REMOVE_USER_INFO(state) {
      state.userInfo = {}
    },
    REMOVE_TOKEN(state) {
      state.token = null
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData)
      commit('SET_HRSAAS_TIME', new Date().getTime())
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      // 制造一些假数据
      const points = ['role-add', 'role-assign', 'role-delete']
      res.roles.points = points
      const res1 = await getDetailUserInfo(res.userId)
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result)
      // return JSON.parse(JSON.stringify(result))
      return res.roles
    },
    logout({ commit }) {
      commit('REMOVE_USER_INFO')
      commit('REMOVE_TOKEN')
      resetRouter()
    }
  }
}
