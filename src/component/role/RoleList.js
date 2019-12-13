/**
 * Created by Administrator on 2019/10/23.
 */
import React from 'react';
import { Icon,Spin,message,Modal,Menu,Button} from 'antd';

import WithAuthIcon from '../common/auth/btn/WithAuthIcon';
import Axios from '../axios/Axios';
import RoleCreate from './Create';
import RoleEdit from './Edit';
import PermissionStyle from '../../static/css/permission.module.css';
import WithAuthTextBtn from '../common/auth/btn/WithAuthTextBtn';
import TextAddBtn from '../common/auth/btn/TextAddBtn';
import EditIcon from '../common/EditIcon';
import DelIcon from '../common/DelIcon';

const AuthEditIcon = WithAuthIcon(EditIcon);
const AuthDelIcon = WithAuthIcon(DelIcon);
const AuithTextAddBtn = WithAuthTextBtn(TextAddBtn);

class RoleList extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            spinning: false,

            createVisible: false,
            createBtnLoading: false,

            selectId: '',
            overId: '',

            editVisible: false,
            editBtnLoading: false,
            editId: ''
        };
    }

    componentDidMount = ()=> {
        this.props.onRef(this);
        this.getRoleList()
    };

    //显示创建角色界面
    showRoleCreate = ()=> {
        this.setState({
            createVisible: true
        });
    };

    //关闭创建角色界面
    cancelRoleCreate = ()=> {
        this.setState({
            createVisible: false
        });
    };

    //执行添加
    doRoleCreate = ()=> {
        this.setState({
            createBtnLoading: true
        });
        this.createRoleForm.doCreate().then((ret)=> {
            this.setState({
                createBtnLoading: false,
                createVisible: false
            });
            message.success('添加成功！', 3);
            this.getRoleList();
        }).catch((e)=> {
            this.setState({
                createBtnLoading: false,
                createVisible: false
            });
        });
    };

    //获取角色列表
    getRoleList = ()=> {
        this.setState({
            spinning:true
        });
        Axios.get('/v1/role').then((ret)=> {
            this.setState({
                data: ret.data.data,
                spinning: false
            });

            //如果未选中角色，则进行选中
            if (!this.props.roleId) {
                if (ret.data.data.length > 0) {
                    this.checkRole(ret.data.data[0].id);
                }
            }
        });
    };

    //选中某个角色
    checkRole = (id)=> {
        this.props.beforeCheckRole();
        this.setState({
           selectId: id
        }, ()=> {
            this.props.checkRoleCallBack(id);
        });

    };


    //删除角色
    delRole = (id, key, e)=> {
        e.stopPropagation();
        Modal.confirm({
            title: '删除角色',
            content: '确定删除该角色吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: ()=> {
                Axios.delete(`/v1/role/${id}`, {msg: '正在删除'}).then((ret)=> {
                    if (ret) {
                        message.success('删除成功！', 3);
                        this.getRoleList();
                    }
                });
            }
        });
    };

    //显示修改界面
    showRoleEdit = (id, e)=> {
        e.stopPropagation();
        this.setState({
            editVisible: true,
            editId: id
        });
    };

    //关闭修改界面
    cancelRoleEdit = ()=> {
        this.setState({
            editVisible: false,
            editBtnLoading: false
        });
    };

    //执行修改
    doRoleUpdate = ()=> {
        this.setState({
            editBtnLoading: true

        });
        this.roleEditForm.doUpdate().then((ret)=> {
            message.success('修改成功');
            this.setState({
                editVisible: false,
                editBtnLoading: false
            });
            this.getRoleList();
        }).catch((e)=> {
            this.setState({
                editBtnLoading: false
            });
        });
    };

    //鼠标滑过角色，显示编辑和删除
    onMouseoverRole = (id)=> {
        this.setState({
            overId: id
        });
    };

    onMouseLeaveRole = ()=> {
        this.setState({
            overId: ''
        });
    };


    render = ()=> {
        const {data,spinning,createVisible,createBtnLoading,selectId,overId,editVisible,editBtnLoading,editId}=this.state;
        return (
            <Spin style={{minHeight:'200px'}} spinning={spinning}>

                <Menu
                    mode="inline"
                    inlineCollapsed={false}
                    style={{height:'100%'}}
                    onMouseLeave={this.onMouseLeaveRole}
                    selectedKeys={[`${selectId}`]}
                >
                    {data.map((item, key)=>(
                        <Menu.Item key={item.id} onClick={(e)=>this.checkRole(item.id)}
                                   onMouseOver={()=>this.onMouseoverRole(item.id)}>
                            <span>{item.name}</span>

                            {(selectId == item.id || overId == item.id) ?
                                (
                                    <div style={{float:'right'}}>
                                        <AuthEditIcon onClick={(e)=>this.showRoleEdit(item.id,e)}
                                                      auth="permission_role_edit_btn"/>
                                        <AuthDelIcon onClick={(e)=>this.delRole(item.id,key,e)}
                                                     auth="permission_role_del_btn"
                                                     style={{color:'#FF0000'}}/>
                                    </div>
                                )
                                :
                                null
                            }

                        </Menu.Item>
                    ))}

                </Menu>

                {
                    spinning ?
                        null
                        :
                        (
                            <div style={{marginTop:'20px'}}>
                                <div className={PermissionStyle.contentBox}>
                                    <div style={{fontSize:'14px',color:'#1890ff',paddingLeft:'20px'}}>
                                        <AuithTextAddBtn style={{marginLeft:'5px'}}
                                                         onClick={this.showRoleCreate} text="创建角色"
                                                         auth="permission_role_add_btn"/>
                                    </div>
                                </div>
                            </div>
                        )
                }


                <Modal
                    title="添加角色"
                    okText="确认提交"
                    cancelText="取消"
                    visible={createVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelRoleCreate}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelRoleCreate}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={createBtnLoading} onClick={this.doRoleCreate}>
                           提交
                       </Button>,
                    ]}
                >
                    <RoleCreate wrappedComponentRef={(form) => this.createRoleForm = form}/>
                </Modal>


                <Modal
                    title="修改角色"
                    okText="确认提交"
                    cancelText="取消"
                    visible={editVisible}
                    destroyOnClose={true}
                    onCancel={this.cancelRoleEdit}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.cancelRoleEdit}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={editBtnLoading} onClick={this.doRoleUpdate}>
                           提交
                       </Button>,
                    ]}
                >
                    <RoleEdit wrappedComponentRef={(form) => this.roleEditForm = form} id={editId}/>
                </Modal>

            </Spin>
        );
    }
}

export default RoleList;