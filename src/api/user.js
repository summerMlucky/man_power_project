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
/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 获取员工个人信息
 * @param {*} id
 * @returns
 */
export function getEmployeeInfoById(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
export function logout() {
}
