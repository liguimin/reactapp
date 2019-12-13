/**
 * Created by Administrator on 2019/9/19.
 */
import React from 'react';
import Axios from '../axios/Axios';
import {Form,Radio,Input,TreeSelect,Spin,Transfer} from 'antd';
import {formLayout} from '../common/Common';
import TableTransfer from '../resource/TableTransfer';

class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            treeNode: [],
            selectPid: '',

            targetKeys: [],

            showSourceTransfer: this.props.pid?true:false
        };
    }

    componentDidMount = ()=> {
        this.getTreeNode();
    };

    //获取节点列表
    getTreeNode = ()=> {
        const selectPid = this.props.pid;
        Axios.get('/v1/permission/treeNode').then((ret)=> {
            this.setState({
                loading: false,
                treeNode: ret.data.tree_node,
                selectPid: selectPid
            });
        });
    };


    //添加
    doCreate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    Axios.post('/v1/permission', {
                        data: values,
                        msg: '正在提交'
                    }).then((ret)=> {
                        resolve(ret);
                    }).catch((e)=> {
                        reject(e);
                    });
                } else {
                    reject(err);
                }
            });

        });
    };

    //选中父节点的回调
    onPidChange = (value, label, extra)=> {
    };

    //选中资源
    onResourceChange = (targetKeys, direction, moveKeys, callback = null)=> {
        this.setState({
            targetKeys
        }, ()=> {
            if (callback) {
                callback();
            }
        });
    };

    //改变资源节点
    onNodeChange = (e)=> {
        const value = e.target.value;
        console.log(value);
        if (value == 1) {
            this.setState({
                showSourceTransfer: false
            });
        } else {
            this.setState({
                showSourceTransfer: true
            });
        }
    };


    render = ()=> {
        const {treeNode,loading,selectPid,showSourceTransfer}=this.state;
        const {getFieldDecorator}=this.props.form;

        return (
            <div>
                <Spin tip="Loading..." spinning={loading}>
                    <Form {...formLayout}>
                        <Form.Item label="上级节点">
                            {getFieldDecorator('pid', {
                                initialValue: selectPid ? selectPid : null,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择上级节点',
                                    },
                                ]
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{ width: 300 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={treeNode}
                                    placeholder="请选择上级节点"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={this.onPidChange}
                                    treeNodeFilterProp="title"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="权限名称">
                            {
                                getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入权限名称',
                                        }
                                    ]
                                })(<Input placeholder="请输入权限名称"/>)
                            }
                        </Form.Item>
                        <Form.Item label="排序">
                            {
                                getFieldDecorator('sort_num', {
                                    initialValue: 0,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入排序',
                                        }
                                    ]
                                })(<Input type="number" placeholder="请输入排序"/>)
                            }
                        </Form.Item>
                        <Form.Item label="状态">
                            {getFieldDecorator('state', {
                                initialValue: 1,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择状态',
                                    },
                                ]
                            })(
                                <Radio.Group>
                                    <Radio value={1}>启用</Radio>
                                    <Radio value={0}>禁用</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label="是否节点">
                            {getFieldDecorator('is_node', {
                                initialValue: selectPid?0:1,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择是否节点',
                                    },
                                ]
                            })(
                                <Radio.Group onChange={this.onNodeChange}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        {
                            showSourceTransfer ? (
                                <Form.Item label="关联资源">
                                    {getFieldDecorator('checked_resources', {
                                        initialValue: '',
                                    })(
                                        <TableTransfer targetKeys={this.state.targetKeys}
                                                       onChange={this.onResourceChange}/>
                                    )}
                                </Form.Item>
                            ) : null
                        }

                    </Form>

                </Spin>
            </div>
        );
    }
}

export default Form.create({name: 'permissionCreate'})(Create);