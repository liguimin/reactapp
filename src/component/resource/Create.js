/**
 * Created by Administrator on 2019/9/24.
 */
/**
 * Created by Administrator on 2019/7/25.
 */
import React from 'react';
import {Button,Form, Input,Icon,Radio } from 'antd';

import Axios from '../../component/axios/Axios';
import {formLayout} from '../common/Common';
import {TYPES,TYPE_NAMES,METHODS,METHOD_NAMES,IS_PUBLIC,IS_PUBLIC_NAMES} from '../common/header/resource';

class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            methodVisible:false
        }
    }

    //添加
    doCreate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    Axios.post('/v1/resource', {
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

    //监听资源类型选择
    onTypeChange = (e)=> {
        if (e.target.value==TYPES.API){
            this.setState({
                methodVisible:true
            });
        }else {
            this.setState({
                methodVisible:false
            });
        }
    };

    render = ()=> {
        const {getFieldDecorator}=this.props.form;
        const {methodVisible}=this.state;
        return (
            <div>
                <Form {...formLayout}>
                    <Form.Item label="资源名称">
                        {
                            getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入资源名称',
                                    }
                                ]
                            })(<Input placeholder="请输入资源名称"/>)
                        }
                    </Form.Item>
                    <Form.Item label="资源标识">
                        {
                            getFieldDecorator('identify', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入资源标识',
                                    }
                                ]
                            })(<Input placeholder="请输入资源标识"/>)
                        }
                    </Form.Item>
                    <Form.Item label="资源类型">
                        {getFieldDecorator('type', {
                            initialValue: null,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择资源类型',
                                },
                            ]
                        })(
                            <Radio.Group onChange={this.onTypeChange}>
                                {
                                    Object.keys(TYPE_NAMES).map(key=>
                                        <Radio key={key} value={key}>{TYPE_NAMES[key]}</Radio>
                                    )
                                }
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {
                        methodVisible?(
                            <Form.Item label="请求方法">
                                {getFieldDecorator('method', {
                                    initialValue: null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择资源类型',
                                        },
                                    ]
                                })(
                                    <Radio.Group>
                                        {
                                            Object.keys(METHOD_NAMES).map(key=>
                                                <Radio key={key} value={key}>{METHOD_NAMES[key]}</Radio>
                                            )
                                        }
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        ):null
                    }
                    <Form.Item label="状态">
                        {getFieldDecorator('state', {
                            initialValue: '1',
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
                    <Form.Item label="公有/私有">
                        {getFieldDecorator('is_public', {
                            initialValue: IS_PUBLIC.YES,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择是否公共资源',
                                },
                            ]
                        })(
                            <Radio.Group>
                                {Object.keys(IS_PUBLIC_NAMES).map(key=>
                                    <Radio key={key} value={key}>{IS_PUBLIC_NAMES[key]}</Radio>
                                )}
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create({name: 'resourceCreate'})(Create);