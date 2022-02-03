<template>
    <div>
    <el-form :model="cForm" :inline="true" class="demo-form-inline" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <!-- select v-model收集的是选中的option的value值 -->
        <el-select v-model="cForm.category1Id"  placeholder="请选择" @change="handlerCategory1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <!-- select v-model收集的是选中的option的value值 -->
        <el-select v-model="cForm.category2Id"  placeholder="请选择" @change="handlerCategory2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <!-- select v-model收集的是选中的option的value值 -->
        <el-select v-model="cForm.category3Id"  placeholder="请选择" @change="handlerCategory3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name:'CategorySelector',
        // 控制可擦操作性为true便不可以点击三级联动上的选项
        props:['isShowList'],
        data(){
            return{
                // 初始化三级分类数组和id
                category1List:[],
                category2List:[],
                category3List:[],
                cFrom:{
                    category1Id,
                    category2Id,
                    category3Id
                }
            }
        },
        mounted(){
            this.getcategory1List()
        },
        methods:{
            async getcategory1List(){
                try {
                 const result = await this.$API.category.getCategory1()
                 if(result.code === 200 || res.code === 20000){
                  this.category1List  = this.result
                 }else{
                    this.$message.error('获取一级分类失败')
                 }
                } catch (error) {
                    this.$message.error('请求获取一级分类失败')
                }
                
            },

            async handlerCategory1(category1Id){
                // 请求前清空二级级分类和三级分类
                category2List=[],
                category3List=[],
                this.cFrom.category2Id=''
                this.cFrom.category3Id=''
                this.$emit('changecategory',{categoryId:category2Id,level:1})
                try {
                const result = await this.$API.category.getCategory2(category1Id)
                if(result.code === 200 || result.code === 20000){
                    this.category2List   = this.result
                }else{
                    this.$message.error('获取二级分类失败')
                }
                } catch (error){
                    this.$message.error('请求获取二级分类失败')
                }
            },
            async handlerCategory2(category2Id){
                // 请求前先清空三级分类和三级id
                this.category2List=[],
                this.cFrom.category2Id=''
                this.$emit('changeCategory',{categoryId:category3Id,level:2})

                try {
                    const result =await this.$APPI.category.getCategory3(category2Id)
                    if(reuslt.code === 200 || result.code === 20000){
                        this.category3List = this.result
                    }else{
                        this.$message.error('获取三级分类失败')
                    }
                } catch (error) {
                        this.$message.error('请求获取三级分类失败')
                }
            },
           async handlerCategory3(category3Id){
               this.$emit('changeCategory',{categoryId:category3Id,level:3})
           }
        }
    }
</script>

<style scoped>

</style>