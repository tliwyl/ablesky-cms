<template>

  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :disabled="!sessionIs" label="商户入驻" name="first">
      <el-form :model="form" label-width="110px" style="margin:20px;width:60%;min-width:600px;">
        <el-form-item class="must_write" label="商户名称:">
          <el-input v-model="form.merchants_name" placeholder="填写您的商户名称"></el-input>
        </el-form-item>
        <el-form-item class="must_write _fixmust" label="企业/学校名称:">
          <el-input v-model="form.org_name" checked placeholder="请您填写与营业执照/办学许可证上一致的名称"></el-input>
        </el-form-item>
        <el-form-item class="must_write" label=" 品牌名称">
          <el-input v-model="form.brand" placeholder="请填写您的品牌名称"></el-input>
        </el-form-item>

        <el-form-item class="must_write" label="注册类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="2">企业</el-radio>
            <!-- <el-radio :label="1">个人</el-radio> -->
          </el-radio-group>
        </el-form-item>

        <el-form-item class="must_write" label="资质类型">
          <el-radio-group v-model="form.edu_type">
            <el-radio :label="1">营业执照</el-radio>
            <el-radio :label="2">办学许可证</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.edu_type=='1'" class="must_write _fixmust" label="营业执照类型">
          <el-radio-group v-model="form.org_type">
            <el-radio :label="1">企业法人</el-radio>
            <el-radio :label="2">个体工商户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.edu_type===1" class="must_write _spin4" label=" 注册号">
          <el-input v-model="form.org_code" placeholder="请填写您的注册号，参考营业执照"></el-input>
        </el-form-item>

        <el-form-item v-if="form.edu_type===2" class="must_write _fixmust _spin" label=" 办学许可证编号">
          <el-input v-model="form.brand_name" placeholder="请您填写办学许可证编号"></el-input>
        </el-form-item>

        <el-form-item v-if="!form.org_license_time" class="must_write _spin4" label="有效期">
          <el-col :span="12">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              v-model="form.startime"
            ></el-date-picker>
          </el-col>

          <el-col :span="12">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              v-model="form.endtime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item v-if="!form.startime && !form.endtime">
          <el-checkbox-group v-model="form.org_license_time">
            <el-checkbox label="永久有效">永久有效</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item class="must_write" label="资质附件">
          <!-- 资质附件 上传图片只能是 account 没有携带任何参数 与上传相关接口-->
          <!--  :data="{merchants_id:mid}" -->
          <el-upload
            tip="资质附件"
            limit="1"
            :headers="headers"
            name="media"
            action="http://192.168.202.190:8081/openApi/account_upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleLicenseSuccess"
            :on-error="PicLicenseErr"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item class="must_write _spin3" label="联系人姓名:">
          <el-input v-model="form.owner_name" placeholder="填写您的姓名"></el-input>
        </el-form-item>
        <el-form-item class="must_write _fixmust" label="联系人手机号">
          <el-row>
            <el-input style="width:80%" v-model="insertNumer.owner_phone" placeholder="填写您的手机号"></el-input>
            <el-button class="validateCode" @click="sendMsg()" :disabled="isDisabled">{{buttonName}}</el-button>
          </el-row>
        </el-form-item>
        <el-form-item class="must_write must_write _spin3" label="输入验证码">
          <el-row>
            <el-input style="width:80%" v-model="insertNumer.validateCode" placeholder="填写您验证码"></el-input>
          </el-row>
        </el-form-item>

        <el-form-item class="must_write _spin3" label="联系人邮箱">
          <el-input v-model="form.owner_mail" placeholder="填写您的邮箱"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click.native.prevent="handleCreateMerchants">立即创建</el-button>
          <el-button @click.native.prevent="handleRefish">取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :disabled="sessionIs" label="审核情况" name="second">
      <el-steps
        v-model="merchantsState.status"
        :active="Number(merchantsState.status+1)"
        style="margin-left:200px"
         :finish-status="stepState"
        process-status="process"
      >
        <el-step title="信息填写"></el-step>
        <el-step title="进行中"></el-step>
        <el-step title="审核结果" :description="merchantsState.audit_msg"></el-step>
      </el-steps>

      <el-row style="margin-left:350px">
        <el-button @click="handleSubmitedInfo">查看已提交信息</el-button>
        <el-button @click="reSubmitMerchant" :disabled="isReSubmit">修改并重新申请</el-button>
        <el-button @click="handleClickNext" :disabled="nextStep">下一步</el-button>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
//import baseURL from '../../../config/api.config'
import { phoneCode, createMerchants, checkMerchantState } from "../../api/api";
import qs from "qs";
export default {
  data() {
    return {
      mid:sessionStorage.getItem("merchantsId"),
      isReSubmit:false,
      merchantsState: {
        status: "",
        audit_time: "",
        audit_msg: "",
        name: ""
      },
      nextStep:false,
      sessionIs: true,
      disabled: true,
      buttonName: "发送短信",
      isDisabled: false,
      time: 60,
      insertNumer: {
        owner_phone: "",
        validateCode: ""
      },
      activeName: "first",
      checktimestate: "0",
      form: {
        // 商户名称
        merchants_name: "",
        //企业学校名称
        org_name: "",
        brand: "",
        type: "",
        edu_type: "",
        //营业执照类型，edutype：1才有
        org_type: "",
        org_code: "",
        owner_name: "",
        owner_mail: "",
        legal_people_name: "",
        startime: '',
        endtime: '',
        org_license_time: "",
        //资质附件
        org_license: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      stepState:"success"
    };
  },
  computed: {
    headers() {
      return {
        ContentType: "multipart/form-data"
      };
    },
    startime(){
     return parseInt(this.form.startime.getTime());
    },
    endtime(){
     return parseInt(this.form.endtime.getTime());
    }
  },
  beforeMount() {
    this.activeName = this.getSession() ? 'first' : 'second';
  },
  methods: {
    handleRefish(){
      this.$router.push({path:"/merchantJoinInputInfo"})
    },
    getSession() {
        let params=sessionStorage.getItem("merchantsId")
         if(params=="null" || params==""){
           return this.sessionIs=true;
         }else{
           return this.sessionIs=false;
         }
        
    },
    getMecStatus(){
      let params={
          merchants_id:sessionStorage.getItem("merchantsId")
        }
      checkMerchantState(qs.stringify(params)).then(res=>{
          if(res.data.status==0){
            this.sessionIs=false;
          }else{
            this.sessionIs=true;
          }
        })
        return this.sessionIs
    },
    handleCreateMerchants() {
      let str = sessionStorage.getItem("merchantsId");
      // 得到的str是null的时候证明没有该用户。
      if (str.match(/\d+/g)) {
        this.$message({
          message: "您已经创建了商户",
          type: "warning"
        });
        return;
      } else {
        if (this.startime && this.endtime) {

          this.org_license_time =this.startime + "-" + this.endtime
        } else {
          this.org_license_time = "永久有效";
        }
        let credential = {
          merchants_name: this.form.merchants_name,
          brand: this.form.brand,
          edu_type: String(this.form.edu_type),
          org_type: String(this.form.org_type),
          org_code: this.form.org_code,
          org_name:this.form.org_name,
          org_license_time: this.org_license_time,
          org_license: this.form.org_license,
          owner_name: this.form.owner_name,
          owner_phone: this.insertNumer.owner_phone,
          owner_mail: this.form.owner_mail,
        };

        let params = {
          credential: JSON.stringify(credential),
          type: this.form.type,
          phone: this.insertNumer.owner_phone,
          code: this.insertNumer.validateCode,
          name: sessionStorage.getItem("username")
        };
        params = qs.stringify(params);
        createMerchants(params).then(data => {
          if (data.merchants_id) {
            this.$message({
              message: "创建成功",
              type: "success"
            });
            sessionStorage.setItem("merchantsId", data.merchants_id);
            window.location.reload();
          }

        });
      }
    },
    sendMsg() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.insertNumer.owner_phone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true
        });
        return;
      }
      if (!reg.test(this.insertNumer.owner_phone)) {
        this.$message({
          message: "请输入正确的手机号",
          center: true
        });
        return;
      }
      let params = {
        mobile: this.insertNumer.owner_phone
      };
      phoneCode(params).then(data => {
        this.$message({
          message: "验证码已发送，5分钟内有效",
          center: true
        });
      });

      let me = this;
      me.isDisabled = true;
      let interval = window.setInterval(function() {
        me.buttonName = me.time + "后重新发送";
        --me.time;
        if (me.time < 0) {
          me.buttonName = "重新发送";
          me.time = 60;
          me.isDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    reSubmitMerchant() {
      this.$router.push("/reSubmitMerchant");
    },
    handleClickNext() {
      this.$router.push({ path: "/submitInfoList" });
    },
    handleSubmitedInfo() {
      this.$router.push({ path: "/submitedInfoReview" });
      
    },
    handleClick(tab, event) {
      //console.log(tab)
    },
    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleLicenseSuccess(res, file) {
      this.form.org_license = res.data;
     //console.log(this.form.org_license)
    },
    PicLicenseErr(err, file, fileList) {
      //console.log(err);
    }
  },
  created(){
    var str = sessionStorage.getItem("merchantsId")
      let params = {
        merchants_id: str
      };
      checkMerchantState(qs.stringify(params)).then(data => {
        //修改并重新申请，按钮控制
        //console.log(data)
        if(data.data.status=="2"){
          this.nextStep=false;

        }else{
          this.nextStep=true;
        }
        console.log(this.nextStep)
        if(data.data.status=="1"){
          this.isReSubmit=false;
          this.stepState="error";
        }else{
          this.isReSubmit=true;
          this.stepState="success";//进度条
        }
        this.merchantsState.status = data.data.status;
        this.merchantsState.name = data.data.name;
        this.merchantsState.audit_msg = data.data.audit_msg;
        this.merchantsState.audit_time = data.data.audit_time;
      });
  },
  mounted(){
    this.getSession()
  }
};
</script>

<style lang="scss" scope>
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