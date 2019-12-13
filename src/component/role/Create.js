/**
 * Created by Administrator on 2019/7/25.
 */
import React from 'react';
import {Button,Form, Input,Icon,Radio } from 'antd';

import Axios from '../../component/axios/Axios';
import {formLayout} from '../common/Common';

class Create extends React.Component {

    constructor(props) {
        super(props);
    }

    //添加
    doCreate=()=>{
        return new Promise((resolve,reject)=>{
            this.props.form.validateFields((err, values) => {
                if (!err){
                    Axios.post('/v1/role',{
                        data:values,
                        msg:'正在提交'
                    }).then((ret)=>{
                        resolve(ret);
                    }).catch((e)=>{
                        reject(e);
                    });
                }else {
                    reject(err);
                }
            });

        });
    };

    render = ()=> {
        const {getFieldDecorator}=this.props.form;

        return (
            <div>
                <Form {...formLayout}>
                    <Form.Item label="角色名称">
                        {
                            getFieldDecorator('name',{
                                rules:[
                                    {
                                        required: true,
                                        message: '请输入角色名称',
                                    }
                                ]
                            })(<Input placeholder="请输入角色名称"/>)
                        }
                    </Form.Item>
                    <Form.Item label="排序">
                        {
                            getFieldDecorator('sort_num',{
                                initialValue:0,
                                rules:[
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
                            initialValue:1,
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
                </Form>
            </div>
        );
    }
}

export default Form.create({name:'create'})(Create);