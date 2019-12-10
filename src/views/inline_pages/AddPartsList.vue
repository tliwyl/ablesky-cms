<template>
  <!-- list -->
  <div>
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <h4 style="margin: 0 0 8px;padding:0">筛选查询</h4>
        <el-form :inline="true" lable="物料ID:">
          <el-form-item>
            <el-input v-model="material_id" placeholder="物料ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="material_type" placeholder="物料类型">
              <el-option label="店铺相册" value="10007"></el-option>
              <el-option label="教育评论" value="10006"></el-option>
              <el-option label="课程物料" value="10005"></el-option>
              <el-option label="预约电话" value="30001"></el-option>
              <el-option label="咨询电话" value="30002"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" v-on:click="queryMaterialList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewOne">新增物料</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table
        :data="material_list"
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%;"
      >
        <el-table-column prop="index" label="序号" sortable></el-table-column>
        <el-table-column prop="material_id" label="物料ID"></el-table-column>
        <el-table-column prop="material_type" label="物料类型"></el-table-column>
        <el-table-column prop="merchants_id" label="所属商户ID"></el-table-column>
        <el-table-column prop="shop_id" label="已绑定店铺ID"></el-table-column>
        <el-table-column prop="status" label="审核状态"></el-table-column>
        <el-table-column label="操作" width="300">
          <template scope="scope">
            <el-button type="info" size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
            <!-- <el-button type="primary" size="small">更新</el-button> -->
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="scope.row.pulishStatus=='0'"
              type="success"
              :disabled="scope.row.pulishStatus"
              size="small"
              @click="handleToPublish(scope.$index, scope.row)"
            >绑定</el-button>
            <el-button v-else
              type="warning"
              size="small"
              @click="handleUnpublish(scope.$index, scope.row)"
            >解绑</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="total"
          style="float:right;"
        ></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
import util from "../../common/js/util";
import qs from "qs";
import materialType from "../../common/js/materialType.js";
import auditStatus from "../../common/js/AuditStatus.js";
import {
  queryMaterial,
  deleteMaterial,
  unpublishMaterial
} from "../../api/api";

export default {
  data() {
    return {
      material_type: "10007",
      material_id: "",
      material_list: [],
      total: 10,
      page: 0,
      listLoading: false
    };
  },
  mounted() {
    this.getMaterialData();
  },
  methods: {
    //去往绑定页面
    handleToPublish(idx,row){
      console.log(idx, row)
      this.$router.push({path:'/BuildPartPublish',
        props:{
          index:idx,
          row:row
        }
      });
    },

    queryMaterialList() {
      this.getMaterialData();
    },
    getMaterialData() {
      const mid = sessionStorage.getItem("merchantsId")
      let params = {
        merchants_id: mid,
        shop_id: "",
        material_type: this.material_type,
        material_id: this.material_id,
        page_size: this.total,
        index: this.page
      };
      queryMaterial(qs.stringify(params)).then(res => {
        let { material } = res;
        console.log(res);
        material = material.map((item, index) => {
          item.index = index + 1;
          item.material_typeValue = item.material_type;
          item.material_type = materialType[item.material_type];
          item.status = auditStatus[item.status];
          item.pulishStatus = !!item.shop_id;
          return item;
        });
        this.material_list = material;
      });
    },
    addNewOne() {
      let cur = this.$router.history.current.fullPath;
      if (cur === "/addPartsNew") {
        console.log(cur);
      } else {
        console.log(cur);
      }
      sessionStorage.setItem("material_type", this.material_type);
      this.$router.push({ path: "/addPartsNew" });
    },

    handleCurrentChange(val) {
      this.page = val;
    },
    handleDel: function(index, row) {
      let params = {
        merchants_id: row.merchants_id,
        shop_id: row.shop_id,
        material_type: row.material_typeValue,
        material_id: row.material_id
      };
      deleteMaterial(qs.stringify(params)).then(res => {
        if (res.delete === "success") {
          this.material_list.splice(index, 1);
        }
      });
    },
    handleUnpublish: function(index, row) {
      let params = {
        merchants_id: row.merchants_id,
        id: row.shop_id || row.merchants_id || "",
        material_id: row.material_id
      };
      //console.log(params);
      unpublishMaterial(qs.stringify(params)).then(res => {
        console.log(res);
      });
    },
    handleView(index, row) {
      sessionStorage.setItem("material_type", row.material_typeValue);
      sessionStorage.setItem("material_data", JSON.stringify(row.data));
      this.$router.push({ path: `/addPartsNew` });
    }
  }
};
</script>

<style scoped>
</style>