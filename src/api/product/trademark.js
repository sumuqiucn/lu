// 写的就是和请求品牌相关逻辑的请求函数
import request from '@/utils/request'

// axios
// 对象的用法，是把request当对象去使用
// 对象内部根据请求方式有对应的方法
// 这个方法内部无论是什么请求，第一个参数都代表路径（有可能带query和params参数）
// 方法当中第二个参数，是什么不是固定的，要根据请求方式的不同而不同
// get和delete 第二个参数是配置对象，没有第三个参数 
// post和post 第二个参数是data，请求体参数，第三个参数才是配置对象


export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  remove(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },
  // 新增品牌，有没有id？  没有    数据在后端数据库当中存在之前是没有id的
  // 修改品牌，有没有id？  有      数据只要是从后端获取到的一定是有id的
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  // 分页列表
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // /admin/product/baseTrademark/getTrademarkList
  // 获取所有的品牌列表
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }

}

// {
//   default:{}
// }

// import {default as xxx} from './xxxx'
// import xxx from './xxx'