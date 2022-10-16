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
