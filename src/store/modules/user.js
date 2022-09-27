import { login } from '@/api/login'
import { getUserInfo, getDetailUserInfo } from '@/api/user'
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
      console.log(data)
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      const res1 = await getDetailUserInfo(res.userId)
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    },
    logout({ commit }) {
      commit('REMOVE_USER_INFO')
      commit('REMOVE_TOKEN')
    }
  }
}
