import request from '@/utils/request'

export function login(data) {
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

export const getDetailUserInfo = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {
}
