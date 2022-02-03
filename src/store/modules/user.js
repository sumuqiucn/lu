import { login, logout, getInfo } from '@/api/user'
import { resetRouter,allAsyncRoutes,constantRoutes,anyRoute } from '@/router'
import router from '@/router'



function fitlterAsyncRoutes(allAsyncRoutes,routeNames,){
allAsyncRoutes.filter(item =>{
    // item代表路由对象
    if(routeNames.indexOf(item.name) !==-1){
        if(item.chidren && item.chidren.length){
            // 递归
            item.chidren = filterAsyncRoutes(item.chidren,routeNames)
        }
        return true
    }
})
return asyncRoutes
}
const state = {
  // token:'',
  token:localStorage.getItem('token_key'),//从localStorage(本地储存)上拿去获取
  name: '',
  avater:'',
  button:[],
  roles:[],
  asyncroutes:[] ,  //这个里面一会我们会保存的不是请求回来的用户信息
                    //   路由信息数组
                    // 请求返回的routes内部是 路由的name字符组成的
                    // 我们最后保存的是根据字符串到所有的异步路由数组
                    // 组成的数组
  routes:[]//保存的是这个用户对应的路由器当中配置的所有路由组成的数组

   
  

}

const mutations = {

  SET_STATE(state){
    state.token = '',
    state.name = '',
    satate.buttons = [],
    state.roles = [],
    state.routes = []
  },

  SET_TOKEN(state, token){
    state.token = token
  },

  SET_USERINFO(state, userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avater
    state.buttons = userInfo.buttons,
    state.roles = userInfo.roles
  },
SET_ROUTES(state,asyncRoutes){
    state.asyncRoutes = asyncRoutes
    // 保存所有的路由组成的数组，用于形成侧边栏的时候，遍历使用的
    state.routes = constantRoutes.concat(asyncRoutes,anyRoute)
    
    // 还要把动态路由和任意路由，动态的添加到路由器配置项当中，形成完整的路由配置数组
    // 添加的时候有顺序
    router.addRoutes([...asyncRoutes,anyRoute])
}
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username,password } = userInfo
    const result = await login({ username, password });
    // console.log(result);
    if (result.code === 200 || result.code === 20000){
      const {data} = result
      commit('SET_TOKEN',data.token)

      // 自动登录需要把token保存到本地储存localStorage里
      localStorage.setItem('token_key', data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // 获取用户信息
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if(result.code === 200 || result.code === 20000) {
      const {data} = result
      commit('SET_USERINFO',data)
        // data.routes
        // 拿到的是用户返回的路由name字符串组成的
        // 我们现在要的不是他，而是通过所有的异步路由当中过滤出来的

        commit('SET_ROUTES',fitlterAsyncRoutes(allAsyncRoutes,data.routes))
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // 退出登录
  async logout({commit,state,dispatch}) {
    const result = await  logout(state.token)
    if(result.code === 200 || result.code === 20000) {
  
      dispatch("resetToken")
      resetRouter()
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },

  async resetToken({ commit }) {
    localStorage.removeItem('token_key') // 退出必须先清除本地储存
    commit('RESET_STATE')  
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}