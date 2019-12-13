/**
 * Created by Administrator on 2019/10/22.
 */
import React,{} from 'react';
import { Table, Button,Icon,Tree,Row,Col,Tabs,Checkbox,Spin,message,Modal,Menu,Empty,Input,Popconfirm} from 'antd';

import Axios from '../axios/Axios';
import PermissionStyle from '../../static/css/permission.module.css';
import WithAuthBtn from '../common/auth/btn/WithAuthBtn';
import WithAuthIcon from '../common/auth/btn/WithAuthIcon';
import WithAuthTextBtn from '../common/auth/btn/WithAuthTextBtn';
import TextAddBtn from '../common/auth/btn/TextAddBtn';
import EditIcon from '../common/EditIcon';
import DelIcon from '../common/DelIcon';
import RoleList from '../role/RoleList';
import Create from './Create';
import Edit from './Edit';


const AuthBtn = WithAuthBtn(Button);
const AuthEditIcon = WithAuthIcon(EditIcon);
const AuthDelIcon = WithAuthIcon(DelIcon);
const AuithTextAddBtn = WithAuthTextBtn(TextAddBtn);

const TitleComponent = ({name,is_node,id,showCreate,del,showEdit})=> {
    return (
        <React.Fragment>
            {name}
            <AuthEditIcon auth="permission_menu_edit_btn" style={{marginLeft:'7px'}} onClick={(e)=>showEdit(e,id)}/>
            <Popconfirm
                title="确认删除该菜单吗？"
                cancelText="取消"
                okText="确认"
                onCancel={(e)=>e.stopPropagation()}
                onClick={(e)=>e.stopPropagation()}
                onConfirm={(e)=>del(e,id)}
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
                <AuthDelIcon auth="permission_menu_del_btn" style={{marginLeft:'7px'}}/>
            </Popconfirm>
            {
                is_node ?
                    <AuithTextAddBtn auth="permission_add_menu_btn" text="子菜单" onClick={(e)=>showCreate(e,id)}
                                     style={{marginLeft:'15px'}}/>
                    :
                    null
            }

        </React.Fragment>
    );
};

const { TreeNode } = Tree;

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            spinning: true,
            selectRoleId: '',
            reList: [],
            list: [],
            menuTreeNode: [],
            roleMenuIds: [],
            reRoleMenuIds: [],
            selectKeys: [],

            createVisible: false,
            createBtnLoading: false,
            createPid: '',

            delId: '',

            editVisible: false,
            editBtnLoading: false,
            editId: ''
        };
    }


    //选择角色前的回调
    beforeCheckRole = ()=> {
        this.setState({
            spinning: true
        });
    };

    //选择角色后的回调
    checkRoleCallBack = (id)=> {
        Axios.get(`/v1/role/${id}/menu`).then((ret)=> {
            this.setState({
                selectRoleId: id,
                spinning: false,
                reList: ret.data.menu_tree,
                list: ret.data.menu_tree,
                roleMenuIds: ret.data.role_menu_ids,
                reRoleMenuIds: ret.data.role_menu_ids
            }, ()=> {
            });
        });
    };

    getTreeNode = (list)=> {
        return list.map((item, key)=> {
            let title = <TitleComponent name={item.menu_name} is_node={item.is_node} showCreate={this.showCreate}
                                        id={item.id} del={this.del} showEdit={this.showEdit}/>;
            if (item.children.length > 0) {
                return (
                    <TreeNode title={title} key={item.id}>
                        {this.getTreeNode(item.children)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={title} key={item.id}/>
                );
            }

        })
    };

    //显示添加菜单弹窗
    showCreate = (e, id = null)=> {
        e.stopPropagation();
        this.setState({
            createVisible: true,
            createPid: id
        });
    };

    //执行添加
    doCreate = ()=> {
        this.setState({
            createBtnLoading: true
        });
        this.createForm.doCreate().then((ret)=> {
            this.setState({
                createBtnLoading: false,
                createVisible: false,
                createPid: ''
            });
            message.success('添加成功！', 3);
            this.roleList.checkRole(this.state.selectRoleId);
        }).catch((e)=> {
            this.setState({
                createBtnLoading: false,
            });
        });
    };


    //关闭添加菜单弹窗
    cancelCreate = ()=> {
        this.setState({
            createVisible: false,
            createPid: ''
        });
    };

    //删除菜单
    del = (e, id)=> {
        e.stopPropagation();
        this.setState({
            delId: id
        }, ()=> {
            Axios.delete(`/v1/menu/${id}`, {msg: '正在删除'}).then((ret)=> {
                if (ret) {
                    message.success('删除成功！', 3);
                    this.roleList.checkRole(this.state.selectRoleId);
                }
            });
        });
    };


    //显示修改菜单弹窗
    showEdit = (e, id = null)=> {
        e.stopPropagation();
        this.setState({
            editId: id
        }, ()=> {
            this.setState({
                editVisible: true
            });
        });
    };

    //执行修改
    doUpdate = ()=> {
        this.setState({
            editBtnLoading: true
        });
        this.editForm.doUpdate().then((ret)=> {
            this.setState({
                editBtnLoading: false,
                editVisible: false,
                editId: ''
            });
            message.success('修改成功！', 3);
            this.roleList.checkRole(this.state.selectRoleId);
        }).catch((e)=> {
            this.setState({
                editBtnLoading: false,
            });
        });
    };

    //关闭修改菜单弹窗
    cancelEdit = ()=> {
        this.setState({
            editVisible: false,
            editId: ''
        });
    };

    //保存角色菜单
    saveMenu = ()=> {
        //获取该角色的权限设置
        this.setState({
            spinning: true
        });
        const {selectRoleId}=this.state;
        const {roleMenuIds,reRoleMenuIds}=this.state;
        Axios.put(`/v1/role/${selectRoleId}/menu`, {
            data: {
                role_menu_ids: roleMenuIds,
                re_role_menu_ids: reRoleMenuIds
            }
        }).then((ret)=> {
            this.setState({
                spinning: false
            }, ()=> {
                message.success('保存成功！');
            });
        });
    };

    //选择角色后的回调
    onMenuCheck = (checkedKeys)=> {
        this.setState({
            roleMenuIds: checkedKeys
        });
    };

    render = ()=> {

        const {selectRoleId,spinning,list,roleMenuIds,createVisible,createBtnLoading,createPid,editVisible,editBtnLoading,editId}=this.state;
        const MenuTreeNode = this.getTreeNode(list);
        return (
            <div style={{height:'100%'}}>
                <Row style={{height:'100%'}}>
                    <Col span={4}
                         style={{borderRight:'solid 1px #e8e8e8',height:'100%',overflow:'auto',paddingBottom:'25px'}}>
                        <RoleList roleId={selectRoleId} beforeCheckRole={this.beforeCheckRole}
                                  checkRoleCallBack={this.checkRoleCallBack} onRef={(ref)=>{this.roleList=ref}}/>
                    </Col>

                    <Col span={20} style={{position:'relative',height:'100%'}}>
                        <Spin spinning={spinning} wrapperClassName={PermissionStyle.spinning}>
                            <div style={{padding:'10px 30px',paddingBottom:'30px'}}>

                                {
                                    list.length > 0 ?
                                        <React.Fragment>
                                            <div
                                                style={{marginBottom:'20px',borderBottom:'solid 1px #E8E8E8',fontSize:'16px',fontWeight:600,padding:'10px',background:'rgba(0,0,0,0.05)'}}>
                                                <AuthBtn type="primary" icon="plus" auth="permission_add_menu_btn"
                                                         onClick={(e)=>this.showCreate(e,null)}>
                                                    添加菜单
                                                </AuthBtn>
                                            </div>


                                            <Tree
                                                checkable
                                                selectable={false}
                                                defaultExpandAll
                                                defaultCheckedKeys={roleMenuIds}
                                                checkedKeys={roleMenuIds}
                                                onCheck={this.onMenuCheck}
                                            >
                                                {MenuTreeNode}
                                            </Tree>

                                            <div className={PermissionStyle.permissionBlock}>
                                                <AuthBtn type="primary" onClick={this.saveMenu}
                                                         auth="permission_save_role_menu_btn">保存</AuthBtn>
                                            </div>
                                        </React.Fragment>
                                        :
                                        (<Empty description={false} style={{position:'absolute',top:'50%',left:'50%',marginTop:'-70px',marginLeft:'-90px'}}/>)
                                }
                            </div>
                        </Spin>
                    </Col>
                </Row>


                <Modal
                    centered
                    title="添加菜单"
                    okText="确认提交"
                    cancelText="取消"
                    visible={createVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelCreate}
                    bodyStyle={{maxHeight:'75vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelCreate}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={createBtnLoading} onClick={this.doCreate}>
                           提交
                       </Button>,
                    ]}
                >
                    <Create wrappedComponentRef={(form) => this.createForm = form}
                            pid={createPid}/>
                </Modal>


                <Modal
                    centered
                    title="修改菜单"
                    okText="确认提交"
                    cancelText="取消"
                    visible={editVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelEdit}
                    bodyStyle={{maxHeight:'75vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelEdit}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={editBtnLoading} onClick={this.doUpdate}>
                           提交
                       </Button>,
                    ]}
                >
                    <Edit wrappedComponentRef={(form) => this.editForm = form}
                          id={editId}/>
                </Modal>
            </div>
        );
    }
}

export default Index;