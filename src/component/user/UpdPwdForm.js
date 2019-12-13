/**
 * Created by Administrator on 2019/7/5.
 */
import React from 'react';
import { Modal, Button,Form, Input } from 'antd';

import Axios from '../../component/axios/Axios';
import moment from 'moment';


class UpdPwdForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editData: '',
            isloading: true
        };
    }

    //修改用户信息
    doUpdate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    Axios.put(`/v1/user/${this.props.id}/pwd`, {
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

    render = ()=> {
        const formLayout = 'horizontal';

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };

        const {getFieldDecorator}=this.props.form;

        let {editData}=this.state;
        return (
            <div>
                <Form layout={formLayout} {...formItemLayout}>
                    <Form.Item label="密码">
                        {getFieldDecorator('pwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码',
                                },
                            ]
                        })(
                            <Input.Password placeholder="请输入密码"/>
                        )}
                    </Form.Item>
                    <Form.Item label="密码确认">
                        {getFieldDecorator('repwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码确认',
                                },
                            ]
                        })(
                            <Input.Password placeholder="请再次输入密码"/>
                        )}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(UpdPwdForm);