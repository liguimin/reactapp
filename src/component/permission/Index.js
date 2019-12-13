/**
 * 授权界面
 * Created by Administrator on 2019/8/9.
 */
import React from 'react';
import {Tabs} from 'antd';

import Permission from './Permission';
import Resource from '../resource/Index';
import Menu from '../menu/Index';
import WithAuth from '../common/auth/btn/WithAuth';
import findIndex from 'lodash/findIndex';
import {connect} from 'react-redux';
import PermissionStyle from '../../static/css/permission.module.css';

const { TabPane } = Tabs;

class Index extends React.Component {
    constructor() {
        super();
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };


    render = ()=> {
        const index = findIndex(this.props.permissions.btnPermissions, (item)=> {
            return item.identify === 'permission_resource_show_tab';
        });

        return (
            <div className="permission-body" style={{background:'#fff'}}>
                <Tabs defaultActiveKey="1"
                      style={{height:'100%',position:'relative',boxSizing: 'border-box',paddingTop: '44px'}}
                      tabBarStyle={{background:'#fff',marginBottom:0,marginTop:'-44px'}}>
                    <TabPane tab="页面授权" key="1">
                        <Permission/>
                    </TabPane>
                    <TabPane tab="菜单管理" key="2">
                        <Menu/>
                    </TabPane>
                    {
                        index == -1 ? null : (
                            <TabPane tab="资源管理" key="3" style={{overflowY:'auto',overflowX:'hidden'}}>
                                <Resource/>
                            </TabPane>
                        )
                    }
                </Tabs>
            </div>
        );
    }
}


const mapStateToProps = (state)=> {
    return {
        permissions: state.permissionReducer.permissions
    }
};


export default connect(mapStateToProps, null)(Index);