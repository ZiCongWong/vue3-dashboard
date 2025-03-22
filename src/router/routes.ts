import type { MenuSate } from '@/store/modules/type.ts'

export const constantRoute: MenuSate = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
      hidden: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '平台概览',
          hidden: false,
          icon: 'HomeFilled',
        },
      },

    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404 Not Found',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: 'Any',
      hidden: true,
    },
  },
  {
    path: '',
    name: 'product',
    component: () => import('@/layout/index.vue'),
    redirect: 'product',
    meta: {
      title: '',
      hidden: false,
      icon: 'Lock',
    },
    children: [{
      path: '/product',
      name: 'product',
      component: () => import('@/views/sort/index.vue'),
      meta: {
        title: '产品开发',
        hidden: false,
        icon: 'Cpu',
      },
    },],
  },
  {
    path: '',
    name: 'device',
    component: () => import('@/layout/index.vue'),
    redirect: 'device',
    meta: {
      title: '',
      hidden: false,
      icon: 'Lock',
    },
    children: [{
      path: '/device',
      name: 'device',
      component: () => import('@/views/device/index.vue'),
      meta: {
        title: '设备管理',
        hidden: false,
        icon: 'Money',
      },
    },],
  },
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'DataBoard',
    },
  }
  // {
  //   path: '/acl',
  //   name: 'acl',
  //   component: () => import('@/layout/index.vue'),
  //   redirect: '/acl/user',
  //   meta: {
  //     title: '权限管理',
  //     hidden: false,
  //     icon: 'Lock',
  //   },
  //   children: [{
  //     path: '/acl/user',
  //     component: () => import('@/views/acl/User/index.vue'),
  //     name: 'Acl',
  //     meta: {
  //       title: '用户管理',
  //       hidden: false,
  //       icon: 'User',
  //     },
  //   }, {
  //     path: '/acl/role',
  //     component: () => import('@/views/acl/role/index.vue'),
  //     name: 'Role',
  //     meta: {
  //       title: '角色管理',
  //       hidden: false,
  //       icon: 'UserFilled',
  //     },
  //   }, {
  //     path: '/acl/permission',
  //     component: () => import('@/views/acl/permission/index.vue'),
  //     name: 'Menu',
  //     meta: {
  //       title: '菜单管理',
  //       hidden: false,
  //       icon: 'Monitor',
  //     },
  //   }],
  // },
  // {
  //   path: '/product',
  //   component: () => import('@/layout/index.vue'),
  //   name: 'Product',
  //   redirect: '/product/trademark',
  //   meta: {
  //     title: '商品管理',
  //     icon: 'Goods',
  //     hidden: false,
  //   },
  //   children: [
  //     {
  //       path: '/product/trademark',
  //       component: () => import('@/views/product/trademark/index.vue'),
  //       name: 'trademark',
  //       meta:{
  //         title: '品牌管理',
  //         icon: 'ShoppingCartFull',
  //         hidden: false,
  //       }
  //     },
  //     {
  //       path: '/product/attr',
  //       component: () => import('@/views/product/attr/index.vue'),
  //       name: 'attr',
  //       meta:{
  //         title: '属性管理',
  //         icon: 'ChromeFilled',
  //         hidden: false,
  //       }
  //     },
  //     {
  //       path: '/product/spu',
  //       component: () => import('@/views/product/spu/index.vue'),
  //       name: 'spu',
  //       meta:{
  //         title: 'Spu管理',
  //         icon: 'Calendar',
  //         hidden: false,
  //       }
  //     },
  //     {
  //       path: '/product/sku',
  //       component: () => import('@/views/product/sku/index.vue'),
  //       name: 'sku',
  //       meta:{
  //         title: 'Sku管理',
  //         icon: 'Orange',
  //         hidden: false,
  //       }
  //     },
  //   ],
  // },
]