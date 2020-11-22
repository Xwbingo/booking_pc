import Vue from 'vue'
import Router from 'vue-router'

// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

const MyReservationList = () => import(/* webpackChunkName: "Reservation" */ './components/myReservation/MyReservationList.vue')

const InstrumentList = () => import(/* webpackChunkName: "Instrument" */ './components/instrument/InstrumentList.vue')
const InstrumentDetails = () => import(/* webpackChunkName: "Instrument" */ './components/instrument/InstrumentDetails.vue')

const MyFavoriteList = () => import(/* webpackChunkName: "MyFavorite" */ './components/myFavorite/MyFavoriteList.vue')

const BasicInformation = () => import(/* webpackChunkName: "PersonalCenter" */ './components/personalCenter/BasicInformation.vue')

Vue.use(Router)

const router = new Router({
  // base: '/user/',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/reservationList', component: MyReservationList },
        { path: '/instrumentList', component: InstrumentList },
        { path: '/instrumentDetails', name: 'InstrumentDetails', component: InstrumentDetails },
        { path: '/myFavorite', component: MyFavoriteList },
        { path: '/information', component: BasicInformation },
        { path: '/welcome', component: Welcome }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
