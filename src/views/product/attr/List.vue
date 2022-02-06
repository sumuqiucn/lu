<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 这个是列表界面 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="warning"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>

              <el-popconfirm :title="`你确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 这个是添加或者修改的界面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button :disabled="!attrForm.attrName" type="primary" icon="el-icon-plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%; margin:20px 0"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display:block;width:100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="!attrForm.attrValueList.length">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true,

      attrForm: {
        attrName: "",
        // 第一步：先让table去展示这个属性值数组
        // 第二步：点击添加属性值按钮，往属性值数组当中添加一个数据
        //  这个数据的格式是一个对象，对象里面的属性包含attrId还有valueName
        //  添加这个对象的时候，valueName是空的，留着后期让用户输入的
        // 第三步：数据添加会造成table表格会展示一行，我们可以在这行当中显示一个input框
        //   让用户去输入想要的属性值名称
        // attrId的值，是当前这个属性值所属属性的id
        attrValueList: [
          // {
          //   attrId: 0,
          //   valueName: ""
          // }
        ],
        categoryId: "",
        categoryLevel: 3
      }
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.attrList = [];
        this.category2Id = "";
        this.category3Id = "";

        this.category1Id = categoryId;
      } else if (level === 2) {
        this.attrList = [];
        this.category3Id = "";

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;

        // 发请求获取属性列表
        this.getAttrList();
      }
    },
    // 请求获取属性列表
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      try {
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code === 200 || result.code === 20000) {
          this.attrList = result.data;
        } else {
          this.$message.error("获取属性列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取属性列表失败");
      }
    },
    // 点击添加属性按钮显示添加属性界面
    showAddDiv() {
      this.isShowList = false;

      // 清空attrForm
      this.attrForm = {
        attrName: "",

        attrValueList: [
          // {
          //   attrId: 0,
          //   valueName: ""
          // }
        ],
        categoryId: this.category3Id, //在这里可以写是因为这里已经是后期，data已经初始化完成了
        categoryLevel: 3
      };
    },
    // 点击添加属性值按钮
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        //添加属性是可以添加属性值的，此时这个id是undefined,因为添加属性的时候属性是没有id的
        // 修改属性也是可以添加属性值的，修改属性，属性当中是有id的
        valueName: "",
        isEdit: true
      });
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    // 点击修改属性按钮
    showUpdateDiv(row) {
      this.isShowList = false;
      this.attrForm = cloneDeep(row);

      // this.attrForm.attrValueList.forEach(item => item.isEdit = false)
      this.attrForm.attrValueList.forEach(item =>
        this.$set(item, "isEdit", false)
      );
    },
    // 添加模式标识数据
    // 每个属性值无论新添加的还是老的都有自己的编辑模式（input）和查看模式（span）
    // 怎么填
    // 对于新添加的属性值，一上来显示的就是input（编辑模式）老的属性值一上来就是span（查看模式）

    // 点击span切换为input 从查看模式变为编辑模式
    toEdit(row, index) {
      row.isEdit = true;

      // 自动获取焦点
      // console.log(this.$refs[index])
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    // input失去焦点或者回车，变为span  从编辑模式切换为查看模式
    toLook(row) {
      // input在切换为span之前要判断数据合法性
      // 	1、数据是不是空的
      let valueName = row.valueName;
      if (valueName.trim() === "") {
        // this.$message.error('输入的属性值名称不能为空白')
        row.valueName = "";
        return;
      }
      // 	2、除了自己以外，输入的数据是不是和其它的属性值名称重复
      let isRepeat = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("输入的属性值名称不能重复");
        row.valueName = "";
        return;
      }
      row.isEdit = false;
    },
    // 点击保存按钮，保存操作
    async save() {
      // 获取请求参数
      let attr = this.attrForm;
      // 整理参数
      // 1、属性值名称如果为空串，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性
      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName.trim() !== "") {
          delete item.isEdit;
          return true;
        }
      });
      // 3、属性值列表如果没有属性值，不发请求
      if (!attr.attrValueList.length) {
        return;
      }
      // 发请求
      try {
        // 成功干啥
        const result = await this.$API.attr.addOrUpdate(attr);
        if (result.code === 200 || result.code === 20000) {
          this.$message.success("保存属性成功");
          // 返回到属性列表页
          this.isShowList = true;
          // 重新获取属性列表数据
          this.getAttrList();
        } else {
          // 失败干啥
          this.$message.error("保存属性失败");
        }
      } catch (error) {
        this.$message.error("请求保存属性失败");
      }
    },
    // 删除属性的逻辑
    async deleteAttr(row){
      try {
        const result = await this.$API.attr.remove(row.id)
        if(result.code === 200 || result.code === 20000){
          this.$message.success('删除属性成功')
          this.getAttrList()
        }else{
          this.$message.error('删除属性失败')
        }
      } catch (error) {
        this.$message.error('请求删除属性失败')
      }
    }
  }
};
</script>

<style scoped></style>
