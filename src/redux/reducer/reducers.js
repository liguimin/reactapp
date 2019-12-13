import {combineReducers} from 'redux';

import {
    SET_PERMISSION,
    SET_MENU_TAB_COMPONENTS,
    SHOW_ROUTE_LOADING_LINE,
    HIDE_ROUTE_LOADING_LINE,
    SET_ROUTE_LOADING_LINE_PERCENT,
    SET_ROUTE_START,
    SET_ROUTE_COMPLETE
} from '../action/actionTypes';

//权限reducer
const permissionReducer=(state={permissions:[]},action)=>{
    switch (action.type){
        case SET_PERMISSION://设置权限
            return {...state,permissions:action.permissions};
        default:
            return state;
    }
};

//设置后台菜单TABreducer
const menuTabComponentReducer=(state={components:[]},action)=>{
    switch (action.type){
        case SET_MENU_TAB_COMPONENTS:
            return {...state,components:action.component};
        default:
            return state;
    }
};

//设置路由加载状态
const routeReducer=(state={percent:0,complete:false,showLoadingLine:false},action)=>{
    switch (action.type){
        case SHOW_ROUTE_LOADING_LINE:
            return {...state,showLoadingLine:true};
        case HIDE_ROUTE_LOADING_LINE:
            return {...state,showLoadingLine:false};
        case SET_ROUTE_LOADING_LINE_PERCENT:
            return {...state,percent:action.percent};
        case SET_ROUTE_START:
            return {...state,complete:false};
        case SET_ROUTE_COMPLETE:
            return {...state,complete:true};
        default:
            return state;
    }
};


export default combineReducers({
    permissionReducer,
    menuTabComponentReducer,
    routeReducer
})


