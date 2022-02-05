<template>
  <div>
    <el-form label-width="100px" :model="skuInfo">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" type="number" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImageList"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 排它处理设置默认图片 -->
              <el-button @click="changeDefault(spuImageList,row)" v-if="row.isDefault === '0'" type="primary" size="mini">设为默认</el-button>
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancleback"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [], //这个列表是spu所有的图片列表，展示出来是为了让用户选择的，不能去收集选中的sku图片列表
      
      skuImageList:[],//这个是专门用来收集选中的sku图片列表，后期保存的时候整理完成再去放到skuInfo
      skuInfo: {
        // 父组件传递过来的
        category3Id: '',
        spuId: '',
        tmId: '',
        
        // 通过v-model直接收集的
        skuName: "",
        skuDesc: "",
        weight: "",
        price: '',


        // 通过js代码收集
        skuDefaultImg: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ]
      }
    };
  },
  methods: {
    async getInitAddSkuFormData(spu, category1Id, category2Id) {
      this.spu = spu;
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      let promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/6
      let promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);
      // http://localhost:9529/dev-api/admin/product/spuImageList/6
      let promise3 = this.$API.sku.getSpuImageList(spu.id);

      // Promise.all()
      // 功能：同时处理多个promise对象
      // 参数：多个promise对象组成的数组   对象的数组
      // 返回值：返回一个新的promise对象

      // 返回的promise成功还是失败就看数组当中所有promise对象的处理结果

      // 如果所有的promise都是成功的，那么返回的promise也就是成功的，成功的结果是
      // 所有的promise成功的结果组成的数组
      // 如果所有的promise有一个失败，那么返回的promise就是失败的，失败的原因就是
      // 所有的promise当中失败的promise的原因
      try {
        const result = await Promise.all([promise1, promise2, promise3]);
        this.attrList = result[0].data;
        this.spuSaleAttrList = result[1].data;

        let spuImageList = result[2].data;
        spuImageList.forEach(item => item.isDefault = '0')
        this.spuImageList = spuImageList
      } catch (error) {
        this.$message.error("获取初始化数据失败" + error.message);
      }
    },
    // 选中图片的回调
    handleSelectionChange(val){
      // console.log(val)
      this.skuImageList = val
    },

    // 点击设为默认排它设置默认图片
    changeDefault(spuImageList,row){
      spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'
      // 收集默认图片的路径
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 保存操作
    async save(){
      // 获取请求参数
      let {spu,attrList,spuSaleAttrList,skuImageList,skuInfo} = this
      // 整理参数
      // 先整理spu内部的，父组件传递的
      skuInfo.category3Id = spu.category3Id
      skuInfo.spuId = spu.id
      skuInfo.tmId = spu.tmId
      // 整理sku的图片列表
      // 最终要的格式
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0
      // 目前我们的格式
      // id:29
      // imgName:"9d9934cae91bce4b.jpg"
      // imgUrl:"http://47.93.148.192:8080/group1/M00/02/DA/rBHu8mGxO7mAcdzzAABDAYQkYSM975.jpg"
      // isDefault:"0"
      // spuId:5
      skuInfo.skuImageList = skuImageList.map(item => ({
        imgName:item.imgName,
        imgUrl:item.imgUrl,
        isDefault:item.isDefault,
        spuImgId:item.id
      }))
      // 整理sku的平台属性值列表和销售属性值列表
      skuInfo.skuAttrValueList = attrList.reduce((prev,item) => {
        if(item.attrIdValueId){
          let [attrId,valueId] = item.attrIdValueId.split(':')
          let obj = {attrId,valueId}
          prev.push(obj)
        }
        return prev
      },[])

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.saleAttrIdValueId){
          let [saleAttrId,saleAttrValueId] = item.saleAttrIdValueId.split(':')
          let obj = {saleAttrId,saleAttrValueId}
          prev.push(obj)
        }
        return prev
      },[])

      // for  for...in  for...of   forEach
      // for循环是js当中最基础的 通常用来遍历数组的，它的效率一般，但是可以使用breack和continue
      // for...in 循环是专门遍历对象的包含数组，它效率最低，除了遍历自身还会遍历原型（属性必须是可迭代属性）
      // for...of 循环专门遍历可迭代对象的，对象数据必须包含iterator方法，就可以使用for...of效率仅此于forEach
      // forEach 是数组的一个方法，效率是最高的，遍历数组。不能使用breack和continue
      // for...in以后禁用，以后遍历对象先转数组再forEach  Object.keys()

      // 发请求
      try {
        // 成功干啥
        const result = await this.$API.sku.addUpdate(skuInfo)
        if(result.code === 200 || result.code === 20000){
          this.$message.success('保存sku成功')
          this.$emit('update:isShowSkuForm',false)
          // 不需要重新让父组件发请求获取spu的列表数据，因为spu列表并没有改变
          this.resetData()
        }else{
          this.$message.error('保存sku失败')
        }
      } catch (error) {
        // 失败干啥
        this.$message.error('请求保存sku失败')
      }
    },

    // 清空data的所有数据
    resetData(){
      Object.assign(this._data,this.$options.data())
    },
    // 点击取消
    cancleback(){
      this.$emit('update:isShowSkuForm',false)
      this.resetData()
    }
  }
};
</script>

<style scoped></style>
