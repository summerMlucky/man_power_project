import Layout from '@/layout'
export default {
  path: '/setting',
  name: '/setting',
  component: Layout,
  meta: {
    id: 'settings'
  },
  children: [{
    path: '',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: '公司设置', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'setting'
    }
  }]
}
