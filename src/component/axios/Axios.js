/**
 * Created by Administrator on 2019/5/18.
 */
import axios from 'axios';
import {message,Modal} from 'antd';

import store from '../../util/store';
import {isFunction} from '../../util/Fuc';
import {apiBaseUrl} from '../../config/app';

const baseURL = apiBaseUrl;
const timeout = 30000;
let modal=false;
let loadingMessage=false;

//请求拦截默认方法
function reqHandle(config, msg) {
    if(msg!==false){
        loadingMessage = message.loading(msg, 5);
    }
    const token = store.get('token');
    token && (config.headers.Authorization = 'Bearer '+token);
    return config;
}

//请求错误默认方法
function reqErrorHandle(error) {
    if (loadingMessage){
        loadingMessage();
    }
    if (modal!==false){
        modal.destroy();
    }
    modal=Modal.error({
        title: '请求错误',
        content: '请求失败！',
    });
    return Promise.reject(error);
}

//响应成功默认方法
function resHandle(response) {
    if (loadingMessage){
        loadingMessage();
    }
    return response.data;
}

//响应失败处理默认方法
function resErrorHandle(error) {
    try {
        const status=error.response.status;
        const data=error.response.data;
        let msg='msg' in data?data.msg:'未知错误';
        switch (status){
            case 401://鉴权失败
                store.delete('token');//删除token
                window.location.href = '/login';
                break;
            case 404://资源未找到
                msg='接口地址不存在！';
                break;
        }
        if (loadingMessage){
            loadingMessage();
        }
        if (modal!==false){
            modal.destroy();
        }
        if (status!==401){
            modal=Modal.error({
                title: '错误信息',
                content: msg,
            });
        }

        return Promise.reject(error);
    }catch (err){
        console.log(err);
        window.location.href = '/page_500';
    }
}

//axios实例方法
function Axios({
    msg=false,
    reqFuc={},
    reqErrFuc={},
    resFuc={},
    resErrFuc={},
    ...axiosConfig
    }={}) {

    let re_config = {
        baseURL: baseURL,
        timeout: timeout,
    };
    let config = Object.assign(re_config, axiosConfig);
    let instance = axios.create(config);

    //请求拦截方法注册
    var reqHandleFuc = isFunction(reqFuc) ? reqFuc : reqHandle;//请求拦截方法
    var reqErrHandleFuc = isFunction(reqErrFuc) ? reqErrFuc : reqErrorHandle;//请求错误方法
    instance.interceptors.request.use(function (config) {
        return reqHandleFuc(config, msg);
    }, function (error) {
        return reqErrHandleFuc(error);
    });

    //响应拦截方法注册
    var resHandleFuc = isFunction(resFuc) ? resFuc : resHandle;
    var resErrHandleFuc = isFunction(resErrFuc) ? resErrFuc : resErrorHandle;
    instance.interceptors.response.use(function (response) {
        return resHandleFuc(response);
    }, function (error) {
        return resErrHandleFuc(error)
    });


    if ('url' in axiosConfig) {//如果传入了url,则直接发起请求
        return instance.request(axiosConfig);
    } else {
        return instance;
    }
}


Axios.get = function (url, {...config}={}) {
    return Axios({
        method: 'get',
        url: url,
        ...config
    });
}

Axios.post = function (url, {...config}={}) {
    return Axios({
        method: 'post',
        url: url,
        ...config
    });
}

Axios.delete = function (url, {...config}={}) {
    return Axios({
        method: 'delete',
        url: url,
        ...config
    });
}

Axios.put = function (url, {...config}={}) {
    return Axios({
        method: 'put',
        url: url,
        ...config
    });
}

Axios.patch = function (url, {...config}={}) {
    return Axios({
        method: 'patch',
        url: url,
        ...config
    });
}

export default Axios;