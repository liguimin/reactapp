/**
 * Created by Administrator on 2019/5/9.
 */
import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import store from '../../util/store';
import findIndex from 'lodash/findIndex';
import Axios from '../axios/Axios';
import { Spin } from 'antd';
import { AliveScope,KeepAlive } from 'react-activation';
import {
    setMenuTabComponent,
    showRouteLoadingLine,
    hideRouteLoadingLine,
    setRouteLoadingLinePercent,
    setRouteStart,
    setRouteComplete,
    setPermission
} from '../../redux/action/actions';

//没有权限访问的提示组件
const PermissionDeniedComponent = ()=> {
    return (
        <div>
            没有权限
        </div>
    );
};

class PrivateRoute extends React.Component {
    constructor() {
        super();
        this.state = {
            isLogin: store.get('token') ? true : false,
            hasPermission: false,

            routeList:[],
        };
    }

    componentDidMount = ()=> {
        const {routeList}=this.state;
        routeList.push(this.props.location.pathname);
        this.setState({
            routeList:routeList
        });
        this.init(this.props.location.pathname);
    };

    componentWillReceiveProps = (nextProps)=> {
        if (nextProps.location.pathname != this.props.location.pathname) {
            const {routeList}=this.state;
            const {permissions,location}=this.props;
            const index=findIndex(routeList, (item)=> {
                return item.identify === location.pathname;
            });
            if (index==-1){
                routeList.push(this.props.location.pathname);
                this.setState({
                    routeList:routeList
                });
                console.log(routeList);
            }
            this.props.setRouteStart();
        }

        if (nextProps.routeComplete != this.props.routeComplete && nextProps.routeComplete === false) {
            this.init(nextProps.location.pathname);
        }
    };


    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.routeComplete != this.props.routeComplete && nextProps.routeComplete === true) {
            return true;
        } else {
            return false;
        }
    }


    //当路由改变或首次加载组件时的公用方法
    init = (pathname)=> {
        console.log(12121212);
        this.props.showRouteLoadingLine();
        this.setState((state, props) => ({
            hasPermission: false
        }), ()=> {
            //检查登录状态
            const {isLogin}=this.state;
            if (isLogin) {
                this.props.setRouteLoadingLinePercent(30);
            } else {
                this.props.setRouteLoadingLinePercent(100);
                return;
            }

            //检查是否有权限访问该路由
            let permissions = this.props.permissions;
            if (Object.keys(permissions).length > 0) {//redux中存储有权限列表，直接从中判断
                this.props.setRouteLoadingLinePercent(100);
                let states = {};
                if (this.checkRoute(permissions.routePermissions, pathname) > -1) {//权限存在，设置为有权访问
                    states.hasPermission = true;
                }
                this.setState(states);
                this.props.setRouteComplete();
                setTimeout(()=> {
                    this.props.hideRouteLoadingLine();
                }, 200)

            } else {//不存在，则取服务器数据
                Axios.get('/v1/permission/userPermission').then((ret)=> {
                    this.props.setRouteLoadingLinePercent(100);
                    let states = {};
                    if (this.checkRoute(ret.data.permissions.routePermissions, pathname) > -1) {//权限存在，设置为有权访问
                        states.hasPermission = true;
                    }

                    this.setState(states);
                    this.props.setRouteComplete();
                    setTimeout(()=> {
                        this.props.hideRouteLoadingLine();
                    }, 200);


                    this.props.setPermission(ret.data.permissions);
                });
            }
        });

    };

    //检查路由权限是否存在
    checkRoute = (routePermissions, pathname)=> {
        return findIndex(routePermissions, (item)=> {
            return item.identify === pathname;
        });
    };


    render() {
        const {
            component:Component,
            routeComplete,
            permissions,
            setMenuTabComponent,
            showRouteLoadingLine,
            hideRouteLoadingLine,
            setRouteLoadingLinePercent,
            setRouteStart,
            setRouteComplete,
            setPermission,
            ...rest
            }=this.props;
        const {isLogin,hasPermission}=this.state;

        const LastComponent = ()=> {
            if (hasPermission) {
                return <Component/>;
            } else {
                return <PermissionDeniedComponent/>;

            }
        };


        const renderFuc = (props)=> {
            if (isLogin) {
                if (hasPermission) {
                    return <Component {...props}/>;
                } else {
                    if (routeComplete) {
                        return <PermissionDeniedComponent/>;
                    } else {
                        return null;
                    }
                }
            } else {
                return <Redirect to="/login"/>;
            }
        };

        return (
            <Route {...rest} render={renderFuc}/>

        );
    }
}

const mapStateToProps = (state)=> {
    return {
        permissions: state.permissionReducer.permissions,
        routeComplete: state.routeReducer.complete
    }
};


export default connect(
    mapStateToProps,
    {
        setMenuTabComponent,
        showRouteLoadingLine,
        hideRouteLoadingLine,
        setRouteLoadingLinePercent,
        setRouteStart,
        setRouteComplete,
        setPermission
    }
)(PrivateRoute) ;