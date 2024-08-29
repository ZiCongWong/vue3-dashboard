import type { MenuSate } from '@/store/modules/type.ts'

export const constantRoute: MenuSate = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'Login',
      hidden: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: 'Layout',
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'Home',
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
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: 'screen',
      hidden: false,
      icon: 'DataBoard',
    },
  },
  {
    path: '/acl',
    name: 'acl',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'PermissionsManagement',
      hidden: false,
      icon: 'Lock',
    },
    children: [{
      path: '/acl/user',
      component: () => import('@/views/acl/User/index.vue'),
      name: 'Acl',
      meta: {
        title: 'UserManagement',
        hidden: false,
        icon: 'User',
      },
    }, {
      path: '/acl/role',
      component: () => import('@/views/acl/role/index.vue'),
      name: 'Role',
      meta: {
        title: 'RoleManagement',
        hidden: false,
        icon: 'UserFilled',
      },
    }, {
      path: '/acl/permission',
      component: () => import('@/views/acl/permission/index.vue'),
      name: 'Menu',
      meta: {
        title: 'MenuManagement',
        hidden: false,
        icon: 'Monitor',
      },
    }],
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      title: 'MerchandiseManagement',
      icon: 'Goods',
      hidden: false,
    },
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'trademark',
        meta:{
          title: 'BrandManagement',
          icon: 'ShoppingCartFull',
          hidden: false,
        }
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'attr',
        meta:{
          title: 'AttributeManagement',
          icon: 'ChromeFilled',
          hidden: false,
        }
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'spu',
        meta:{
          title: 'SpuManagement',
          icon: 'Calendar',
          hidden: false,
        }
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'sku',
        meta:{
          title: 'SkuManagement',
          icon: 'Orange',
          hidden: false,
        }
      },
    ],
  },
]