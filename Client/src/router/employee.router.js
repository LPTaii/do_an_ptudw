import { library } from '@fortawesome/fontawesome-svg-core';
import { faBasketShopping, faPersonChalkboard, faReceipt } from '@fortawesome/free-solid-svg-icons';

library.add(faBasketShopping, faPersonChalkboard, faReceipt)

export default [
  {
    path: '/admin',
    children: [
      {
        path: '',
        name: 'AdminHome',
        meta: {
          title: 'ADMIN',
          sidebarIcon: 'house',
          showInSidebar: 'ADMIN',
          requiresAuth: true,
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/HomeView.vue')
      },
      {
        path: 'signin',
        name: 'AdminSignin',
        meta: {
          title: 'Đăng nhập',
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/authentication/Signin.vue')
      },
      {
        path: 'signup',
        name: 'AdminSignup',
        meta: {
          title: 'Đăng ký',
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/authentication/Signup.vue')
      },
      {
        path: 'product',
        name: 'AdminProductsList',
        meta: {
          title: 'Quản Lý Sản Phẩm',
          sidebarIcon: 'basket-shopping',
          showInSidebar: 'ADMIN',
          requiresAuth: true,
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/product/ProductList.vue')
      },
      {
        path: 'product/add',
        name: 'AdminProductAdd',
        meta: {
          title: 'Thêm sản phẩm',
          requiresAuth: true,
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/product/ProductAdd.vue')
      },
      {
        path: 'product/edit/:id',
        name: 'AdminProductEdit',
        meta: {
          title: 'Chỉnh sửa sản phẩm',
          requiresAuth: true,
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/product/ProductEdit.vue')
      },
      
      
      {
        path: 'order',
        name: 'AdminOrdersList',
        meta: {
          title: 'Quản Lý Đơn Hàng',
          sidebarIcon: 'receipt',
          showInSidebar: 'ADMIN',
          requiresAuth: true,
          userType: 'ADMIN'
        },
        component: () => import('@/views/employee/order/OrderList.vue')
      },
    ]
  }
]