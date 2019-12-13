import axios from "axios";

let baseURL = "";
//重要图片上传
export const mediaUpload=`${baseURL}/openApi/media_upload`;
export const accountUpload=`${baseURL}/openApi/account_upload`;

export const requestLogin = params => {
  return axios
    .get(`${baseURL}/account/login`, { params: params })
    .then(res => res.data);
};

export const requestRegister = params => {
  return axios
    .get(`${baseURL}/account/register`, { params: params })
    .then(res => res.data);
};

export const createMerchants = params => {
  return axios
    .post(`${baseURL}/openApi/edu_merchants_create`, params)
    .then(res => res.data);
};
//查看商户审核状态，根据状态判断是否创建店铺
export const checkMerchantState = params => {
  return axios.post(`${baseURL}/openApi/merchants_view`, params);
};

export const reSubmitMerchant = params => {
  return axios.post(`${baseURL}/openApi/merchants_update`, params);
};

export const getMerchantsInfo = params => {
  return axios
    .get(`${baseURL}/openApi/getMerchantsInfo`, { params: params })
    .then(res => res.data);
};
//查询商户审核状态，确定是否创建店铺
export const shopStatus = params => {
  return axios
    .get(`${baseURL}/openApi/shop_view`, {params:params})
    .then(res => res.data);
};
//创建店铺
export const shopCreate = params => {
  return axios
    .post(`${baseURL}/openApi/shop_create`, params)
    .then(res => res.data);
};



export const shopUpdate = params => {
  return axios
    .post(`${baseURL}/openApi/shop_update`, params)
    .then(res => res.data);
};
//查看店铺list
export const checkShopState = params => {
  return axios
    .post(`${baseURL}/openApi/shop_id_list`, params)
    .then(res => res.data);
};
//短信验证码
export const phoneCode = params => {
  return axios
    .get(`${baseURL}/sms/sendMessage`, { params: params })
    .then(res => res.data);
};
//创建图片物件 type:10007 10005 10006 30001 30002
export const createPart = params => {
  return axios.post(`${baseURL}/openApi/material_add`, params);
};
//为物料建立发布关系
export const buildMaterialPublish=params=>{
  return axios.post(`${baseURL}/openApi/material_publish`,params);
}

export const queryMaterial = params => {
  return axios
    .post(`${baseURL}/openApi/material_get`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => res.data);
};

export const deleteMaterial = params => {
  return axios
    .post(`${baseURL}/openApi/material_delete`, params)
    .then(res => res.data);
};

export const unpublishMaterial = params => {
  return axios
    .post(`${baseURL}/openApi/material_unpublish`, params)
    .then(res => res.data);
};
