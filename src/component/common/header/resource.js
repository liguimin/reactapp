/**
 * Created by Administrator on 2019/10/25.
 */
//类型
const TYPES = {
    API: '1',//api
    ROUTE: '2',//路由
    BTN: '3',//按钮
    FIELD: '4'//字段
};
const TYPE_NAMES = {
    [TYPES.API]: 'API',
    [TYPES.ROUTE]: '路由',
    [TYPES.BTN]: '按钮',
    [TYPES.FIELD]: '字段'
};


//请求方法
const METHODS = {
    GET: '1',
    POST: '2',
    PUT: '3',
    PATCH: '4',
    DELETE: '5'
};
const METHOD_NAMES = {
    [METHODS.GET]: 'GET',
    [METHODS.POST]: 'POST',
    [METHODS.PUT]: 'PUT',
    [METHODS.PATCH]: 'PATCH',
    [METHODS.DELETE]: 'DELETE'
};


//是否共有资源
const IS_PUBLIC = {
    NO: '0',
    YES: '1'
};
const IS_PUBLIC_NAMES = {
    [IS_PUBLIC.NO]: '私有资源',
    [IS_PUBLIC.YES]: '共有资源'
};


export {
    TYPES,
    TYPE_NAMES,
    METHODS,
    METHOD_NAMES,
    IS_PUBLIC,
    IS_PUBLIC_NAMES
}



