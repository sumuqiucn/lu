<template>
  <div>
    <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <!-- 这个div是spu列表的界面 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          :disabled="!category3Id"
          type="primary"
          icon="el-icon-plus"
          @click="showAddSpuForm"
          >添加SPU</el-button
        >

        <el-table :data="spuList" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看spu的sku列表"
                @click="showSkuList(row)"
              ></HintButton>

              <el-popconfirm
                :title="`你确定要删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 
         -->
        <el-pagination
          background
          style="text-align:center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          :page-sizes="[2, 5, 7]"
          layout="prev, pager, next, jumper,->,sizes,total"
        >
        </el-pagination>
      </div>
      <!-- 这个是spu的添加或者修改界面 -->
      <!-- <div></div> -->
      <!-- <SpuForm
        v-show="isShowSpuForm"
        :isShowSpuForm="isShowSpuForm"
        @update:isShowSpuForm="isShowSpuForm = $event"
      ></SpuForm> -->
      <SpuForm
        ref="spu"
        v-show="isShowSpuForm"
        :isShowSpuForm.sync="isShowSpuForm"
        @successBack="successBack"
      ></SpuForm>
      <!-- 这个是添加sku的界面 -->
      <!-- <div></div> -->
      <SkuForm
        ref="sku"
        v-show="isShowSkuForm"
        :isShowSkuForm.sync="isShowSkuForm"
      ></SkuForm>
    </el-card>

    <el-dialog :before-close="closeDialog" :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import SpuForm from "@/views/product/spu/components/SpuForm";
import SkuForm from "@/views/product/spu/components/SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      isShowList: true, //这里这个数据传递过去只是为了解决可操作性的，并不是为了切换页面
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],

      page: 1,
      limit: 2,
      total: 0,

      // 下面这两个数据是控制三个页面之间的切换
      isShowSpuForm: false,
      isShowSkuForm: false,

      //下面数据是查看spu的sku列表
      dialogTableVisible: false,
      spu:{},
      skuList:[],
      loading:false
    };
  },
  // 三级联动的可操作性处理
  watch: {
    isShowSpuForm: {
      handler(newVal, oldVal) {
        this.isShowList = !newVal;
      }
    },

    isShowSkuForm: {
      handler(newVal, oldVal) {
        this.isShowList = !newVal;
      }
    }
  },

  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.spuList = [];
        this.category2Id = "";
        this.category3Id = "";
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.spuList = [];
        this.category3Id = "";
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      try {
        const result = await this.$API.spu.getList(page, limit, category3Id);
        if (result.code === 200 || result.code === 20000) {
          this.spuList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取spu列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取spu列表失败");
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },

    // 点击添加spu的按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitAddSpuFormData(this.category3Id);
    },
    // 点击修改spu的按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitUpdateSpuFormData(row, this.category3Id);
    },
    // 点击添加sku的按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      this.$refs.sku.getInitAddSkuFormData(
        row,
        this.category1Id,
        this.category2Id
      );
    },
    // 保存成功的回调
    successBack(spuId) {
      if (spuId) {
        // 修改成功回来的
        this.getSpuList(this.page);
      } else {
        // 添加成功回来的
        this.getSpuList();
      }
    },
    // 点击删除spu
    async deleteSpu(row) {
      try {
        const result = await this.$API.spu.remove(row.id);
        if (result.code === 200 || result.code === 20000) {
          this.$message.success("删除spu成功");
          this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
        } else {
          this.$message.error("删除spu失败");
        }
      } catch (error) {
        this.$message.error("请求删除spu失败");
      }
    },

    // 点击查看spu的sku列表
    async showSkuList(row) {
      this.spu = row
      this.dialogTableVisible = true
      // this.skuList = []  打开的时候清空之前的数据
      this.loading = true
      // 发请求获取sku的列表
      try {
        const result = await this.$API.sku.getListBySpuId (row.id)
        if(result.code === 200 || result.code === 20000){
          this.skuList = result.data
        }else{
          this.$message.error('获取sku列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取sku列表失败')
      }

      this.loading = false
      
    },  
    // dialog关闭之前的回调
    closeDialog(done){
      // 关闭之前重置数据
      this.skuList = []
      // done()
      this.dialogTableVisible = false
      this.loading = false
    }
  }
};
</script>

<style scoped></style>
