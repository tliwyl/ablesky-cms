<template>
  <!-- 新增物料页面 -->
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺相册" name="10007">
        <div v-if="editAble">
          <span>至少上传三张图片:</span>
          <el-upload
            action="http://192.168.202.190:8081/openApi/media_upload"
            :data="{merchants_id: mid}"
            list-type="picture-card"
            name="media"
            :auto-upload="true"
            :multiple="true"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlePartSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
          <el-row>
            <el-button type="primary" @click="handleSubmitImg">提交</el-button>
            <el-button type @click="handleBackToList">取消</el-button>
          </el-row>
        </div>
        <div v-else>不可编辑</div>
      </el-tab-pane>
      <el-tab-pane label="教育评论" name="10006" align-center>
        <el-form label-width="110px" style="margin:20px;width:60%;min-width:600px;">
          <el-form-item class="must_write" label="店铺列表">
            <el-select v-model="shop_id" placeholder="请选择">
              <el-option
                v-for="item in shopListData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 分隔 -->
          <el-form-item class="must_write" label="用户名">
            <el-input v-model="form.name" style="width:220px" label="用户名" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              name="media"
              :data="{merchants_id: mid}"
              :before-upload="beforeAvatarUpload"
              action="http://192.168.202.190:8081/openApi/media_upload"
              :on-error="PicLicenseErr"
              :on-success="handlePartSuccess"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item class="must_write" label="评论内容">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.text"></el-input>
          </el-form-item>
          <el-form-item class="must_write" label="评分">
            <el-rate v-model="form.score" show-score text-color="#ff9900" score-template="{rate}"></el-rate>
          </el-form-item>
          <el-form-item class="must_write" label="评论时间">
            <el-date-picker v-model="form.time" type="datetime" placeholder="设置评论时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click.native.prevent="handleMsgSure">确定</el-button>
            <el-button @clcik="handleBackToList">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="教育课程" name="10005" align-center>
        <el-form label-width="140px" style="margin:20px;width:60%;min-width:600px;">
          <!-- 分隔 -->
          <el-form-item :required="true" label="课程名称">
            <el-input v-model="course.name"></el-input>
          </el-form-item>

          <el-form-item :required="true" label="课程类目">
            <div>
              <el-cascader
                expand-trigger="hover"
                :options="categoryjson"
                v-model="categorycategorychoose"
                @change="handleChangeCurseCategory"
              ></el-cascader>
            </div>
            <div>
              <ul style="margin-left: -30px;">
                <li
                  v-for="(item, index) in course.category"
                  :key="item + index"
                  style="width: 300px; overflow: hidden;"
                >
                  <span style="float: left;">{{item}}</span>
                  <el-button
                    style="float: right;"
                    type="danger"
                    size="small"
                    @click="handleDelCurseCategory(index)"
                  >删除</el-button>
                </li>
              </ul>
            </div>
            <!-- <el-select v-model="course.category" placeholder="请选择">
              <el-option
                v-for="item in categoryjson"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </el-form-item>

          <el-form-item :required="true" label="课程头图">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              name="media"
              :data="{merchants_id: mid}"
              :before-upload="beforeAvatarUploadCourse"
              action="http://192.168.202.190:8081/openApi/media_upload"
              :on-error="PicLicenseErrCourse"
              :on-success="handlePartSuccessCourse"
            >
              <img v-if="course_images" :src="course_images" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item :required="true" label="课程类型">
            <el-radio v-model="course.type" label="正式课">正式课</el-radio>
            <el-radio v-model="course.type" label="体验课">体验课</el-radio>
          </el-form-item>

          <el-form-item :required="true" label="课程最低价" style="width:200px">
            <el-input
              :min="0"
              v-model="course.minprice"
              @blur="handleCheckMinPrice($event, 'minprice')"
            ></el-input>
          </el-form-item>

          <el-form-item :required="true" label="课程最高价" style="width:200px">
            <el-input
              :min="0"
              v-model="course.maxprice"
              @blur="handleCheckMinPrice($event, 'maxprice')"
            ></el-input>
          </el-form-item>
          <el-form-item :required="true" label="授课形式">
            <el-checkbox-group v-model="course.course_mode">
              <el-checkbox label="线下面授"></el-checkbox>
              <el-checkbox label="线上直播"></el-checkbox>
              <el-checkbox label="线上录播"></el-checkbox>
              <el-checkbox label="双师课堂"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="特色服务">
            <el-checkbox-group v-model="course.tags" :max="3">
              <el-checkbox label="免费试听"></el-checkbox>
              <el-checkbox label="家长旁听"></el-checkbox>
              <el-checkbox label="支持退费"></el-checkbox>
              <el-checkbox label="外教授课"></el-checkbox>
              <el-checkbox label="封闭住宿"></el-checkbox>
              <el-checkbox label="免费重读"></el-checkbox>
              <el-checkbox label="外教小班"></el-checkbox>
              <el-checkbox label="外教1对1"></el-checkbox>
              <el-checkbox label="小班教学"></el-checkbox>
              <el-checkbox label="外教数学"></el-checkbox>
              <el-checkbox label="1对1教学"></el-checkbox>
            </el-checkbox-group>
            <span class="desc_span">最多选三项</span>
          </el-form-item>
          <!-- 是否支持免费试听 -->
          <el-form-item :required="true" label="是否支持免费试听">
            <el-radio v-model="course.experience_info" label="是">是</el-radio>
            <el-radio v-model="course.experience_info" label="否">否</el-radio>
          </el-form-item>
          <el-form-item label="适合基础">
            <el-input v-model="course.level" :maxlength="6"></el-input>
          </el-form-item>
          <el-form-item :required="true" label="上课人数">
            <el-select v-model="course.attendee_capacity" placeholder="上课人数">
              <el-option
                v-for="item in course_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级信息">
            <el-button @click="handleAddClassInfo">添加班级</el-button>
          </el-form-item>
          <el-form-item>
            <el-card
              style="margin: 10px 0;"
              v-for="(item,index) in course.classinfo"
              :key="item.class_name + item.class_time + item.start_time + index"
              :body-style="{ padding: '0px' }"
            >
              <div style="padding: 14px;">
                <el-form label-position="right" label-width="100px">
                  <el-form-item :required="true" label="班级名称:">
                    <el-input v-if="item.editAble" v-model="course_class_name"></el-input>
                    <span v-else>{{item.class_name}}</span>
                  </el-form-item>
                  <el-form-item :required="true" label="上课时间:">
                    <el-input
                      v-if="item.editAble"
                      v-model="course_class_time"
                      placeholder="请填写具体时间，若无请备注"
                    ></el-input>
                    <span class="desc_span" v-if="item.editAble">备注信息可包括但不限于以下词汇：预约制/随时开课/随你定</span>
                    <span v-else>{{item.class_time}}</span>
                  </el-form-item>
                  <el-form-item :required="true" label="开班时间:">
                    <el-input
                      v-if="item.editAble"
                      v-model="course_start_time"
                      placeholder="请填写具体时间"
                    ></el-input>
                    <span v-else>{{item.start_time}}</span>
                  </el-form-item>
                  <el-form-item label="课程数量:">
                    <el-input
                      v-if="item.editAble"
                      v-model="course_lesson_count"
                      placeholder="请填写具体数量"
                    ></el-input>
                    <span v-else>{{item.lesson_count}}</span>
                  </el-form-item>
                </el-form>
                <div v-if="item.editAble" class="bottom clearfix" style="margin-left: 30px;">
                  <el-button type="text" class="button" @click="handleSaveClassInfoEdit(index)">保存</el-button>
                  <el-button
                    type="text"
                    class="button"
                    @click="handleChangeClassInfoEdit(index, false)"
                  >取消</el-button>
                </div>
                <div v-else class="bottom clearfix" style="margin-left: 30px;">
                  <el-button
                    type="text"
                    class="button"
                    @click="handleChangeClassInfoEdit(index, true)"
                  >编辑</el-button>
                  <el-button type="text" class="button" @click="handleDelClassInfo(index)">删除</el-button>
                </div>
              </div>
            </el-card>
          </el-form-item>

          <!-- 课程亮点 -->
          <el-form-item label="课程亮点">
            <el-card :body-style="{ padding: '20px' }">
              <div>
                <el-form>
                  <el-form-item>
                    <el-input
                      v-model="course_highlight.text"
                      type="textarea"
                      :rows="5"
                      placeholder="请描述课程亮点"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="overflow: hidden;">
                    <el-upload
                      style="float: left;"
                      class="avatar-uploader"
                      :show-file-list="false"
                      name="media"
                      :data="{merchants_id: mid}"
                      :before-upload="beforeAvatarUploadHighlight"
                      action="http://192.168.202.190:8081/openApi/media_upload"
                      :on-error="PicLicenseErrHighlight"
                      :on-success="handlePartSuccessHighlight"
                    >
                      <img
                        v-if="course_highlight.image"
                        :src="course_highlight.image"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <ol
                      style="float: left; width: 300px; font-size: 12px; list-style: decimal; color: #ccc;"
                    >
                      <li style="list-style-type: decimal;">不得恶意攻击诋毁其他商家</li>
                      <li style="list-style-type: decimal;">所填写需为课程亮点内容</li>
                      <li style="list-style-type: decimal;">上传图片/文字不得带有 引导性二维码/联系方式/微信/手机号 等信息</li>
                      <li style="list-style-type: decimal;">不得夸张虚假宣传</li>
                    </ol>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-form-item>

          <!-- 适用对象 -->
          <el-form-item label="适用对象">
            <el-card :body-style="{ padding: '20px' }">
              <div>
                <el-form>
                  <el-form-item>
                    <el-input
                      v-model="course_audience_type.text"
                      type="textarea"
                      :rows="5"
                      placeholder="请描述适用对象"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="overflow: hidden;">
                    <el-upload
                      style="float: left;"
                      class="avatar-uploader"
                      :show-file-list="false"
                      name="media"
                      :before-upload="beforeAvatarUploadAudience"
                      :data="{merchants_id: mid}"
                      action="http://192.168.202.190:8081/openApi/media_upload"
                      :on-error="PicLicenseErrAudience"
                      :on-success="handlePartSuccessAudience"
                    >
                      <img
                        v-if="course_audience_type.image"
                        :src="course_audience_type.image"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <ol
                      style="float: left; width: 300px; font-size: 12px; list-style: decimal; color: #ccc;"
                    >
                      <li style="list-style-type: decimal;">不得恶意攻击诋毁其他商家</li>
                      <li style="list-style-type: decimal;">所填写需为适用对象内容</li>
                      <li style="list-style-type: decimal;">上传图片/文字不得带有 引导性二维码/联系方式/微信/手机号 等信息</li>
                      <li style="list-style-type: decimal;">不得夸张虚假宣传</li>
                    </ol>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-form-item>

          <!-- 学习目标 -->
          <el-form-item label="学习目标">
            <el-card :body-style="{ padding: '20px' }">
              <div>
                <el-form>
                  <el-form-item>
                    <el-input
                      v-model="course_objective.text"
                      type="textarea"
                      :rows="5"
                      placeholder="请描述学习目标"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="overflow: hidden;">
                    <el-upload
                      style="float: left;"
                      class="avatar-uploader"
                      :show-file-list="false"
                      name="media"
                      :before-upload="beforeAvatarUploadObjective"
                      :data="{merchants_id: mid}"
                      action="http://192.168.202.190:8081/openApi/media_upload"
                      :on-error="PicLicenseErrObjective"
                      :on-success="handlePartSuccessObjective"
                    >
                      <img
                        v-if="course_objective.image"
                        :src="course_objective.image"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <ol
                      style="float: left; width: 300px; font-size: 12px; list-style: decimal; color: #ccc;"
                    >
                      <li style="list-style-type: decimal;">不得恶意攻击诋毁其他商家</li>
                      <li style="list-style-type: decimal;">所填写需为学习目标内容</li>
                      <li style="list-style-type: decimal;">上传图片/文字不得带有 引导性二维码/联系方式/微信/手机号 等信息</li>
                      <li style="list-style-type: decimal;">不得夸张虚假宣传</li>
                    </ol>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-form-item>

          <!-- 课程内容 -->
          <el-form-item :required="true" label="课程内容">
            <el-card :body-style="{ padding: '20px' }">
              <div>
                <el-form>
                  <el-form-item>
                    <el-input
                      v-model="course_course_content.text"
                      type="textarea"
                      :rows="5"
                      placeholder="请描述课程内容"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="overflow: hidden;">
                    <el-upload
                      style="float: left;"
                      class="avatar-uploader"
                      :show-file-list="false"
                      name="media"
                      :before-upload="beforeAvatarUploadContent"
                      :data="{merchants_id: mid}"
                      action="http://192.168.202.190:8081/openApi/media_upload"
                      :on-error="PicLicenseErrContent"
                      :on-success="handlePartSuccessContent"
                    >
                      <img
                        v-if="course_course_content.image"
                        :src="course_course_content.image"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <ol
                      style="float: left; width: 300px; font-size: 12px; list-style: decimal; color: #ccc;"
                    >
                      <li style="list-style-type: decimal;">不得恶意攻击诋毁其他商家</li>
                      <li style="list-style-type: decimal;">所填写需为课程内容</li>
                      <li style="list-style-type: decimal;">上传图片/文字不得带有 引导性二维码/联系方式/微信/手机号 等信息</li>
                      <li style="list-style-type: decimal;">不得夸张虚假宣传</li>
                    </ol>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-form-item>

          <!-- 最后提交信息 -->
          <el-form-item>
            <el-button @click.native.prevent="handleCourseSure">确定</el-button>
            <!-- <el-button @click.native.prevent="handleCourseReset">取消</el-button> -->
            <el-button @click.native.prevent="handleBackToList">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="预约电话" name="30001" align-center>
        <el-form label-width="110px" style="margin:20px;width:60%;min-width:600px;">
          <el-card style="width:500px">
            <el-form-item label="店铺列表">
              <el-select v-model="shop_id" placeholder="请选择">
                <el-option
                  v-for="item in shopListData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input style="width:220px" type="text" v-model="subscribePhone"></el-input>
            </el-form-item>
            <el-form-item style="padding-left:30px">
              <el-button type="info" @click.native.prevent="handlePostOrderPhone">确定</el-button>
              <el-button @click.native.prevent="handleBackToList">取消</el-button>
            </el-form-item>
          </el-card>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="咨询电话" name="30002" align-center>
        <el-form label-width="110px" style="margin:20px;width:60%;min-width:600px;">
          <el-card style="width:500px">
            <el-form-item label="店铺列表">
              <el-select v-model="shop_id" placeholder="请选择">
                <el-option
                  v-for="item in shopListData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咨询电话">
              <el-input style="width:220px" type="text" v-model="tabFive_subPhone"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input style="width:220px" type="text" v-model="tabFive_adrsPhone"></el-input>
            </el-form-item>
            <el-form-item style="padding-left:30px">
              <el-button type="info" @click.native.prevent="handlePostAdresPhone">确定</el-button>
              <el-button @click.native.prevent="handleBackToList">取消</el-button>
            </el-form-item>
          </el-card>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { createPart, checkShopState,UpLoadMedia } from "../../api/api.js";
import qs from "qs";
import categoryjson from "../../common/js/Category.js";
import utils from "../../common/js/util.js";

export default {
  data() {
    return {
      tabFive_adrsPhone: "",
      tabFive_subPhone: "",
      subscribePhone: "",
      editAble: true,
      mid: sessionStorage.getItem("merchantsId"),
      auActive: true,
      shopListData: [],
      course_content: {
        content_type: "",
        text: "",
        image: ""
      },
      objective: {
        content_type: "",
        text: "",
        image: ""
      },
      audience_type: {
        content_type: "",
        text: "",
        image: ""
      },
      highlight: {
        content_type: "",
        text: "",
        image: ""
      },
      headerImg: "",
      categoryjson: categoryjson,
      light_high_type: [
        {
          value: "text",
          label: "文字"
        },
        {
          value: "image",
          label: "图片"
        }
      ],
      light_high_text: "",
      shopList: "",
      shop_id: "",
      course_options: [
        {
          value: "1对1",
          label: "1对1"
        },
        {
          value: "10人以下",
          label: "10人以下"
        },
        {
          value: "11-20人",
          label: "11-20人"
        },
        {
          value: "20人以上",
          label: "20人以上"
        }
      ],
      level: "",
      experience_info: "",
      tags: [],
      course_mode: [],
      minPrice: "",
      maxPrice: "",
      lessontype: "",
      discusstime: "",
      discusscontent: "",
      rate: 5,
      attendee_capacity: "",
      options: [
        {
          value: "value1",
          label: "label1"
        },
        {
          value: "value2",
          label: "label2"
        }
      ],
      activeName: sessionStorage.getItem("material_type"),
      imageUrl: "",
      form: {
        images: [],
        avatar: "",
        name: "",
        time: "",
        text: "",
        score: 5
      },
      dialogImageUrl: "",
      dialogVisible: false,
      course: {
        name: "",
        category: [],
        minprice: 0.0,
        maxprice: 0.0,
        type: "正式课",
        course_mode: [],
        tags: [],
        experience_info: "是",
        level: "",
        attendee_capacity: "",
        images: [],
        classinfo: [],
        highlight: [],
        audience_type: [],
        objective: [],
        course_content: []
      },
      course_images: "",
      course_class_name: "",
      course_class_time: "",
      course_start_time: "",
      course_lesson_count: 0,
      course_highlight: {
        text: "",
        image: ""
      },
      course_audience_type: {
        text: "",
        image: ""
      },
      course_objective: {
        text: "",
        image: ""
      },
      course_course_content: {
        text: "",
        image: ""
      },
      categorycategorychoose: []
    };
  },
  computed: {
    headers() {
      return {
        ContentType: "multipart/form-data"
      };
    }
  },
  created() {
    let material_data = JSON.parse(sessionStorage.getItem("material_data"));
    let material_type = sessionStorage.getItem("material_type");
  },
  methods: {
    handlePostAdresPhone() {
      let params = {
        name: "咨询电话",
        phone_list: [
          {
            phone: this.tabFive_subPhone,
            score: 0
          }
        ],
        desc: "咨询电话",
        bind_object_id: this.shop_id,
        callback_tel: this.tabFive_AdrsPhone
      };
      createPart(qs.stringify(params)).then(res => {
        console.log(res);
        this.$router.push({ path: "/addPartsList" });
      });
    },
    handlePostOrderPhone() {
      let params = {
        name: "预约电话",
        desc: "预约电话",
        bind_object_id: this.shop_id,
        callback_tel: this.subscribePhone
      };
      createPart(qs.stringify(params)).then(res => {
        console.log(res);
        this.$router.push({ path: "/addPartsList" });
      });
    },
    beforeAvatarUploadContent() {
      return true;
    },
    PicLicenseErrContent(err) {
      this.$message.error(err);
    },
    handlePartSuccessContent(res, file) {
      let { data } = res;
      this.course_course_content.image = data;
    },

    beforeAvatarUploadObjective() {
      return true;
    },
    PicLicenseErrObjective(err) {
      this.$message.error(err);
    },
    handlePartSuccessObjective(res, file) {
      let { data } = res;
      this.course_objective.image = data;
    },

    beforeAvatarUploadAudience() {
      return true;
    },
    PicLicenseErrAudience(err) {
      this.$message.error(err);
    },
    handlePartSuccessAudience(res, file) {
      let { data } = res;
      this.course_audience_type.image = data;
    },

    beforeAvatarUploadHighlight() {
      return true;
    },
    PicLicenseErrHighlight(err) {
      this.$message.error(err);
    },
    handlePartSuccessHighlight(res, file) {
      let { data } = res;
      this.course_highlight.image = data;
    },

    handleAddClassInfo() {
      let classinfo = this.course.classinfo;
      let res = classinfo.filter(item => {
        return item.editAble;
      });
      if (res.length) {
        this.$message.warning("当前有正在编辑项");
        return;
      }
      this.course.classinfo.unshift({
        class_name: "",
        class_time: "",
        start_time: "",
        lesson_count: 0,
        editAble: true
      });
    },
    handleSaveClassInfoEdit(index) {
      if (
        !this.course_class_name ||
        !this.course_class_time ||
        !this.course_start_time
      ) {
        this.$message.error("请输入必填项");
        return;
      }
      this.course.classinfo.splice(index, 1, {
        class_name: this.course_class_name,
        class_time: this.course_class_time,
        start_time: this.course_start_time,
        lesson_count: this.course_lesson_count,
        editAble: false
      });
      this.course_class_name = "";
      this.course_class_time = "";
      this.course_start_time = "";
      this.course_lesson_count = 0;
    },
    handleDelClassInfo(index) {
      this.course.classinfo.splice(index, 1);
    },
    handleChangeClassInfoEdit(index, status) {
      if (status) {
        let res = this.course.classinfo.filter(item => {
          return item.editAble;
        });
        if (res.length) {
          this.$message.warning("当前有正在编辑项");
          return;
        }
        let {
          class_name,
          class_time,
          start_time,
          lesson_count
        } = this.course.classinfo[index];
        this.course_class_name = class_name;
        this.course_class_time = class_time;
        this.course_start_time = start_time;
        this.course_lesson_count = lesson_count;
        this.course.classinfo[index].editAble = true;
      } else {
        let {
          class_name,
          class_time,
          start_time,
          lesson_count
        } = this.course.classinfo[index];
        if (!class_name && !class_time && !start_time) {
          this.course.classinfo.splice(index, 1);
          this.course_class_name = "";
          this.course_class_time = "";
          this.course_start_time = "";
          this.course_lesson_count = 0;
        } else {
          this.course.classinfo[index].editAble = false;
        }
      }
    },
    handleCheckMinPrice(val, type) {
      if (this.course[type] < 0 || this.course[type] === "") {
        this.course[type] = 0;
      } else if (isNaN(this.course[type])) {
        this.course[type] = 0;
      }
    },
    beforeAvatarUploadCourse() {
      return true;
    },
    PicLicenseErrCourse(err) {
      this.$message.error(err);
    },
    handlePartSuccessCourse(res, file) {
      let { data } = res;
      this.course_images = data;
    },
    handleDelCurseCategory(index) {
      this.course.category.splice(index, 1);
      if (this.course.category.length === 0) {
        this.categorycategorychoose = [];
      }
    },
    handleChangeCurseCategory(val) {
      let category = val.join("·");
      if (!utils.findInArr(this.course.category, category)) {
        this.course.category.push(category);
      }
    },
    handleCourseSure() {
      this.course.category = this.course.category.map(item => {
        item = item.replace(/·/g, "_");
        return item;
      });
      this.course.images = [this.course_images];
      let minprice = Number(this.course.minprice);
      this.course.minprice = isNaN(minprice) ? 0 : minprice;
      let maxprice = Number(this.course.maxprice);
      this.course.maxprice = isNaN(maxprice) ? 0 : maxprice;
      if (this.course.maxprice < this.course.minprice) {
        this.$message.error("课程最高价不能小于课程最低价");
        return;
      }
      this.course.highlight = this.fnCoverData(this.course_highlight);
      this.course.audience_type = this.fnCoverData(this.course_audience_type);
      this.course.objective = this.fnCoverData(this.course_objective);
      this.course.course_content = this.fnCoverData(this.course_course_content);
      let course = Object.assign({}, this.course);
      if (course.course_content.length === 0) {
        this.$message.error("请填写必填项");
        return;
      }
      course.category = course.category;
      course.images = course.images;
      course.course_mode = course.course_mode;
      course.tags = course.tags;
      course.classinfo = course.classinfo.map(item => {
        let lesson_count = parseInt(item.lesson_count);
        item.lesson_count = isNaN(lesson_count) ? 0 : lesson_count;
        return item;
      });
      course.highlight = course.highlight;
      course.audience_type = course.audience_type;
      course.objective = course.objective;
      course.course_content = course.course_content;
      let mid = sessionStorage
        .getItem("merchantsId")
        .match(/\d+/g)
        .join();
      let params = {
        merchants_id: mid,
        shop_id: "",
        material_type: this.activeName,
        material_content: JSON.stringify(course)
      };
      console.log(JSON.stringify(params));
      createPart(qs.stringify(params)).then(res => {
        console.log(res);
      });
    },
    handleCourseReset() {
      this.course = {
        name: "",
        category: [],
        minprice: 0.0,
        maxprice: 0.0,
        type: "正式课",
        course_mode: [],
        tags: [],
        experience_info: "是",
        level: "",
        attendee_capacity: "",
        images: "",
        classinfo: [],
        highlight: [],
        audience_type: [],
        objective: [],
        course_content: []
      };
      this.course_class_name = "";
      this.course_class_time = "";
      this.course_start_time = "";
      this.course_lesson_count = 0;
      this.course_highlight = {
        text: "",
        image: ""
      };
      this.course_audience_type = {
        text: "",
        image: ""
      };
      this.course_objective = {
        text: "",
        image: ""
      };
      this.course_course_content = {
        text: "",
        image: ""
      };
      this.categorycategorychoose.splice(0, this.categorycategorychoose.length);
    },
    fnCoverData(data) {
      if (!data.text && !data.image) {
        return [];
      }
      let aData = [];
      if (data.text) {
        aData.push({
          content_type: "text",
          text: data.text
        });
      }
      if (data.image) {
        aData.push({
          content_type: "image",
          image: data.image
        });
      }
      return aData;
    },
    editCourse() {},
    addCourse() {},
    saveObjective() {},
    editObjective() {},
    addObjective() {},
    editAudience() {},
    saveAudience() {},
    addCourseImgAdress(res, file) {
      this.course_content.image = res.data;
    },
    audienceImgAdress(res, file) {
      this.audience_type.image = res.data;
    },
    addAudienceTpye() {},
    saveHigLightImg() {
      //
    },
    addHightLight() {},
    picLesson() {},
    saveClassInfo() {},
    editClassInfo() {},
    picLessonHeaderImg(res, file) {
      this.headerImg = res.data;
    },
    handleMsgSure() {
      let mid = sessionStorage.getItem("merchantsId");
      let oDate = this.form.time;
      if (oDate) {
        this.form.time = `${oDate.getFullYear()}-${utils.toDou(
          oDate.getMonth() + 1
        )}-${utils.toDou(oDate.getDate())}T${utils.toDou(
          oDate.getHours()
        )}:${utils.toDou(oDate.getMinutes())}:${utils.toDou(
          oDate.getSeconds()
        )}`;
      }
      if (
        !this.form.time ||
        !this.form.name ||
        !this.form.text ||
        !this.form.score ||
        !this.shop_id
      ) {
        this.$message({
          message: "请填写标*必填项",
          type: "warning"
        });
        return;
      }
      let params = {
        merchants_id: mid,
        shop_id: this.shop_id,
        material_type: this.activeName,
        material_content: JSON.stringify(this.form)
      };
      createPart(qs.stringify(params)).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push({ path: "/addPartsList" });
      });
    },
    handleMsgReset() {},
    beforeAvatarUpload(file) {
      return true;
    },
    handlePartSuccess(res, file) {
      let { data } = res;
      if (this.activeName === "10007") {
        if (typeof this.form.images === "string") {
          this.form.images = [];
        }
        this.form.images.push(data);
      } else if (this.activeName === "10006") {
        this.form.avatar = res.data;
      }
    },
    handleHighLightImgSuccess(res, file) {
      this.highlight.image = res.data;
    },
    PicLicenseErr(err, file, fileList) {
      console.log(err);
    },
    handleSubmitImg() {
      let mid = sessionStorage
        .getItem("merchantsId")
        .match(/\d+/g)
        .join();
      let shop_id = "";
      let params = {
        merchants_id: mid,
        shop_id,
        material_type: this.activeName,
        material_content: JSON.stringify(this.form)
      };
      if (this.form.images.length < 3) {
        this.$message({
          message: "至少提供三张店铺实景图",
          type: "warning"
        });
        return;
      }
      createPart(qs.stringify(params)).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push({ path: "/addPartsList" });
      });
      // let str = sessionStorage
      //   .getItem("merchantsId")
      //   .match(/\d+/g)
      //   .join();
      // let littleJson = { images: this.form.images };
      // let params = {
      //   merchants_id: str,
      //   shop_id: "77079236920110",
      //   material_type: this.activeName,
      //   material_content: JSON.stringify(littleJson)
      // };
      // params = qs.stringify(params);
      // createPart(params).then(data => {
      //   if (data.unique_key !== "") {
      //     this.$message({
      //       message: "创建成功",
      //       type: "success"
      //     });
      //   }
      // });
    },
    objectiveImgAdress(res, file) {
      this.objective.image = res.data;
    },
    handleBackToList() {
      this.$router.push({ path: "/addPartsList" });
    },
    handleSubmitedInfo() {
      this.$router.push({ path: "/submitedInfo" });
    },
    handleClick(tab, event) {
      if (tab.name === "10006" || tab.name === "30002") {
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
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {}
  }
};
</script>

<style lang="scss" scope>
.width_limit {
  min-width: 109px;
}
.el-form .el-form-item {
  position: relative;
  margin: 10px 0;
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
.desc_span {
  font-size: 12px;
  color: #ccc;
}
li {
  list-style-type: none;
}
.upload_rule {
  position: absolute;
  top: 150px;
  left: 190px;
  font-size: 12px;
  color: #ccc;
  line-height: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>