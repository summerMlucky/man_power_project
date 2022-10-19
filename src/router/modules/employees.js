import Layout from '@/layout'
export default {
  path: '/employees',
  name: '/employees',
  component: Layout,
  meta: {
    id: 'employees'
  },
  children: [{
    path: '',
    component: () => import('@/views/employees/index.vue'),
    meta: {
      title: '员工', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'people'
    }
  },
  {
    path: '/employees/detail/:id',
    component: () => import('@/views/employees/components/detail.vue'),
    hidden: true // 不在左侧菜单显示
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/components/print.vue'),
    hidden: true // 不在左侧菜单显示
  }]
}