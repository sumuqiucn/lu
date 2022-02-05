/* 
包含所有sku管理的接口请求函数
*/
import request from '@/utils/request'

export default {
  /* 
  下架SKU
  GET /admin/product/cancelSale/{skuId}
  */
  cancelSale (skuId) {
    return request.get(`/admin/product/cancelSale/${skuId}`)
  },

  /* 
  上架SKU
  GET /admin/product/onSale/{skuId}
  */
  onSale (skuId) {
    return request.get(`/admin/product/onSale/${skuId}`)
  },

  /* 
  删除指定id的sku
  DELETE /admin/product/deleteSku/{skuId}
  */
  remove (skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`)
  },

  /* 
  根据指定的SPU的id查询所有对应的SKU的列表
  GET /admin/product/findBySpuId/{spuId}
  */
  getListBySpuId (spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`)
  },

  /* 
  根据SKU的id查询SKU的详细信息
  GET /admin/product/getSkuById/{skuId}
  */
  get (skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`)
  },

  /* 
  获取SKU的分页列表
  GET /admin/product/list/{page}/{limit}
  */
  getList (page, limit) {
    return request.get(`/admin/product/list/${page}/${limit}`)
  },

  /* 
  保存SKU
  POST /admin/product/saveSkuInfo
  POST /admin/product/updateSkuInfo
  */
  addUpdate (skuInfo) {
    return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`, skuInfo)
  },

  /* 
  获取指定SPU的id对应的图片列表
  // 添加spu是可以添加很多图片作为spu自己的图片列表
  // 后期给spu添加sku的时候，sku的图片列表是从spu的图片列表当中选择而来的
  // 要获取spu的图片列表展示出来，才能进行选择。但是得额外发请求获取spu的图片列表

  GET /admin/product/spuImageList/{spuId}
  */
  getSpuImageList (spuId) {
    return request.get(`/admin/product/spuImageList/${spuId}`)
  },

  /* 
  所有的spu销售属性列表：  所有的销售属性 [颜色   版本   套装]
  某个spu的销售属性列表：  [颜色、套装]

  获取指定SPU的id对应的销售属性列表
  // 获取spu自己的销售属性，用于后期添加sku的时候，选择sku的销售属性值
  GET /admin/product/spuSaleAttrList/{spuId}
  */
  getSpuSaleAttrList (spuId) {
    return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
  }
}