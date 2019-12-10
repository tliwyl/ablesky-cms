<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <h4 style="margin: 0 0 8px;padding:0">筛选查询</h4>
      <el-form :inline="true" >
        <el-form-item>
          <el-select v-model="select" placeholder="审核状态">
          <el-option label="待审核" value="0"></el-option>
          <el-option label="拒绝" value="1"></el-option>
          <el-option label="通过" value="2"></el-option>
        </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="info" @click.native.prevent=handleSerchShop>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="handleAddShop">添加店铺</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="datalist" highlight-current-row style="width: 100%;">
      <el-table-column label="序号" width="100" prop="id" sortable></el-table-column>
			<el-table-column prop="name"  label="店铺名称" >
      </el-table-column>
      <el-table-column prop="shopStatus"  label="审核状态" ></el-table-column>
      <el-table-column label="操作" >
        <template solt-scope="scope">
          <el-button  size="small" @click="shopUpdate">更新</el-button>
          <el-button size="small" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {checkShopState} from "../../api/api.js";
import shopStatus from '../../common/js/shopStatus.js'

export default {
  data() {
    return {
      select: "0",
      datalist:[]
    };
  },
  methods: {
    shopUpdate(){
      this.$router.push("/addShopInfoUpdate");
    },
    handleSerchShop(){
      let str=sessionStorage.getItem("merchantsId")
      let params={
        status:this.select || 0,
        merchants_id:str
      }
      checkShopState(params).then(data=>{
        let shopList = data.data.map(item => {
          item.shopStatus = shopStatus[item.shopStatus];
          return item;
        })
        this.datalist = [...shopList];
      })
    },
    addBussi: function() {
      this.$router.push({ path: "/addMerchantInfo" });
    },
    handleAddShop(){
      this.$router.push({ path: "/AddShopInfo" });
    }
  },
  mounted() {
    this.handleSerchShop();
  }
};
</script>

<style scoped>

</style>