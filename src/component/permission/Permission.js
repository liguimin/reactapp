/**
 * 授权组件
 * Created by Administrator on 2019/8/13.
 */

import React from 'react';
import { Table, Button,Icon,Tree,Row,Col,Tabs,Checkbox,Spin,message,Modal,Menu,Empty,Input} from 'antd';

import Axios from '../axios/Axios';
import PermissionCreate from './Create';
import EditIcon from '../common/EditIcon';
import DelIcon from '../common/DelIcon';
import PermissionEdit from './Edit';
import WithAuthBtn from '../common/auth/btn/WithAuthBtn';
import WithAuthIcon from '../common/auth/btn/WithAuthIcon';
import WithAuthTextBtn from '../common/auth/btn/WithAuthTextBtn';
import TextAddBtn from '../common/auth/btn/TextAddBtn';
import RoleList from '../role/RoleList';

import PermissionStyle from '../../static/css/permission.module.css';

const { Search } = Input;

const AuthBtn = WithAuthBtn(Button);
const AuthEditIcon = WithAuthIcon(EditIcon);
const AuthDelIcon = WithAuthIcon(DelIcon);
const AuithTextAddBtn = WithAuthTextBtn(TextAddBtn);

class Permission extends React.Component {
    constructor() {
        super();
        this.state = {
            permission: {
                spinning: false,
                role_id: 0,
                re_list: [],
                list: [],
                rolePermission: [],
                reRolePermission: [],

                createVisible: false,
                createBtnLoading: false,
                createPid: 0,

                editVisible: false,
                editBtnLoading: false,
                editId: 0,

                searchName: ''
            }
        };
    }

    //选中权限
    onPermissionChange = (val)=> {
        this.setState({
            permission: {
                ...this.state.permission,
                rolePermission: val
            }
        });
    };

    //保存角色权限
    savePermission = ()=> {
        //获取该角色的权限设置
        this.setState({
            permission: {
                ...this.state.permission,
                spinning: true
            }
        });
        const {role_id}=this.state.permission;
        const {rolePermission,reRolePermission}=this.state.permission;
        Axios.put(`/v1/role/${role_id}/permission`, {
            data: {
                role_permission: rolePermission,
                re_role_permission: reRolePermission
            }
        }).then((ret)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    spinning: false
                }
            }, ()=> {
                message.success('保存成功！');
            });
        });
    };

    //显示添加权限的弹窗
    showPermissionCreaste = (id = null)=> {
        this.setState({
            permission: {
                ...this.state.permission,
                createVisible: true,
                createPid: id
            }
        });
    };


    //关闭添加权限的弹窗
    cancelPermissionCreate = ()=> {
        this.setState({
            permission: {
                ...this.state.permission,
                createVisible: false,
                createBtnLoading: false,
            }
        });
    };

    //执行添加权限
    doPermissionCreate = ()=> {
        this.setState({
            permission: {
                ...this.state.permission,
                createBtnLoading: true
            }
        });
        this.permissionCreateForm.doCreate().then((ret)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    createBtnLoading: false,
                    createVisible: false
                }
            });
            message.success('添加成功！', 3);
            console.log(this.roleList);
            this.roleList.checkRole(this.state.permission.role_id);
        }).catch((e)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    createBtnLoading: false,
                }
            });
        });
    };


    //显示修改权限的弹窗
    showPermissionEdit = (id)=> {
        this.setState({
            permission: {
                ...this.state.permission,
                editVisible: true,
                editId: id
            }
        });
    };


    //关闭修改权限的弹窗
    cancelPermissionEdit = ()=> {
        this.setState({
            permission: {
                ...this.state.permission,
                editVisible: false,
                editBtnLoading: false,
            }
        });
    };

    //执行修改权限
    doPermissionEdit = ()=> {
        this.setState({
            permission: {
                ...this.state.permission,
                editBtnLoading: true
            }
        });
        this.permissionEditForm.doUpdate().then((ret)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    editBtnLoading: false,
                    editVisible: false
                }
            });
            message.success('修改成功！！', 3);
            this.roleList.checkRole(this.state.permission.role_id);
        }).catch((e)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    editBtnLoading: false,
                }
            });
        });
    };


    //点击搜索资源按钮
    onResourceSearch = (value)=> {
        let {re_list}=this.state.permission;
        const list = re_list.filter(item=> {
            return item.name.indexOf(value) > -1;
        });
        this.setState({
            permission: {
                ...this.state.permission,
                list: list
            }
        });
    };

    //监听搜索框变化，并赋值
    onResourceSearchChange = (e)=> {
        this.setState({
            permission: {
                ...this.state.permission,
                searchName: e.target.value,
            }
        });
    };


    //删除权限
    delPermission = (id)=> {
        const { confirm } = Modal;
        confirm({
            title: '删除确认?',
            content: '确定删除该权限吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: ()=> {
                return new Promise((resolve, reject) => {
                    Axios.delete(`/v1/permission/${id}`, {msg: false}).then((ret)=> {
                        message.success('删除成功', 3);
                        this.roleList.checkRole(this.state.permission.role_id);
                        resolve();
                    }).catch(()=> {
                        reject();
                    });
                }).catch(() => {
                });
            },
        });
    };

    //选择角色前的回调
    beforeCheckRole = ()=> {
        this.setState({
            permission: {
                ...this.state.permission,
                spinning: true
            }
        });
    };

    //选择了角色后的回调
    checkRoleCallBack = (id)=> {
        Axios.get(`/v1/role/${id}/permission`).then((ret)=> {
            this.setState({
                permission: {
                    ...this.state.permission,
                    role_id: id,
                    spinning: false,
                    re_list: ret.data.tree,
                    list: ret.data.tree,
                    rolePermission: ret.data.role_permission,
                    reRolePermission: ret.data.role_permission
                }
            }, ()=> {

            });
        });
    };


    render = ()=> {
        const {permission}=this.state;
        const {
            role_id,
            spinning:permissionSpinning,
            list:permissionList,
            rolePermission,
            createVisible:permissionCreateVisible,
            createBtnLoading:permissionCreateBtnLoading,
            createPid:permissionCreatePid,
            editVisible:permissionEditVisible,
            editBtnLoading:permissionEditBtnLoading,
            editId:permissionEditId
            }=permission;

        return (
            <div style={{height:'100%'}}>
                <Row style={{height:'100%'}}>
                    <Col span={4}
                         style={{borderRight:'solid 1px #e8e8e8',height:'100%',overflow:'auto',paddingBottom:'25px'}}>

                        <RoleList roleId={role_id} beforeCheckRole={this.beforeCheckRole}
                                  checkRoleCallBack={this.checkRoleCallBack} onRef={(ref)=>{this.roleList=ref}}/>
                    </Col>

                    <Col span={20} style={{position:'relative',height:'100%'}}>
                        <Spin spinning={permissionSpinning} wrapperClassName={PermissionStyle.spinning}>
                            <div style={{height:'100%',overflowY:'auto',overflowX:'hidden'}}>
                                {
                                    permissionList.length > 0 ? (
                                        <div style={{padding:'10px 30px',paddingBottom:'30px'}}>

                                            <div
                                                style={{marginBottom:'20px',borderBottom:'solid 1px #E8E8E8',fontSize:'16px',fontWeight:600,padding:'10px',background:'rgba(0,0,0,0.05)'}}>
                                                <Row gutter={10}>
                                                    <Col span={12}>
                                                        <Search placeholder="请输入要查找的权限节点名称"
                                                                value={this.state.permission.searchName}
                                                                onChange={this.onResourceSearchChange}
                                                                onSearch={this.onResourceSearch}
                                                                enterButton/>
                                                    </Col>
                                                    <Col span={12} style={{textAlign:'right'}}>
                                                        <AuthBtn type="primary" icon="plus" auth="permission_add_btn"
                                                                 onClick={()=>this.showPermissionCreaste(null)}>
                                                            添加权限
                                                        </AuthBtn>
                                                    </Col>
                                                </Row>

                                            </div>

                                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onPermissionChange}
                                                            value={rolePermission}>
                                                {
                                                    permissionList.map((item, key)=>
                                                        (
                                                            <div className={PermissionStyle.permissionBlock}
                                                                 key={item.id}>
                                                                <div className={PermissionStyle.permissionTitleBox}>
                                                                <span className={PermissionStyle.permissionTitle}>
                                                                    {item.name}
                                                                </span>
                                                                <span style={{marginLeft:'10px'}}>
                                                                    <AuthEditIcon style={{marginRight:'5px'}}
                                                                                  onClick={()=>this.showPermissionEdit(item.id)}
                                                                                  auth="permission_edit_btn"/>
                                                                    <AuthDelIcon
                                                                        onClick={()=>this.delPermission(item.id)}
                                                                        auth="permission_del_btn"/>
                                                                </span>
                                                                <span>
                                                                    <AuithTextAddBtn style={{marginLeft:'20px'}}
                                                                                     onClick={()=>this.showPermissionCreaste(item.id)}
                                                                                     text="子权限"
                                                                                     auth="permission_add_btn"/>
                                                                </span>
                                                                </div>

                                                                <div className={PermissionStyle.permissionContentBox}>
                                                                    <div>

                                                                        <Row key={key}>
                                                                            {item.children.map((item, key)=>(
                                                                                <Col span={8} key={key}
                                                                                     style={{marginTop:'20px'}}>
                                                                                    <Checkbox
                                                                                        value={item.id}>{item.name}</Checkbox>
                                                                                    <AuthEditIcon
                                                                                        style={{marginRight:'5px'}}
                                                                                        onClick={()=>this.showPermissionEdit(item.id)}
                                                                                        auth="permission_edit_btn"/>
                                                                                    <AuthDelIcon
                                                                                        onClick={()=>this.delPermission(item.id)}
                                                                                        auth="permission_del_btn"/>

                                                                                </Col>
                                                                            ))}

                                                                        </Row>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </Checkbox.Group>

                                            <div className={PermissionStyle.permissionBlock}>
                                                <AuthBtn type="primary" onClick={this.savePermission}
                                                         auth="permission_save_role_permission">保存</AuthBtn>
                                            </div>

                                        </div>
                                    )
                                        :
                                        (<Empty description={false}
                                                style={{position:'absolute',top:'50%',left:'50%',marginTop:'-60px',marginLeft:'-90px'}}/>)
                                }
                                </div>
                        </Spin>
                    </Col>

                </Row>


                <Modal
                    centered
                    width={'80%'}
                    title="添加权限"
                    okText="确认提交"
                    cancelText="取消"
                    visible={permissionCreateVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelPermissionCreate}
                    bodyStyle={{maxHeight:'75vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelPermissionCreate}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={permissionCreateBtnLoading} onClick={this.doPermissionCreate}>
                           提交
                       </Button>,
                    ]}
                >
                    <PermissionCreate wrappedComponentRef={(form) => this.permissionCreateForm = form}
                                      pid={permissionCreatePid}/>
                </Modal>

                <Modal
                    centered
                    width={'80%'}
                    title="修改权限"
                    okText="确认提交"
                    cancelText="取消"
                    visible={permissionEditVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelPermissionEdit}
                    bodyStyle={{maxHeight:'75vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelPermissionEdit}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={permissionEditBtnLoading} onClick={this.doPermissionEdit}>
                           提交
                       </Button>,
                    ]}
                >
                    <PermissionEdit wrappedComponentRef={(form) => this.permissionEditForm = form}
                                    id={permissionEditId}/>
                </Modal>


            </div>
        );
    }
}

export default Permission;
