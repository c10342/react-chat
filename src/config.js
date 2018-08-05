import axios from 'axios';

import {Toast} from 'antd-mobile';

// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 发送请求时显示提示框
    Toast.loading('加载中',0);
    return config;
});
// 响应拦截器
axios.interceptors.response.use(function (config) {
    // 服务器响应数据回来时销毁提示框
    Toast.hide();
    return config;
});