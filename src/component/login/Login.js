/**
 * Created by Administrator on 2019/5/9.
 */
import React from 'react';
import ReactDom from 'react-dom';
import Axios from '../axios/Axios';
import {Form,Input,Icon,Button,Checkbox} from 'antd';

import loginStyle from '../../static/css/login.module.less';

import store from '../../util/store';

class LoginComponent extends React.Component {
    constructor() {
        super();
        this.state={
            loading:false
        };
    }

    login = e=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading:true
                });
                Axios.post('/v1/session',{data:values,reqFuc: function (config) {
                    return config;
                }}).then((ret)=> {
                    store.set('token',ret.data.token);
                    this.setState({
                        loading:false
                    });
                    this.props.history.push('/admin/home');
                }).catch((err)=>{
                    this.setState({
                        loading:false
                    });
                });
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={loginStyle.app}>
                <div className={loginStyle.box}>
                    <div className={loginStyle.loginBox}>
                        <div className={loginStyle.logoTitle}>
                            后台管理系统
                        </div>
                        <div className={loginStyle.secTitle}>
                            测试后台
                        </div>
                        <Form onSubmit={this.login} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('pwd', {
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input.Password  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                                )}
                            </Form.Item>
                            <Form.Item style={{marginTop:'30px'}}>
                                <Button type="primary" block htmlType="submit" loading={this.state.loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* <div style={{textAlign:'center',color:'#8590a6'}}>
                            <span>二维码登录</span>.<span>海外手机登录.</span><span>社交账号登录</span>
                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

const Login = Form.create({ name: 'normal_login' })(LoginComponent);

export default Login;