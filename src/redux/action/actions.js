/**
 * Created by Administrator on 2019/10/9.
 */
import {
    SET_PERMISSION,
    SET_MENU_TAB_COMPONENTS,
    SHOW_ROUTE_LOADING_LINE,
    HIDE_ROUTE_LOADING_LINE,
    SET_ROUTE_LOADING_LINE_PERCENT,
    SET_ROUTE_START,
    SET_ROUTE_COMPLETE
} from '../action/actionTypes';

//设置权限
export function setPermission(permissions){
    return{type:SET_PERMISSION,permissions};
}

//设置后台菜单TAB
export function setMenuTabComponent(component){
    return {type:SET_MENU_TAB_COMPONENTS,component}
}

//显示路由加载进度条
export function showRouteLoadingLine(){
    return {type:SHOW_ROUTE_LOADING_LINE}
}

//隐藏路由加载进度条
export function hideRouteLoadingLine(){
    return {type:HIDE_ROUTE_LOADING_LINE}
}

//设置路由加载进度条百分比
export function setRouteLoadingLinePercent(percent){
    return {type:SET_ROUTE_LOADING_LINE_PERCENT,percent}
}

//后台路由加载完毕
export function setRouteStart(){
    return {type:SET_ROUTE_START}
}

//后台路由加载完毕
export function setRouteComplete(){
    return {type:SET_ROUTE_COMPLETE}
}