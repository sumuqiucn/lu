import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由，所有用户都能看见的放在这里面
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
      path: 'Dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    },
   ]
  },  // 404 page must be placed at the end !!! 
]

//  异步路由(动态路由)，放置的是所有需要动态设置添加的到路由器里的路由
// 后期我们会根据用户返回的routes数据，从这个数组当中过滤用户自己需要动态展示的路由
export const allAsyncRoutes = [
  {
    path:'/product',
    component: Layout,
    name:'Product',
    meta:{title:'商品管理',icon:'el-icon-s-shop'},
    // redirect:'/product/trademark/list',
    children:[
      {
        path:'trademark/list',
        component: () => import('@/views/product/trademark/List'),
        name:'Trademark',
        meta:{title:'品牌管理'}
      },
      {
        path:'attr/list',
        component: () => import('@/views/product/attr/List'),
        name:'Attr',
        meta:{title:'平台属性管理'}
      },
      {
        path:'spu/list',
        component: () => import('@/views/product/spu/List'),
        name:'Spu',
        meta:{title:'Spu管理'}
      },
      {
        path:'sku/list',
        component: () => import('@/views/product/sku/List'),
        name:'Sku',
        meta:{title:'Sku管理'}
      }
    ]
  },
]
// 任意路由 *代表统配符所有的
export const anyRoute =  { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
