import axios from 'axios';
import qs from 'qs'
// import da from "element-ui/src/locale/lang/da";
// import manage from './manage.js'
// axios.defaults.baseURL = manage.apiHost;
// import { getToken,clear } from '@/utils/auth'
axios.defaults.timeout = 60 * 1000 * 10;
// axios.defaults.cache = false




// console.log("当前环境",process.env.NODE_ENV);

// /*第一层if判断生产环境和开发环境*/
// if (process.env.NODE_ENV === 'production') {
//     /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
//     if (process.env.VUE_APP_FLAG === 'pro') {
//         //production 生产环境
//         axios.defaults.baseURL = 'http://127.0.0.1:8080';
//     } else {
//         //test 测试环境
//         axios.defaults.baseURL = 'http://127.0.0.1:8080';
//     }
// } else {
//     //dev 开发环境
//     // axios.defaults.baseURL = 'http://127.0.0.1:8080';
// }
//
// let baseUrl = axios.defaults.baseURL;
//
// console.log("当前host：", baseUrl);

axios.interceptors.request.use(
    config => {
        // config.headers['X-Requested-With'] = 'XMLHttpRequest'
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        // config.headers['Content-Type'] = 'application/json; charset=UTF-8';
        // config.data = qs.stringify(manage.data)
        // config.headers['Content-Type'] = 'application/json; charset=UTF-8';
        // config.headers['Authorization'] = getToken() ? getToken() : null;
        // manage.headers['X-CSRFToken'] = sessionStorage.getItem('csrftoken');
        // config.headers['Cookie'] = 'Hm_lvt_b0668f30d62e1597bdb36d05edea8960=1604221499,1604560772,1604655241; Hm_lpvt_b0668f30d62e1597bdb36d05edea8960=1604911501; sid=f2295ce4-5905-47d2-b119-9747e7749674';
        return config;
    },
    error => {
        return Promise.reject(error);

    }
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

function checkStatus(response) {
    if (response.status === 200 || response.status === 304) {
        return response['data'];
    } else {
        throw new Error(response.data.message); // eslint-disable-line
    }
    throw new Error(response.statusText); // eslint-disable-line
}

export function request(config) {
    return axios.request(config).then(checkStatus);
}

export function get(url, params) {
    // let queryData = Object.assign(params, {t: new Date().getTime()})
    return axios.get(url, {params}).then(checkStatus);
}

export function delet(url, params) {
    return axios.delete(url, params).then(checkStatus);
}

export function post(url, data, config) {
    return axios.post(url, qs.stringify(data), config).then(checkStatus);
}

export function postDefine(url, data, config) {
    return axios.post(url, data, config).then(checkStatus);
}

export function postData(url, data, config) {
    return axios.post(url, data, config).then(checkStatus);
}

export function put(url, data, config) {
    return axios.put(url, data, config).then(checkStatus);
}

export function patch(url, data, config) {
    return axios.patch(url, data, config).then(checkStatus);
}
