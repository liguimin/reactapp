/**
 * Created by Administrator on 2019/10/24.
 */
/**
 * Created by Administrator on 2019/9/19.
 */
import React from 'react';
import Axios from '../axios/Axios';
import {Form,Radio,Input,TreeSelect,Spin,Transfer} from 'antd';
import {formLayout} from '../common/Common';
import TableTransfer from '../resource/TableTransfer';
import {IS_NODE,IS_NODE_NAMES,STATES,STATES_NAME,IS_PUBLIC,IS_PUBLIC_NAMES} from '../common/header/menu';

class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            treeNode: [],
            data:{},
            showRoute: false
        };
    }

    componentDidMount = ()=> {
        this.getInfo();
    };

    //获取菜单节点列表
    getInfo = ()=> {
        Axios.get(`/v1/menu/${this.props.id}/edit`).then((ret)=> {
            this.setState({
                loading: false,
                data:ret.data.data,
                treeNode: ret.data.tree_node,
                showRoute:ret.data.data.is_node==IS_NODE.YES?false:true
            });
        });
    };

    //修改
    doUpdate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    Axios.put(`/v1/menu/${this.props.id}`, {
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

    //监听是否节点的选择
    onNodeChange = (e)=> {
        if (e.target.value == IS_NODE.YES) {//是节点，不需要填写路由
            this.setState({
                showRoute: false
            });
        } else {//不是节点，需要填写路由
            this.setState({
                showRoute: true
            });
        }
    };

    render = ()=> {
        const {treeNode,loading,showRoute,data}=this.state;
        const {getFieldDecorator}=this.props.form;

        return (
            <div>
                <Spin tip="Loading..." spinning={loading}>
                    <Form {...formLayout}>
                        <Form.Item label="上级节点">
                            {getFieldDecorator('pid', {
                                initialValue: loading ? null : data.pid,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择上级节点'
                                    }
                                ]
                            })(
                                <TreeSelect
                                    showSearch
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={treeNode}
                                    placeholder="请选择上级节点"
                                    allowClear
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="菜单名称">
                            {
                                getFieldDecorator('menu_name', {
                                    initialValue: loading ? null : data.menu_name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入菜单名称'
                                        }
                                    ]
                                })(<Input placeholder="请输入菜单名称"/>)
                            }
                        </Form.Item>

                        <Form.Item label="是否节点">
                            {getFieldDecorator('is_node', {
                                initialValue: loading ? null : data.is_node,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择是否节点'
                                    }
                                ]
                            })(
                                <Radio.Group onChange={this.onNodeChange}>
                                    {
                                        Object.keys(IS_NODE_NAMES).map((key, k)=>
                                            <Radio value={Number(key)} key={k}>{IS_NODE_NAMES[key]}</Radio>
                                        )
                                    }
                                </Radio.Group>
                            )}
                        </Form.Item>
                        {
                            showRoute ?
                                <Form.Item label="路由">
                                    {
                                        getFieldDecorator('route', {
                                            initialValue: loading ? null : data.route,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入路由'
                                                }
                                            ]
                                        })(<Input placeholder="请输入路由"/>)

                                    }
                                </Form.Item>
                                :
                                null
                        }
                        <Form.Item label="排序">
                            {
                                getFieldDecorator('sort_num', {
                                    initialValue: loading ? null : data.sort_num,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入排序'
                                        }
                                    ]
                                })(<Input type="number" placeholder="请输入排序"/>)
                            }
                        </Form.Item>
                        <Form.Item label="是否公共">
                            {getFieldDecorator('is_public', {
                                initialValue: loading ? null : data.is_public,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择是否公共'
                                    }
                                ]
                            })(
                                <Radio.Group>
                                    {
                                        Object.keys(IS_PUBLIC_NAMES).map((key, k)=>
                                            <Radio value={Number(key)} key={k}>{IS_PUBLIC_NAMES[key]}</Radio>
                                        )
                                    }
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label="状态">
                            {getFieldDecorator('state', {
                                initialValue: loading ? null : data.state,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择状态'
                                    }
                                ]
                            })(
                                <Radio.Group>
                                    {
                                        Object.keys(STATES_NAME).map((key, k)=>
                                            <Radio value={Number(key)} key={k}>{STATES_NAME[key]}</Radio>
                                        )
                                    }
                                </Radio.Group>
                            )}
                        </Form.Item>

                    </Form>

                </Spin>
            </div>
        );
    }
}

export default Form.create({name: 'menuEdit'})(Edit);