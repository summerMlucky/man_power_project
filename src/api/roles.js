import request from '@/utils/request'
/**
 * 获取角色列表
 * @returns Promise
 */
export function getRoles() {
  return request({
    url: '/sys/role'
  })
}
// /**
//  * 根据ID获取角色详情
//  * @param {String} id
//  * @returns
//  */
// export function getRolesById(id) {
//   return request({
//     url: '/sys/role/' + id
//   })
// }
/**
 * 给员工分配角色
 * @param {Object} data
 * @returns
 */
export function setEmployeesRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
/**
 * 根据ID获取角色详情
 * @param {} id
 * @returns
 */
export function getRolesPermissionById(id) {
  return request({
    url: '/sys/role/' + id
  })
}
/**
 * 给角色分配权限
 * @param {*} data
 * @returns
 */
export function AddRolesPermission(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}
