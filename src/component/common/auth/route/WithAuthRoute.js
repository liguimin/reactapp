/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import {connect} from 'react-redux';
import findIndex from 'lodash/findIndex';
import {Redirect} from 'react-router-dom';
import {Spin} from 'antd';
import {
    setMenuTabComponent,
    showRouteLoadingLine,
    hideRouteLoadingLine,
    setRouteLoadingLinePercent,
    setRouteStart,
    setRouteComplete,
    setPermission
} from '../../../../redux/action/actions';
import Axios from '../../../axios/Axios';
import store from '../../../../util/store';
import Page_403 from '../../../error/Page_403';

const WithAuthRoute = (Component)=> {
    class WrapComponent extends React.Component {
        constructor() {
            super();

            this.state = {
                isLogin: store.get('token') ? true : false,
                hasPermission: false,
                loading: true
            };
        }

        componentDidMount = ()=> {
            this.init(this.props.path);
        };


        //当路由改变或首次加载组件时的公用方法
        init = (path)=> {
            this.props.showRouteLoadingLine();

            //检查登录状态
            const {isLogin}=this.state;
            if (isLogin) {
                this.props.setRouteLoadingLinePercent(30);
            } else {
                this.props.setRouteLoadingLinePercent(100);
                return;
            }

            //检查是否有权限访问该路由
            const {permissions}=this.props;

            if (Object.keys(permissions).length > 0) {//redux中存储有权限列表，直接从中判断
                this.props.setRouteLoadingLinePercent(100);
                let states = {loading: false};
                if (this.checkRoute(permissions.routePermissions, path) > -1) {//权限存在，设置为有权访问
                    states.hasPermission = true;
                }
                this.setState(states, ()=> {
                    this.props.setRouteComplete();
                });
                setTimeout(()=> {
                    this.props.hideRouteLoadingLine();
                }, 200)

            } else {//不存在，则取服务器数据
                Axios.get('/v1/permission/userPermission').then((ret)=> {
                    this.props.setRouteLoadingLinePercent(100);
                    let states = {loading: false};
                    if (this.checkRoute(ret.data.permissions.routePermissions, path) > -1) {//权限存在，设置为有权访问
                        states.hasPermission = true;
                    }

                    this.setState(states, ()=> {
                        this.props.setRouteComplete();
                    });
                    setTimeout(()=> {
                        this.props.hideRouteLoadingLine();
                    }, 200);


                    this.props.setPermission(ret.data.permissions);
                });
            }

        };

        //检查路由权限是否存在
        checkRoute = (routePermissions, path)=> {
            return findIndex(routePermissions, (item)=> {
                return item.identify === path;
            });
        };

        render = ()=> {
            const {isLogin,loading}=this.state;
            const {
                setMenuTabComponent,
                showRouteLoadingLine,
                hideRouteLoadingLine,
                setRouteLoadingLinePercent,
                setRouteStart,
                setRouteComplete,
                setPermission,
                permissions,
                ...props
                }=this.props;

            const spinStyle = {
                textAlign: 'center',
                padding: '80px'
            };

            if (isLogin) {
                if (loading) {
                    return <div style={spinStyle}><Spin size="large"/></div>;
                } else {
                    if (this.state.hasPermission) {
                        return <Component {...props}/>;
                    } else {
                        return <Page_403/>;
                    }
                }
            } else {
                return <Redirect to="/login"/>
            }
        }
    }

    const mapStateToProps = (state)=> {
        return {
            permissions: state.permissionReducer.permissions,
            routeComplete: state.routeReducer.complete
        }
    };

    return connect(mapStateToProps, {
        setMenuTabComponent,
        showRouteLoadingLine,
        hideRouteLoadingLine,
        setRouteLoadingLinePercent,
        setRouteStart,
        setRouteComplete,
        setPermission
    })(WrapComponent);
};

export default WithAuthRoute;