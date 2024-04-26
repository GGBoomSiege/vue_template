import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/HomeView.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/children/Home.vue')
        },
        {
          path: 'table',
          name: 'table',
          component: () => import('@/views/children/Table.vue')
        },
        {
          path: '/chart',
          name: 'chart',
          component: () => import('@/views/children/Chart.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestView.vue')
    },
  ]
})

// 设置登录过期时间（一天）86400000 
let expire = 21600000;
//路由守卫    全局守卫，登录拦截
//进行路由拦截：当没有登陆标识，直接打回登陆页面，如何避免退回到 登陆页呢？

router.beforeEach((to, from, next) => {
  // console.log(to.path);
  // 从本地缓存中获取保存的 token 信息
  const tokenObj = JSON.parse(window.localStorage.getItem('isLogin'))
  if (to.path === "/login") {
    next()
  } else {
    // 如果没有token，强制跳转到登录页面；如果有，则判断token时间是否过期
    if (!tokenObj || !tokenObj.token) {
      next('/login')
    } else {
      let date = new Date().getTime();
      // 当前时间 - token中的登录时间 > 设置的过期时间，为过期；则清除token，并强制跳转至登录页
      // 反之为有效期，则放行
      if (date - tokenObj.startTime > expire) {
        window.localStorage.removeItem('isLogin');
        next('/login')
        ElMessage({
          message: h('p', null, [
            h('span', null, '登录状态过期'),
            h('i', { style: 'color: teal' }, '请重新登录！'),
          ]),
        })
      } else {
        next();
      }
    }
  }
});

export default router
