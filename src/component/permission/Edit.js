/**
 * Created by Administrator on 2019/9/19.
 */
import React from 'react';
import Axios from '../axios/Axios';
import {Form,Radio,Input,TreeSelect,Spin,Transfer} from 'antd';
import {formLayout} from '../common/Common';
import TableTransfer from '../resource/TableTransfer';

class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            treeNode: [],

            info:{},
            targetKeys: [],
            reTargetKeys:[],

            showSourceTransfer: false
        };
    }

    componentDidMount = ()=> {
        this.getInfo();
    };

    //获取修改信息
    getInfo = ()=> {
        Axios.get(`/v1/permission/${this.props.id}/edit`).then((ret)=> {
            this.setState({
                loading: false,
                info:ret.data.info,
                treeNode: ret.data.treeNode,
                targetKeys:ret.data.targetKeys,
                reTargetKeys:ret.data.targetKeys,
                showSourceTransfer:ret.data.info.is_node==0?true:false
            });
        });
    };


    //修改
    doUpdate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values['re_checked_resources']=this.state.reTargetKeys;
                    Axios.put(`/v1/permission/${this.props.id}`, {
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
        const {treeNode,loading,info,showSourceTransfer}=this.state;
        const {getFieldDecorator}=this.props.form;

        return (
            <div>
                <Spin tip="Loading..." spinning={loading}>
                    <Form {...formLayout}>
                        <Form.Item label="上级节点">
                            {getFieldDecorator('pid', {
                                initialValue: loading?null:info.pid,
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
                                    treeNodeFilterProp="title"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="权限名称">
                            {
                                getFieldDecorator('name', {
                                    initialValue: loading?null:info.name,
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
                                    initialValue: loading?null:info.sort_num,
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
                                initialValue: loading?null:info.state,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择状态',
                                    },
                                ]
                            })(
                                <Radio.Group>
                                    <Radio value={'1'}>启用</Radio>
                                    <Radio value={'0'}>禁用</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label="是否节点">
                            {getFieldDecorator('is_node', {
                                initialValue: loading?null:info.is_node,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择是否节点',
                                    },
                                ]
                            })(
                                <Radio.Group onChange={this.onNodeChange}>
                                    <Radio value={'1'}>是</Radio>
                                    <Radio value={'0'}>否</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        {
                            showSourceTransfer&&!loading ? (
                                <Form.Item label="关联资源">
                                    {getFieldDecorator('checked_resources', {
                                        initialValue: loading?null:this.state.targetKeys,
                                    })(
                                        <TableTransfer targetKeys={this.state.targetKeys}
                                                       onChange={this.onResourceChange} permissionId={this.props.id}/>
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

export default Form.create({name: 'permissionEdit'})(Edit);