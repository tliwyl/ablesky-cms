<template>
  <el-form
    ref="form"
    :model="form"
    label-width="110px"
    style="margin:20px;width:60%;min-width:600px;"
  >
    <el-form-item class="must_write" label="店铺名称:">
      <el-input v-model="form.name" placeholder="请填写店铺名称"></el-input>
    </el-form-item>

    <el-form-item class="must_write" label="服务城市">
      <el-cascader
        :props="propscity"
        :options="optionsServiceCity"
        @change="handleChangeServiceCity"
        clearable
        collapse-tags
      ></el-cascader>
    </el-form-item>

    <el-form-item class="must_write" label=" 所在城市">
      <el-cascader :options="optionsPosCity" @change="handleChangePosCity"></el-cascader>
    </el-form-item>

    <el-form-item class="must_write" label="详细地址:">
      <el-input v-model="form.detail_address" placeholder="请输入详细地址"></el-input>
    </el-form-item>
    <el-form-item class="must_write" label="机构地图:">
      <el-input v-model="form.position" placeholder="输入坐标信息"></el-input>
      <span>前往</span>
      <a target="_Black" href="http://api.map.baidu.com/lbsapi/getpoint/index.html">百度地图</a>
      <span>查询店铺坐标</span>
    </el-form-item>

    <el-form-item class="must_write" label="机构头图">
      <el-upload
        tip="上传一张营业执照"
        limit="1"
        :headers="headers"
        :data="{merchants_id: mid}"
        name="media"
        action="http://192.168.202.190:8081/openApi/media_upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleavatarSuccess"
        :on-error="PicLicenseErr"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </el-form-item>

    <el-form-item class="must_write" label=" 经营类目">
      <el-cascader :options="categorys"  @change="handleChangeCate"></el-cascader>
    </el-form-item>

    <el-form-item class="must_write _spin1" label="营业日">
      <el-select v-model="values" placeholder="选择营业日">
        <el-option v-for="item in arr" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span>至</span>
      <el-select v-model="valuee" placeholder="选择营业日">
        <el-option v-for="item in arr" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item class="must_write _spin3" label="营业时间段">
      <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
      start: '00:00',
      step: '00:30',
      end: '23:59'
    }"
      ></el-time-select>
      <span>至</span>
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
      start: '00:00',
      step: '00:30',
      end: '23:59',
      minTime: startTime
    }"
      ></el-time-select>
    </el-form-item>

    <el-form-item class="" label="合作授权协议">
      <el-upload
        limit="1"
        :headers="headers"
        name="media"
        :data="{merchants_id: mid}"
        action="http://192.168.202.190:8081/openApi/media_upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleprotocol"
        :on-error="PicLicenseErr"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </el-form-item>

    <el-form-item class="must_write _spin3" label="运营者姓名">
      <el-input v-model="form.owner_name" placeholder="运营者姓名"></el-input>
    </el-form-item>

    <el-form-item class="must_write _spin3" label="运营者电话">
      <el-row>
        <el-input style="width:80%" v-model="insertNumer.owner_phone" placeholder="运营者电话"></el-input>

        <el-button class="validateCode" @click="sendMsg()" :disabled="isDisabled">{{buttonName}}</el-button>
      </el-row>
    </el-form-item>
    <el-form-item class="must_write must_write _spin3" label="输入验证码">
      <el-row>
        <el-input style="width:80%" v-model="insertNumer.validateCode" placeholder="填写您验证码"></el-input>
      </el-row>
    </el-form-item>
    <el-form-item class="must_write _spin3" label="运营者邮箱">
      <el-input v-model="form.owner_mail" placeholder="运营者邮箱"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { shopCreate, phoneCode } from "../../api/api.js";
import { arr } from "../../common/js/workday.js";
import categoryjson from "../../common/js/Category.js";
import {} from "../../common/js/Category.js"
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import qs from "qs";

export default {
  data() {
    return {
      mid:sessionStorage.getItem("merchantsId"),
      values: "",
      valuee: "",
      arr: [
        {
          value: "周一",
          label: "周一"
        },
        {
          value: "周二",
          label: "周二"
        },
        {
          value: "周三",
          label: "周三"
        },
        {
          value: "周四",
          label: "周四"
        },
        {
          value: "周五",
          label: "周五"
        },
        {
          value: "周六",
          label: "周六"
        },
        {
          value: "周日",
          label: "周日"
        }
      ],
      time: 60,
      buttonName: "发送短信",
      isDisabled: false,
      worksarr: arr,
      propscity: { multiple: true },
      optionsServiceCity: provinceAndCityData, //课提供服务城市
      selectedOptionsServiceCity: [],
      optionsPosCity: regionData, //所在城市
      selectedOptionsPosCity: [],
      works: "",
      worke: "",
      startTime: "",
      endTime: "",
      categorys: categoryjson,
      insertNumer: {
        owner_phone: "",
        validateCode: ""
      },
      form: {
        name: "",
        detail_address: "",
        position: "",
        avatar: "",
        protocol: "",
        work_day: "",
        tp_auth_img: "",
        owner_mail: "",
        owner_name: "",
        category: []
      },
      dialogImageUrl: "",
      dialogVisible: false,
      loChina: "",
      seChina: ""
    };
  },
  computed: {
    headers() {
      return {
        ContentType: "multipart/form-data"
      };
    }
  },
  methods: {
    handleChangeCate(value) {
      //处理数据
      let str=value.join("_")
      let arr=[];
      arr.push(str)
      this.category=arr;
    },
    handleChangeServiceCity(value) {
      this.selectedOptionsServiceCity = value.map(function(item) {
        return CodeToText[item];
      });
      this.selectedOptionsServiceCity=this.selectedOptionsServiceCity.join(",").split()
    },
    handleChangePosCity(value) {
      this.selectedOptionsPosCity = value.map(function(item) {
        return CodeToText[item];
      });
      this.selectedOptionsPosCity=this.selectedOptionsPosCity;
     // console.log(this.selectedOptionsPosCity)
    },
    handleSubmit() {
      let shop_info = {
        name: this.form.name,
        avatar: this.form.avatar,
        category:this.category, //["留学_留学考试/培训_雅思"]  this.form.category
        location: this.selectedOptionsPosCity.join(), //"北京市,北京市,昌平区"
        work_day: `${this.values}至${this.valuee}`,
        work_time: `${this.startTime}-${this.endTime}`,
        detail_address: this.form.detail_address,
        owner_name: this.form.owner_name,
        owner_phone: this.insertNumer.owner_phone,
        code: this.insertNumer.validateCode,
        owner_mail: this.form.owner_mail,
        position: this.form.position,
        service_city: this.selectedOptionsServiceCity,
        tp_auth_img: this.form.tp_auth_img
      };
      var str = sessionStorage.getItem("merchantsId")
      var params = {
        shop_info: JSON.stringify(shop_info),
        merchants_id: str
      };
      params = qs.stringify(params);
      shopCreate(params).then(data => {
        if (data.shop_id) {
          this.$message({
            message:"添加成功",
            type:"success"
          });
          this.$router.push({ path: "/submitInfoList" });
        }
      });
    },
    handleReset() {
      this.$router.push({ path: "/submitInfoList" });
    },
    handleRemove(file, fileList) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleavatarSuccess(res, file) {
      this.form.avatar = res.data;
    },
    handleprotocol(res, file) {
      this.form.tp_auth_img = res.data;
    },
    PicLicenseErr(err, file, fileList) {
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
       // console.log(data);
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
    }
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
._spin1::before {
  margin-right: 6px !important;
}

._spin3::before {
  margin-left: 12px;
}
._spin4::before {
  margin-left: 46px !important;
}
</style>