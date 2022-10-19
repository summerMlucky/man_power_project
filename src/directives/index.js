import store from '@/store'
export const imgError = {
  inserted(el, binding, vnode) {
    // console.log(el) // el dom
    // console.log(binding) // 当前指令的相关信息
    // console.log(vnode) // vnode虚拟节点
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
export const isHas = {
  inserted(el, binding) {
    const isHas = store.state.user.userInfo.roles.points.includes(binding.value)
    if (isHas) return
    el.remove()
  }
}
