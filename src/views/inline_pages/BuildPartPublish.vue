<template>
  <!-- rootNode -->
  <div>
    <el-card style="width:600px;margin:60px auto">
      <el-form style="margin:20px 0 0 60px">
        <el-form-item label="店铺列表">
          <el-select v-model="shop_id" placeholder="选择需要绑定的店铺">
            <el-option
              v-for="item in shopListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left:80px">
          <el-button type="success" @click="handleBuildPublic">绑定</el-button>
          <el-button type="info" @click="handleBackToShopList">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { checkShopState, buildMaterialPublish } from "../../api/api.js";
import qs from "qs";

export default {
  data() {
    return {
      props: {},
      shop_id: "", //店铺id
      material_id: "", //物料id
      shopListData: []
    };
  },
  props: {
    idx: {
      type: Number,
      default: 0
    },
    row: {
      type: Object
    }
  },
  methods: {
    handleBuildPublic() {
      let materialId = this.material_id;
      let mid = sessionStorage.getItem("merchantsId");
      let params = {
        material_id: materialId,
        id: this.shop_id,
        merchants_id: mid
      };
      if(!this.shop_id){
        this.$message({
          message: '请选择要绑定的商铺',
          type: 'success'
        });
        return ;
      }
      buildMaterialPublish(qs.stringify(params)).then(res => {
        const data = res.data;
        if(data.error_code){
          this.$message({
          message: data.error_msg,
          type: 'success'
        });

        }else{
          this.handleBackToShopList();
        }
      });
    },
    getShopList() {
      let mid = sessionStorage.getItem("merchantsId");
      let params = {
        merchants_id: mid,
        status: 2
      };
      checkShopState(qs.stringify(params)).then(res => {
        this.shop_id = "";
        this.shopListData = res.data.map(item => {
          let shop = {
            label: item.name,
            value: item.shopId
          };
          return shop;
        });
      });
    },
    handleBackToShopList() {
      this.$router.push({ path: "/addPartsList" });
    }
  },
  mounted() {
    //console.log(this.$router)
    console.log(this.$route);
    const route = this.$route;
    const query = route.query;
    console.log(query);
    this.material_id = query.material_id;
    this.getShopList();
  }
};
</script>

<style scoped>
</style>