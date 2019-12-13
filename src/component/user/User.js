/**
 * Created by Administrator on 2019/7/1.
 */
import React from 'react';
import { Table, Button,Icon,Modal,message,Switch,Form,Avatar,Popover,Input,Row,Col} from 'antd';

import Axios from '../../component/axios/Axios';
import AdminStlye from '../../static/css/admin.module.less';
import CreateForm from '../../component/user/CreateForm';
import EditForm from '../../component/user/EditForm';
import UpdPwdForm from '../../component/user/UpdPwdForm';
import SearchForm from '../../component/user/SearchForm';
import WithAuthBtn from '../common/auth/btn/WithAuthBtn';
import WithAuthSwitch from '../common/auth/btn/WithAuthSwitch';
import commonCss from '../../static/css/common.module.less';
import TableToolbar from '../common/TableToolbar';

const AuthBtn = WithAuthBtn(Button);
const AuthSwitch=WithAuthSwitch(Switch);

const {Search}=Input;

class User extends React.Component {
    constructor() {
        super();

        this.state = {
            page: 1,
            page_size: 50,

            total: '',
            data: [],
            searchData: {},
            table_loading: true,

            visible: false,
            confirmLoading: false,
            modalLoading: false,

            editVisible: false,
            editModalLoading: false,
            editId: '',

            updPwdVisible: false,
            updPwdModalLoading: false,
            updPwdId: '',

            switchLoadingId: ''
        };
    }

    componentDidMount = ()=> {
        this.getList();
    };

    componentWillUnmount(){
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return;
        }
    }

    //获取数据
    getList = (searchData={})=> {
        this.setState({
            table_loading: true
        });
        Axios.get('/v1/user', {
            params: {
                page: this.state.page,
                page_size: this.state.page_size,
                ...searchData
            },
            msg: false
        }).then((ret)=> {
            this.setState({
                data: ret.data.data,
                total: ret.data.count,
                table_loading: false
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
        this.form.handleSubmit().then((ret)=> {
            this.setState({
                modalLoading: false,
                visible: false
            });
            message.success('创建成功', 3);
            this.getList(this.state.searchData);
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

    //修改用户状态
    updateState = (id, state, index)=> {
        this.setState({
            switchLoadingId: id
        });

        let data = this.state.data;
        //向服务端发起请求
        Axios.put(`/v1/user/${id}/state`, {
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
            this.getList(this.state.searchData);
            message.success('修改成功', 3);
        }).catch(()=> {
            this.setState({
                editModalLoading: false,
            });
        });
    };


    //弹出修改密码界面
    showUpdPwd = (id)=> {
        this.setState({
            updPwdVisible: true,
            updPwdId: id
        })
    };

    //关闭修改密码界面
    handleUpdPwdCancel = ()=> {
        this.setState({
            updPwdVisible: false
        });
    };

    //修改用户密码
    handleUpdPwd = ()=> {
        this.setState({
            updPwdModalLoading: true
        });
        this.updPwdForm.doUpdate().then((ret)=> {
            this.setState({
                updPwdModalLoading: false,
                updPwdVisible: false
            });
            //this.getList();
            message.success('修改成功', 3);
        }).catch((e)=> {
            this.setState({
                editModalLoading: false,
            });
        });
    };

    //删除用户
    delUser = (id)=> {
        const { confirm } = Modal;
        confirm({
            title: '删除确认?',
            content: '确定删除该条记录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: ()=> {
                return new Promise((resolve, reject) => {
                    Axios.delete(`/v1/user/${id}`, {msg: false}).then((ret)=> {
                        message.success('删除成功', 3);
                        this.getList(this.state.searchData);
                        resolve();
                    }).catch(()=> {
                        reject();
                    });
                }).catch(() => {
                });
            },
        });
    };

    toolBtn=()=>{
        return (
            <AuthBtn auth="user_add_btn" type="primary" onClick={this.showCreate}>
                <Icon type="plus"/>
                新建
            </AuthBtn>
        );
    };

    simpleSearch=()=>{
        return (
            <Search placeholder="请输入用户名" onSearch={value => this.handleSearch({username:value})} enterButton />
        );
    };

    searchFormComponent=()=>{
       return(<SearchForm handleSearch={this.handleSearch} handleSearchReset={this.handleSearchReset}/>);
    }

    //执行搜索
    handleSearch = (values)=> {
        this.setState({
            searchData: values,
            page: 1
        }, ()=> {
            this.getList(this.state.searchData);
        });
    };

    //搜索重置
    handleSearchReset = ()=> {
        this.setState({
            searchData: {}
        });
    };

    render = ()=> {

        const bigAvatar = ({src})=> (
            <div>
                <img src={src} style={{maxWidth:'400px'}}/>
            </div>
        );


        const columns = [
            {
                title: '序号',
                width: 70,
                dataIndex: 'index',
                fixed: 'left',
            },
            {
                title: '用户名',
                dataIndex: 'username',
                width: 150,
            },
            {
                title: '头像',
                dataIndex: 'avatar',
                width: 70,
                render: (text, record, index)=> {
                    return (
                        <Popover content={bigAvatar({src:record.avatar})} trigger="click" placement="bottom">
                            <Avatar size="middle" src={record.avatar} style={{cursor:'pointer'}}/>
                        </Popover>
                    );
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                width: 150,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 150,
            },
            {
                title: '状态',
                dataIndex: 'state',
                width: 150,
                render: (text, record, index)=> {
                    return (
                        <AuthSwitch auth="user_chstate_btn" checkedChildren="启用" unCheckedChildren="禁用"
                                checked={this.state.data[index].state==1?true:false}
                                onClick={(e)=>this.updateState(record.id,record.state,index)}
                                loading={record.id==this.state.switchLoadingId}
                        />
                    );
                }
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                width: 150,
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 180,
            },
            {
                title: '修改时间',
                dataIndex: 'update_time',
                width: 180,
            },
            {
                title: '操作',
                fixed: 'right',
                width: 300,
                render: (text, record) => {
                    return (
                        <div>
                            <AuthBtn auth="user_edit_btn" type="primary" size="small" icon="edit" className={AdminStlye.tableBtn}
                                    onClick={()=>this.showEdit(record.id)}>修改</AuthBtn>
                            <AuthBtn auth="user_chpwd_btn" size="small" icon="edit" className={AdminStlye.tableBtn}
                                    onClick={()=>this.showUpdPwd(record.id)}>修改密码</AuthBtn>
                            <AuthBtn auth="user_del_btn" type="danger" size="small" icon="delete" className={AdminStlye.tableBtn}
                                    onClick={()=>this.delUser(record.id)}>删除</AuthBtn>
                        </div>
                    );
                }
            },
        ];


        //分页器
        const pagination = {
            current: this.state.page,
            pageSize: this.state.page_size,
            pageSizeOptions: ['10', '20', '30', '50', '100'],
            showLessItems: true,
            showSizeChanger: true,
            total: this.state.total,
            showQuickJumper: true,
            onChange: (page, page_size)=> {
                this.setState({
                    page: page,
                    page_size: page_size
                }, ()=> {
                    this.getList(this.state.searchData);
                });

            },
            onShowSizeChange: (current, size)=> {
                this.setState({
                    page_size: size
                }, ()=> {
                    this.getList(this.state.searchData);
                });
            }
        };

        return (

            <div>
                <TableToolbar toolBtn={this.toolBtn} simpleSearch={this.simpleSearch} searchForm={this.searchFormComponent}/>
                <div className={commonCss.tableBox}>

                    <Table columns={columns} dataSource={this.state.data} scroll={{y:'65vh',x:'1600px'}}
                           pagination={pagination} size="middle" loading={this.state.table_loading} rowKey={'index'}/>
                </div>

                <Modal
                    title="添加用户"
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
                    title="修改用户信息"
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

                <Modal
                    title="修改用户密码"
                    okText="确认提交"
                    cancelText="取消"
                    visible={this.state.updPwdVisible}
                    destroyOnClose={true}
                    onCancel={this.handleUpdPwdCancel}
                    bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                    footer={[
                       <Button key="back" onClick={this.handleUpdPwdCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={this.state.editModalLoading} onClick={this.handleUpdPwd}>
                           提交
                       </Button>,
                    ]}
                >
                    <UpdPwdForm wrappedComponentRef={(form) => this.updPwdForm = form} id={this.state.updPwdId}/>
                </Modal>

            </div>

        );
    }
}

export default User;
