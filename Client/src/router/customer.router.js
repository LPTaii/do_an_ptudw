export default [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'CustomerHome',
        meta: {
          title: 'ShopDT',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/HomeView.vue'),

      },
      {
        path: 'signin',
        name: 'CustomerSignin',
        meta: {
          title: 'Đăng nhập',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/authentication/Signin.vue')
      },
      {
        path: 'signup',
        name: 'CustomerSignup',
        meta: {
          title: 'Đăng ký',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/authentication/Signup.vue')
      },
      {
        path: 'product/:id',
        name: 'CustomerProductDetail',
        meta: {
          title: 'Chi tiết sản phẩm',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/Product.vue')
      },
      {
        path: 'checkout',
        name: 'CustomerCheckout',
        meta: {
          title: 'Đât hàng',
          requiresAuth: true,
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/Checkout.vue')
      },
      {
        path: 'order/success',
        name: 'CustomerOrderSuccess',
        meta: {
          title: 'Đặt hàng',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/OrderSuccess.vue')
      },
      {
        path: 'order/list',
        name: 'CustomerOrdersList',
        meta: {
          title: 'Đơn hàng',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/OrdersList.vue')
      },
    ]
  }
]