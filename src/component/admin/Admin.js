/**
 * Created by Administrator on 2019/5/9.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Layout,Menu,Icon,Avatar,Dropdown,Modal,Button,message,Tabs,Progress,Spin} from 'antd';
import {Router,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import { AliveScope,KeepAlive } from 'react-activation';

import admin_style from "../../static/css/admin.module.less";
import PrivateRoute from '../privateRouter/PrivateRoute';
import Page_404 from '../error/Page_404';
import Axios from '../axios/Axios';
import store from '../../util/store';
import UpdPwd from './UpdPwd';
import Userinfo from '../user/Userinfo';
import {connect} from 'react-redux';
import WithAuthRoute from '../common/auth/route/WithAuthRoute';
import adminRouteList from './adminRouteList';
import Home from './Home';
import commonStyle from '../../static/css/common.module.less';
import Loading from '../loading/Loading';

const {Header,Content,Footer,Sider}=Layout;
const {SubMenu}=Menu;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [],
            menuTree: [],
            menuRouteList: [],
            openKeys: [],
            selectKeys: [],
            collapsed: false,
            side_width: '200px',
            side_collapsed_with: 0,

            userinfo: {},
            showUpdPwd: false,
            updPwdLoading: false,
            showPsnPage: false,

            loading: true,

            tabPanes: [
                {
                    title: <Icon type="home" theme="filled" style={{fontSize:'20px'}}/>,
                    key: "0",
                    path: '/admin/home',
                    component: WithAuthRoute(Home)
                }
            ],
            tabActiveKey: '0'
        };
    }

    componentDidMount = ()=> {
        this.getUserInfo();
        this.getUserMenu();
    };


    //获取用户菜单
    getUserMenu = ()=> {
        Axios.get('/v1/menu/userMenu').then((ret)=> {
            //根据当前路由查找选择的菜单key
            let {selectKeys,tabPanes}=this.state;
            const regExp = new RegExp(/^\/\S*/);
            ret.data.menu_list.map((item)=> {
                let {route}=item;
                if (!regExp.test(route)) {
                    route = '/' + route;
                }
                if (route == this.props.location.pathname) {
                    //菜单的选中key
                    selectKeys = [item.id];
                    //打开选项卡
                    this.clickMenu(item.menu_name, route, item.id);
                }else {
                    this.setState({
                        loading:false
                    });
                }
            });

            this.setState({
                menuTree: ret.data.menu_tree,
                menuList: ret.data.menu_list,
                menuRouteList: ret.data.menu_route_list,
                openKeys: ret.data.open_keys,
                selectKeys
            });
        });
    };

    //递归获取菜单树
    getMenuTree = (menu)=> {
        const regExp = new RegExp(/^\/\S*/);
        return menu.map((item)=> {
            let {id,menu_name,route,children}=item;
            if (children.length > 0) {
                return (
                    <SubMenu key={id} title={<span><Icon type="appstore" /><span>{menu_name}</span></span>}>
                        {this.getMenuTree(children)}
                    </SubMenu>
                );
            } else {
                if (!regExp.test(route)) {
                    route = '/' + route;
                }
                return (
                    <Menu.Item key={id} onClick={()=>this.clickMenu(menu_name,route,id)}>
                        <Link to={route} title="12121212"
                        >{menu_name}</Link>
                    </Menu.Item>
                );
            }
        });
    };

    //获取用户信息
    getUserInfo = ()=> {
        Axios.get('/v1/user/userinfo').then((ret)=> {
            this.setState({
                userinfo: ret.data.userinfo
            });
        });
    };

    toggle = ()=> {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    onBreakpoint = (broken)=> {
        if (broken) {
            this.setState({
                collapsed: true
            });
        }
    };

    //点击左侧菜单
    clickMenu = (title, path, key)=> {
        let {tabPanes}=this.state;
        const index = findIndex(tabPanes, (item)=> {
            return item.path == path;
        });
        if (index == -1) {//新增标签页
            //找到路由对应的组件
            const route_index = findIndex(adminRouteList, (item)=> {
                return item.path == path;
            });
            if (route_index == -1) {//未查找到路由，渲染404页面
                tabPanes.push({
                    key: key,
                    title: title,
                    path: path,
                    component: Page_404
                });
            } else {//查找到路由，渲染该路由
                const {component}=adminRouteList[route_index];
                tabPanes.push({
                    key: key,
                    title: title,
                    path: path,
                    component: WithAuthRoute(component)
                });
            }
            this.setState({
                tabPanes,
                tabActiveKey: key,
                loading:false
            });
        } else {
            this.setState({
                tabActiveKey: key,
                loading:false
            });
        }
    };

    //点击切换tab
    clickTabs = tabActiveKey => {
        this.setState({tabActiveKey});
    };

    //刷新当前活跃的tab
    refresh = ()=> {
        let {tabActiveKey,tabPanes}=this.state;
        const index = findIndex(tabPanes, (item)=> {
            return item.key == tabActiveKey;
        });
        if (index != -1) {
            const component = tabPanes[index].component;
            tabPanes[index].component = Page_404;
            this.setState({
                tabPanes
            }, ()=> {
                tabPanes[index].component = component;
                this.setState({
                    tabPanes
                });
            });
        }
    };

    //点击tab的关闭按钮
    onTabEdit = (targetKey, action)=> {
        if (action == 'remove') {
            let {tabPanes,tabActiveKey}=this.state;
            const index = findIndex(tabPanes, (item)=> {
                return item.key == targetKey;
            });
            if (index != -1) {
                //先早前面是否有存在tab
                const next_index = index + 1;
                const pre_index = index - 1;
                if (tabActiveKey == targetKey) {
                    if (tabPanes.hasOwnProperty(next_index)) {
                        this.setState({
                            tabActiveKey: tabPanes[next_index].key
                        });
                    } else if (tabPanes.hasOwnProperty(pre_index)) {
                        this.setState({
                            tabActiveKey: tabPanes[pre_index].key
                        });
                    }
                }

                tabPanes.splice(index, 1);
                this.setState({
                    tabPanes
                });
            }
        }
    };

    //退出登录
    logout = ()=> {
        const {confirm} = Modal;
        confirm({
            title: '确定要退出登录吗?',
            content: '',
            cancelText: '取消',
            okText: '确定',
            onOk: ()=> {
                Axios.delete('/v1/session', {msg: false}).then((ret)=> {
                    if (ret) {
                        store.delete('token');
                        this.props.history.push('/login');
                    }
                });
            }
        });
    };

    //打开修改密码界面
    showUpdPwd = ()=> {
        this.setState({
            showUpdPwd: true
        });
    };

    //执行修改密码
    doUpdPwd = ()=> {
        this.setState({
            updPwdLoading: true
        }, ()=> {
            this.updPwdForm.doUpdate().then((ret)=> {
                this.setState({
                    updPwdLoading: false,
                    showUpdPwd: false
                });
                message.success('修改密码成功!', 3);
            }).catch(()=> {
                this.setState({
                    updPwdLoading: false,
                });
            });
        });
    };

    //关闭修改密码界面
    handleUpdPwdCancel = ()=> {
        this.setState({
            showUpdPwd: false
        });
    };


    //显示个人信息界面
    showPsnPage = ()=> {
        this.refs.userinfo.show();
    };


    render() {
        const {menuTree,menuRouteList,openKeys,selectKeys,loading}=this.state;
        const {routeLoadPercent,showRouteLoadingLine,routeComplete}=this.props;

        //左侧菜单
        const MenuTree = this.getMenuTree(menuTree);

        //右上角下拉菜单
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;" onClick={this.showPsnPage}>
                        <Icon type="user"/>
                        <span style={{marginLeft:'10px'}}>查看信息</span>
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;" onClick={this.showUpdPwd}>
                        <Icon type="unlock"/>
                        <span style={{marginLeft:'10px'}}>修改密码</span>
                    </a>
                </Menu.Item>
                <Menu.Item className={commonStyle.borderTop}>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;" onClick={this.logout}>
                        <Icon type="logout"/>
                        <span style={{marginLeft:'10px'}}>退出登录</span>
                    </a>
                </Menu.Item>
            </Menu>
        );

        const {TabPane}=Tabs;

        const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin/>;
        console.log(loading);

        return (
            <div>
                {
                    loading?<Loading/>:
                        showRouteLoadingLine ?
                            (<Progress percent={routeLoadPercent}
                                       style={{position:'fixed',top:'-12px',left:'-5px',zIndex:999999}} showInfo={false}
                                       strokeWidth={4}
                                       status={'normal'}/>)
                            :
                            null
                }
                <Layout>
                    <Sider
                        breakpoint={[ 'xs','sm', 'md', 'lg', 'xl', 'xxl' ]}
                        style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
                        collapsible
                        onBreakpoint={this.onBreakpoint}
                        collapsed={this.state.collapsed}
                        trigger={null}
                        width={this.state.side_width}
                        collapsedWidth={this.state.side_collapsed_with}
                    >
                        <div className={admin_style.liLogo}>这里放logo</div>
                        {
                            MenuTree.length > 0
                                ?
                                <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys}
                                      defaultOpenKeys={openKeys}>
                                    {MenuTree}
                                </Menu>
                                :
                                null
                        }


                    </Sider>
                    <Layout
                        style={{marginLeft:this.state.collapsed?this.state.side_collapsed_with:this.state.side_width}}>
                        <Header
                            style={{position:'fixed',left:this.state.collapsed?this.state.side_collapsed_with:this.state.side_width,right:0,
                        boxShadow: '1px 3px 5px #dddddd',paddingLeft:'0',paddingRight:'0',color:'#fff',height:'54px'}}>
                            <div
                                style={{height:'54px',position:'relative',paddingLeft:'20px',paddingRight:'20px',lineHeight:'54px'}}>
                                <Icon type={this.state.collapsed?'menu-unfold':'menu-fold'}
                                      style={{fontSize:'20px',cursor:'pointer',verticalAlign:'middle',color:'#fff'}}
                                      onClick={this.toggle}/>
                                <Icon type="reload" spin
                                      style={{fontSize:'20px',cursor:'pointer',verticalAlign:'middle',color:'#fff',marginLeft:'20px'}}
                                      onClick={this.refresh}/>

                                <div
                                    style={{display:'inline-block',height:'100%',boxSizing:'border-box',float:'right'}}>
                                    <div
                                        style={{display:'inline-block',height:'100%',boxSizing:'border-box',marginRight:'20px',verticalAlign:'middle',fontSize:'22px',cursor:'pointer'}}>
                                        <Icon type="bell" style={{color:'#fff'}}/>
                                    </div>
                                    <div style={{display:'inline-block',height:'100%',boxSizing:'border-box'}}>
                                        <Avatar style={{ backgroundColor: '#87d068' }}
                                                src={this.state.userinfo.avatar}/>
                                    </div>
                                    <Dropdown overlay={menu} overlayStyle={{width:'150px'}}>
                                            <span
                                                style={{marginLeft:'10px',verticalAlign:'middle',height:'100%',display:'inline-block',cursor:'pointer'}}>
                                                <span>{this.state.userinfo.username}</span>
                                                <Icon type="down"/>
                                            </span>
                                    </Dropdown>
                                </div>
                            </div>

                        </Header>
                        <Layout className={admin_style.layout}
                                style={{left:this.state.collapsed?this.state.side_collapsed_with:this.state.side_width}}>
                            <Tabs
                                animated
                                hideAdd
                                onChange={this.clickTabs}
                                activeKey={this.state.tabActiveKey}
                                type="editable-card"
                                onEdit={this.onTabEdit}
                                style={{boxSizing: 'border-box',height:'100%',paddingTop:'44px'}}
                                tabBarStyle={{background:'#fff',marginBottom:0,marginTop:'-44px'}}
                            >
                                {
                                    this.state.tabPanes.map((item)=>(
                                        <TabPane tab={item.title} key={item.key} closable={item.key!='0'}>
                                            <Content className={admin_style.content}>
                                                <item.component path={item.path}/>
                                            </Content>
                                        </TabPane>
                                    ))
                                }
                            </Tabs>

                        </Layout>
                    </Layout>
                </Layout>


                <Modal
                    title="修改用户密码"
                    okText="确认提交"
                    cancelText="取消"
                    visible={this.state.showUpdPwd}
                    destroyOnClose={true}
                    onCancel={this.handleUpdPwdCancel}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.handleUpdPwdCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={this.state.updPwdLoading} onClick={this.doUpdPwd}>
                           提交
                       </Button>
                    ]}
                >
                    <UpdPwd wrappedComponentRef={(form) => this.updPwdForm = form}/>
                </Modal>

                <Userinfo ref="userinfo"/>

            </div>
        );
    }
}


const mapStateToProps = (state)=> {
    return {
        components: state.menuTabComponentReducer.components,
        routeLoadPercent: state.routeReducer.percent,
        showRouteLoadingLine: state.routeReducer.showLoadingLine,
        routeComplete: state.routeReducer.complete,
    }
};


export default connect(
    mapStateToProps,
    null
)(App) ;