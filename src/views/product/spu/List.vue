<template>
  <div>
    <!-- 三级联动 -->
      <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>


  </div>
</template>
<script>
// 引入
 import SkuFrom from '@/views/product/spu/components/SkuFrom'
 import SpuFrom from '@/views/product/spu/components/SpuFrom'
export default {
  name: 'Spu',
  components:{
      SkuFrom,
      SpuFrom
  },
  data() {
    return {
      isShowList: true, //这里这个数据传递过去只是为了解决可操作性的，并不是为了切换页面
      category1Id: "",
      category2Id: "",
      category3Id: "",
    };
  },
  methods:{

  }

}
</script>

<style scoped>

</style>
