<template>
   <el-form
        :model="form"
        label-width="110px"
        style="margin:20px;width:60%;min-width:600px;"
      >
        <el-form-item class="must_write" label="商户名称:">
          <el-input v-model="form.merchants_name" readonly></el-input>
        </el-form-item>
        <el-form-item class="must_write _fixmust" label="企业/学校名称:">
          <el-input v-model="form.org_name" checked readonly ></el-input>
        </el-form-item>
        <el-form-item class="must_write" label=" 品牌名称">
          <el-input v-model="form.brand" readonly ></el-input>
        </el-form-item>
        
           <el-form-item class="must_write"  label="注册类型">
          <el-radio-group disabled v-model="form.type">
            <el-radio  :label="2">企业</el-radio>
            <!-- <el-radio  :label="1">个人</el-radio> -->
          </el-radio-group>
        </el-form-item>

        <el-form-item class="must_write" label="资质类型">
          <el-radio-group disabled v-model="form.edu_type">
            <el-radio :label="1">营业执照</el-radio>
            <el-radio :label="2">办学许可证</el-radio>
          </el-radio-group>
        </el-form-item>
     
        <el-form-item v-if="form.edu_type==1" class="must_write _fixmust" label="营业执照类型">
          <el-radio-group disabled v-model="form.org_type">
            <el-radio :label="1">企业法人</el-radio>
            <el-radio :label="2">个体工商户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.edu_type==1" class="must_write _spin4" label=" 注册号">
          <el-input v-model="form.org_code" readonly></el-input>
        </el-form-item>

        <el-form-item v-if="form.edu_type==2" class="must_write _fixmust _spin" label=" 办学许可证编号">
          <el-input v-model="form.brand_name" readonly></el-input>
        </el-form-item>

        <el-form-item  class="must_write _spin4" label="有效期">
          <el-col :span="12">
            <el-date-picker
              disabled
              format="yyyy 年 MM 月 dd 日"
              type="dates"
              v-model="startime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>

          <el-col :span="12">
            <el-date-picker
              disabled
              format="yyyy 年 MM 月 dd 日"
              type="dates"
              v-model="endtime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-checkbox-group v-model="form.org_license_time">
            <el-checkbox disabled label="永久有效">永久有效</el-checkbox>
          </el-checkbox-group>

        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item class="must_write" label="资质附件">
          <img :src="form.org_license" width="400" height="400" alt="资质附件图片"/>
        </el-form-item>
        <el-form-item class="must_write _spin3" label="联系人姓名:">
          <el-input readonly v-model="form.owner_name"></el-input>
        </el-form-item>

        <el-form-item class="must_write _fixmust" label="联系人手机号">
          <el-row>
            <el-input readonly
              style="width:80%"
              v-model="insertNumer.owner_phone"
            ></el-input>
          </el-row>
        </el-form-item>
        
        <el-form-item class="must_write _spin3" label="联系人邮箱">
          <el-input readonly v-model="form.owner_mail"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click.native.prevent="handleBack">返回</el-button>
        </el-form-item>
      </el-form>
</template>

<script>
import {phoneCode,createMerchants,checkMerchantState,getMerchantsInfo} from "../api/api";

export default {
  data() {
    return {
      disabled: true,
      insertNumer: {
        owner_phone: "",
      },
      startime: "",
      endtime: "",
      form: {
        // 商户名称
        merchants_name: "",
        //企业学校名称
        org_name: "",
        brand: "",
        type:"",
        edu_type: "",
        //营业执照类型，edutype：1才有
        org_type: "",
        org_code: "",
        owner_name: "",
        owner_mail: "",
        legal_people_name:"",
        startime:"",
        endtime:"",
        org_license_time: "",
        //资质附件
        org_license:""
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {
    headers() {
      return {
        ContentType: "multipart/form-data"
      };
    }
  },
  created(){
    if(this.$router){
      let str=sessionStorage.getItem("merchantsId");
    let params={
      merchants_id:str
    }
    getMerchantsInfo(params).then(data=>{
      if(data.data){
        let reviewdata=data.data;
        //console.log(reviewdata)
        if(reviewdata.id!=""){
        this.startime=reviewdata.orgLicenseTime.split("-")[0] ;
        this.endtime=reviewdata.orgLicenseTime.split("-")[1] ;
        }else{
          this.form.org_license_time="永久有效"
        }
        this.form.merchants_name=reviewdata.merchantsName || "未填写"
        this.form.org_name=reviewdata.orgName || "未填写"
        this.form.brand =reviewdata.brand || "未填写"
        this.form.edu_type=Number(reviewdata.eduType) || 2
        this.form.org_type=Number(reviewdata.orgType) || 1
        this.form.org_code=reviewdata.orgCode || "未填写"
        this.form.owner_name=reviewdata.ownerName || "未填写"
        this.form.owner_mail=reviewdata.ownerMail || "未填写"
       
        this.form.org_license=reviewdata.orgLicense || "未填写"
        this.form.org_license_time=reviewdata.orgLicenseTime || "未填写"
        this.form.type=2
        this.insertNumer.owner_phone=reviewdata.ownerPhone || "未填写"
        this.name=sessionStorage.getItem("username")
      }else{
        this.$message({
          message:"请重新操作一遍",
          type:"info"
        });
      }
    })}
  },
  methods: {
    handleBack(){
      this.$router.push({path:"/merchantJoinInputInfo"})
    }
  }
};
</script>

<style lang="" >
.width_limit {
  min-width: 109px;
}
.el-form .el-form-item {
  position: relative;
}
.must_write::before {
  content: "*";
  font-size: 1em;
  color: red;
  position: absolute;
  margin: 12px 30px 0;
  z-index: 1;
}
._fixmust::before {
  margin: 12px 0px 0;
  z-index: 1;
}
._spin::before {
  margin-left: -8px;
}
._spin3::before {
  margin-left: 12px;
}
._spin4::before {
  margin-left: 46px;
}
</style>