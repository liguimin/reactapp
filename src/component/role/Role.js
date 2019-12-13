/**
 * Created by Administrator on 2019/7/19.
 */
import React from 'react';
import { Table, Button,Icon,Modal,message,Switch,Form,Avatar,Popconfirm} from 'antd';

import Axios from '../../component/axios/Axios';
import {pagination} from '../common/Common';
import AdminStlye from '../../static/css/admin.module.less';
import Create from './Create';
import Edit from './Edit';
import WithAuthSwitch from '../common/auth/btn/WithAuthSwitch';
import WithAuthBtn from '../common/auth/btn/WithAuthBtn';
import TableToolbar from '../common/TableToolbar';
import commonCss from '../../static/css/common.module.less';

const AuthBtn = WithAuthBtn(Button);
const AuthSwitch=WithAuthSwitch(Switch);

class Role extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            SearchData: {},

            page: 1,
            pageSize: pagination.pageSize,

            tableLoading: false,

            createParams: {
                visible: false,
                btnLoading: false
            },

            editParams: {
                id:'',
                visible: false,
                btnLoading: false
            },

            delId: '',

            switchLoadingId: ''
        };
    }

    componentDidMount = ()=> {
        this.getList();
    };

    //获取数据
    getList = ()=> {
        this.setState({
            tableLoading: true
        });
        Axios.get('/v1/role', {
            params: {
                ...this.state.SearchData,
            }
        }).then((ret)=> {
            console.log(1212);
            this.setState({
                data: ret.data.data,
                tableLoading: false
            });
        });
    };

    //显示创建界面
    showCreate = ()=> {
        this.setState({
            createParams: {
                ...this.state.createParams,
                visible: true
            }
        });
    };

    //关闭创建界面
    cancelCreate = ()=> {
        this.setState({
            createParams: {
                ...this.state.createParams,
                visible: false
            }
        });
    };

    //执行添加
    doCreate = ()=> {
        this.setState({
            createParams: {
                ...this.state.createParams,
                btnLoading: true
            }
        });
        this.createForm.doCreate().then((ret)=> {
            this.setState({
                createParams: {
                    btnLoading: false,
                    visible: false
                }
            });
            message.success('添加成功！', 3);
            this.getList();
        }).catch((e)=> {
            this.setState({
                createParams: {
                    btnLoading: false,
                    visible: false
                }
            });
        });
    };

    //修改状态
    updateState = (id, state, index)=> {
        this.setState({
            switchLoadingId: id
        });

        let data = this.state.data;
        //向服务端发起请求
        Axios.put(`/v1/role/${id}/state`, {
            data: {
                id: id,
                state: state
            },
            msg: '修改中...'
        }).then((ret)=> {
            message.success('修改状态成功', 3);
            this.setState({
                switchLoadingId: '',
                data: data.map((item, key, arr)=>key === index ? {...item, state: ret.data.state} : item)
            });
        }).catch((e)=> {
            this.setState({
                switchLoadingId: '',
                data: data.map((item, key, arr)=>key === index ? {...item, state: state} : item)
            });
        })
    };


    //显示修改界面
    showEdit = (id)=> {
        this.setState({
            editParams:{
                ...this.state.editParams,
                visible:true,
                id:id
            }
        });
    };

    //关闭修改界面
    cancelEdit=()=>{
        this.setState({
            editParams:{
                ...this.state.editParams,
                visible:false,
                btnLoading:false
            }
        });
    };

    //执行修改
    doUpdate=()=>{
        this.setState({
            editParams:{
                ...this.state.editParams,
                btnLoading:true,
            }

        });
        this.editForm.doUpdate().then((ret)=>{
            message.success('修改成功');
            this.setState({
                editParams:{
                    ...this.state.editParams,
                    visible:false,
                    btnLoading:false
                }
            });
            this.getList();
        }).catch((e)=>{
            this.setState({
                editParams:{
                    ...this.state.editParams,
                    btnLoading:false
                }
            });
        });
    };

    //删除角色
    delRole = (id)=> {
        this.setState({
            delId: id
        }, ()=> {
            Axios.delete(`/v1/role/${id}`, {msg: '正在删除'}).then((ret)=> {
                if (ret) {
                    this.getList();
                }
            });
        });
    };

    toolBtn=()=>{
        return (
            <AuthBtn auth="role_add_btn" type="primary" onClick={this.showCreate}>
                <Icon type="plus"/>
                创建
            </AuthBtn>
        );
    };

    render = ()=> {

        //列表项
        const columns = [
            {
                title: '序号',
                width: 100,
                dataIndex: 'index',
            },
            {
                title: '名称',
                width: 150,
                dataIndex: 'name',
            },
            {
                title: '状态',
                width: 150,
                dataIndex: 'state',
                render: (text, record, index)=> {
                    return (
                        <AuthSwitch auth="role_setState_btn" checkedChildren="启用" unCheckedChildren="禁用"
                                checked={this.state.data[index].state==1?true:false}
                                onClick={(e)=>this.updateState(record.id,record.state,index)}
                                loading={record.id==this.state.switchLoadingId}
                        />
                    );
                }
            },
            {
                title: '创建时间',
                width: 180,
                dataIndex: 'create_time',
            },
            {
                title: '修改时间',
                width: 180,
                dataIndex: 'update_time',
            },
            {
                title: '操作',
                width: 200,
                render: (text, record, index)=> {
                    return (
                        <div>
                            <AuthBtn auth="role_edit_btn" type="primary" size="small" icon="edit" className={AdminStlye.tableBtn}
                                    onClick={()=>this.showEdit(record.id)}>修改</AuthBtn>
                            <Popconfirm
                                title="确认删除该角色吗？"
                                cancelText="取消"
                                okText="确认"
                                onConfirm={()=>this.delRole(record.id)}
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            >
                                <AuthBtn auth="role_del_btn" type="danger" size="small" icon="delete" loading={this.state.delId==record.id}
                                        className={AdminStlye.tableBtn}>删除</AuthBtn>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ];

        const {createParams,editParams}=this.state;

        return (
            <div>
                <TableToolbar toolBtn={this.toolBtn}/>
                <div className={commonCss.tableBox}>
                    <Table columns={columns} dataSource={this.state.data}
                           size="middle" loading={this.state.tableLoading} pagination={false} rowKey={'index'}/>
                </div>


                <div>

                    <Modal
                        title="添加角色"
                        okText="确认提交"
                        cancelText="取消"
                        visible={createParams.visible}
                        destroyOnClose={true}
                        onCancel={this.cancelCreate}
                        bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                        footer={[
                       <Button key="back" onClick={this.cancelCreate}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={createParams.btnLoading} onClick={this.doCreate}>
                           提交
                       </Button>,
                    ]}
                    >
                        <Create wrappedComponentRef={(form) => this.createForm = form}/>
                    </Modal>


                    <Modal
                        title="修改"
                        okText="确认提交"
                        cancelText="取消"
                        visible={editParams.visible}
                        destroyOnClose={true}
                        onCancel={this.cancelEdit}
                        bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                        footer={[
                       <Button key="back" onClick={this.cancelEdit}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={editParams.btnLoading} onClick={this.doUpdate}>
                           提交
                       </Button>,
                    ]}
                    >
                        <Edit wrappedComponentRef={(form) => this.editForm = form} id={editParams.id}/>
                    </Modal>
                </div>
            </div>

        );

    }
}

export  default Role;