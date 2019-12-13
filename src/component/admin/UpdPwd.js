/**
 * Created by Administrator on 2019/7/18.
 */
import React from 'react';
import {Modal, Button,Form, Input} from 'antd';

import {formLayout} from '../common/Common';
import Axios from '../axios/Axios';
class UpdPwd extends React.Component {
    constructor() {
        super();
    }

    //修改密码
    doUpdate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    Axios.put(`/v1/user/pwd`, {
                        data: values,
                        msg: '正在提交',
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

    render = ()=> {
        const {getFieldDecorator}=this.props.form;
        return (
            <div>
                <Form {...formLayout}>
                    <Form.Item label="密码">
                        {getFieldDecorator('pwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码',
                                },
                            ]
                        })(<Input.Password placeholder="请输入密码"/>)}
                    </Form.Item>
                    <Form.Item label="密码确认">
                        {getFieldDecorator('repwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码确认',
                                },
                            ]
                        })(<Input.Password placeholder="请输入密码确认"/>)}
                    </Form.Item>
                </Form>
            </div>
        );
    }

}

export default Form.create({name: 'updPwd'})(UpdPwd);