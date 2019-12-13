/**
 * Created by Administrator on 2019/10/17.
 */
/**
 * Created by Administrator on 2019/7/1.
 */
import React from 'react';
import { Table, Button,Icon,Modal,message,Switch,Form,Avatar,Popover} from 'antd';

import Axios from '../../component/axios/Axios';
import AdminStlye from '../../static/css/admin.module.less';
import CreateForm from './Create';
import EditForm from './Edit';
import UpdPwdForm from '../../component/user/UpdPwdForm';
import SearchForm from './SearchForm';
import {pagination} from '../common/Common';
import {TYPES,TYPE_NAMES,METHODS,METHOD_NAMES,IS_PUBLIC,IS_PUBLIC_NAMES} from '../common/header/resource';
import WithAuthBtn  from '../common/auth/btn/WithAuthBtn';
import WithAuthSwitch from '../common/auth/btn/WithAuthSwitch';

const AuthBtn=WithAuthBtn(Button);
const AuthSwitch=WithAuthSwitch(Switch);

class User extends React.Component {
    constructor() {
        super();

        this.state = {
            page: 1,
            pageSize: pagination.pageSize,

            total: '',
            data: [],
            searchData: {},
            tableLoading: true,

            visible: false,
            confirmLoading: false,
            modalLoading: false,

            editVisible: false,
            editModalLoading: false,
            editId: '',

            switchLoadingId: ''
        };
    }

    componentWillMount = ()=> {
        this.getList();
    };

    //获取数据
    getList = ()=> {
        this.setState({
            tableLoading: true
        });
        Axios.get('/v1/resource', {
            params: {
                page: this.state.page,
                page_size: this.state.pageSize,
                ...this.state.searchData
            },
            msg: false
        }).then((ret)=> {
            this.setState({
                data: ret.data.data,
                total: ret.data.count,
                tableLoading: false
            });
        })
    };

    //弹出添加界面
    showCreate = ()=> {
        this.setState({
            visible: true
        })
    };

    //确认添加
    handleCreate = ()=> {
        this.setState({
            modalLoading: true
        });
        this.form.doCreate().then((ret)=> {
            this.setState({
                modalLoading: false,
                visible: false
            });
            message.success('创建成功', 3);
            this.getList();
        }).catch((e)=> {
            this.setState({
                modalLoading: false
            });
        });
    };

    //取消添加
    handleCancel = ()=> {
        this.setState({
            visible: false
        })
    };

    //修改状态
    updateState = (id, state, index)=> {
        this.setState({
            switchLoadingId: id
        });

        let data = this.state.data;
        //向服务端发起请求
        Axios.put(`/v1/resource/${id}/state`, {
            data: {
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

    //弹出修改界面
    showEdit = (id)=> {
        this.setState({
            editVisible: true,
            editId: id
        })
    };

    //关闭修改界面
    handleEditCancel = ()=> {
        this.setState({
            editVisible: false,
        })
    };

    //执行修改
    handleUpdate = ()=> {
        this.setState({
            editModalLoading: true
        });

        this.editForm.doUpdate().then((ret)=> {
            this.setState({
                editModalLoading: false,
                editVisible: false
            });
            this.getList();
            message.success('修改成功', 3);
        }).catch(()=> {
            this.setState({
                editModalLoading: false,
            });
        });
    };

    //删除资源
    delUser = (id)=> {
        const { confirm } = Modal;
        confirm({
            title: '删除确认?',
            content: '确定删除该条记录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: ()=> {
                return new Promise((resolve, reject) => {
                    Axios.delete(`/v1/resource/${id}`, {msg: false}).then((ret)=> {
                        message.success('删除成功', 3);
                        this.getList();
                        resolve();
                    }).catch(()=> {
                        reject();
                    });
                }).catch(() => {
                });
            },
        });
    };

    //执行搜索
    handleSearch = (values)=> {
        this.setState({
            searchData: values,
            page: 1
        }, ()=> {
            this.getList();
        });
    };

    //搜索重置
    handleSearchReset = ()=> {
        this.setState({
            searchData: {}
        });
    };

    render = ()=> {

        const totalWidth=1000;

        const columns = [
            {
                title: '序号',
                width: 80,
                dataIndex: 'index',
                fixed: 'left',
            },
            {
                title: '权限名称',
                dataIndex: 'name',
                width: 200,
            },
            {
                title: '类型',
                dataIndex: 'type',
                width: 80,
                render:(text,record)=>{
                    return (
                        <div>{TYPE_NAMES[text]}</div>
                    );
                }
            },
            {
                title: '资源标识',
                dataIndex: 'identify',
                width: 250,
                render:(text,record)=>{
                    return (
                        <div>
                            <span style={{color:'#ff4500',width:'40px'}}>{METHOD_NAMES[record.method]}</span>
                            <span style={{marginLeft:'10px'}}>{text}</span>
                        </div>
                    );
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                width: 150,
                render: (text, record, index)=> {
                    return (
                        <AuthSwitch auth="resource_setState_btn" checkedChildren="启用" unCheckedChildren="禁用"
                                checked={this.state.data[index].state==1?true:false}
                                onClick={(e)=>this.updateState(record.id,record.state,index)}
                                loading={record.id==this.state.switchLoadingId}
                        />
                    );
                }
            },
            {
                title: '是否公共资源',
                dataIndex: 'is_public',
                width: 150,
                render:(text)=>{
                    return (
                        <div>
                            {IS_PUBLIC_NAMES[text]}
                        </div>
                    );
                }
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 180,
            },
            {
                title: '修改时间',
                dataIndex: 'update_time',
            },
            {
                title: '操作',
                fixed: 'right',
                width: 200,
                render: (text, record) => {
                    return (
                        <div>
                            <AuthBtn type="primary" size="small" icon="edit" className={AdminStlye.tableBtn}
                                    onClick={()=>this.showEdit(record.id)} auth="resource_edit_btn">修改</AuthBtn>
                            <AuthBtn type="danger" size="small" icon="delete" className={AdminStlye.tableBtn}
                                    onClick={()=>this.delUser(record.id)} auth="resource_del_btn">删除</AuthBtn>
                        </div>
                    );
                }
            },
        ];


        //分页器
        const currPagination = {
            ...pagination,
            current: this.state.page,
            total: this.state.total,
            onChange: (page, pageSize)=> {
                this.setState({
                    page: page,
                    pageSize: pageSize
                }, ()=> {
                    this.getList();
                });

            },
            onShowSizeChange: (current, size)=> {
                this.setState({
                    pageSize: size
                }, ()=> {
                    this.getList();
                });
            }
        };

        return (

            <div style={{padding:'10px'}}>
                <div>
                    <SearchForm handleSearch={this.handleSearch} handleSearchReset={this.handleSearchReset}/>
                </div>
                <AuthBtn type="primary" onClick={this.showCreate} auth="resource_add_btn">
                    <Icon type="plus"/>
                    新建
                </AuthBtn>
                <div className={AdminStlye.tableBox}>
                    <Table columns={columns} dataSource={this.state.data} scroll={{y:'65vh',x:'1500px'}}
                           pagination={currPagination} size="middle" loading={this.state.tableLoading} rowKey={'index'}/>
                </div>

                <Modal
                    title="添加资源"
                    okText="确认提交"
                    cancelText="取消"
                    visible={this.state.visible}
                    destroyOnClose={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.handleCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={this.state.modalLoading} onClick={this.handleCreate}>
                           提交
                       </Button>,
                    ]}
                >
                    <CreateForm wrappedComponentRef={(form) => this.form = form}/>
                </Modal>

                <Modal
                    title="修改资源"
                    okText="确认提交"
                    cancelText="取消"
                    visible={this.state.editVisible}
                    destroyOnClose={true}
                    onCancel={this.handleEditCancel}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.handleEditCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={this.state.editModalLoading} onClick={this.handleUpdate}>
                           提交
                       </Button>,
                    ]}
                >
                    <EditForm wrappedComponentRef={(form) => this.editForm = form} id={this.state.editId}/>
                </Modal>

            </div>

        );
    }
}

export default User;
