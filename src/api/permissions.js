import request from '@/utils/request'
/**
 * 获取所有权限点
 * @returns
 */
export function getPermissions() {
  return request({
    url: '/sys/permission'
  })
}
/**
 * 添加权限点
 * @param {*} data
 * @returns
 */
export function addPermissions(data) {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}
/**
 * 根据id删除权限点
 * @param {*} id
 * @returns
 */
export function deletePermissions(id) {
  return request({
    url: '/sys/permission/' + id,
    method: 'DELETE'
  })
}
