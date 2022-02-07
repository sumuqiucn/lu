import { login, logout, getInfo } from '@/api/acl/user'
import { resetRouter,allAsyncRoutes,constantRoutes,anyRoute} from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'


function filterAsyncRoutes(allAsyncRoutes,routeNames){
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if(routeNames.indexOf(item.name)!==-1){
      if(item.children && item.children.length){
        item.children = filterAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

const state = {
  token: localStorage.getItem('token_key'),
  name: '',
  avatar: '',
  buttons:[],
  roles:[],
  // asyncRoutes:[],  //这个里面一会我们保存的不是请求回来的用户信息，而是根据请求回来的routes字符串，过滤出来的
            // 路由信息数组   
            // 请求返回的routes内部是 路由的name字符串组成的
            // 我们最后保存的是 根据字符串到所有的异步路由数组当中过滤出来的这个用户动态要添加路由信息
            // 组成的数组


  routes:[] //保存的是这个用户对应的路由器当中配置的所有路由组成的数组，这个数组到时候是让侧边栏遍历使用
}

const mutations = {
  RESET_STATE(state){
    state.token = ''
    state.name = ''
    state.avatar = ''
    state.buttons = []
    state.roles = []
    state.routes = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_USERINFO(state,userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  SET_ROUTES(state,asyncRoutes){
    // state.asyncRoutes = asyncRoutes
    // 保存用户所有的路由组成的数组，用于让形成侧边栏菜单的时候，遍历使用的
    state.routes = constantRoutes.concat(asyncRoutes,anyRoute)
    // 还要把动态路由和任意路由，动态添加到路由器的配置项当中,形成一个完整的路由配置数组
    router.addRoutes([...asyncRoutes,anyRoute])
  }
}

const actions = {

  async login({ commit }, userInfo){
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if(result.code === 200 || result.code === 20000){
      const { data } = result
      commit('SET_TOKEN', data.token)
      localStorage.setItem('token_key',data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },


  async getInfo({ commit, state }){
    const result = await getInfo(state.token)
    if(result.code === 200 || result.code === 20000){
      const { data } = result
      commit('SET_USERINFO',data)
      
      // data.routes 这个拿到是用户返回的路由name字符串组成的数组
      // 我们现在要的不是它，而是通过它从所有的异步路由当中过滤出来的路由组成的数组
      commit('SET_ROUTES',filterAsyncRoutes(cloneDeep(allAsyncRoutes),data.routes))
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },


  async logout({ commit,state,dispatch }){
    const result = await logout(state.token)
    if(result.code === 200 || result.code === 20000){
      dispatch('resetToken')
      resetRouter()
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },


  async resetToken({ commit }) {
    localStorage.removeItem('token_key')
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

