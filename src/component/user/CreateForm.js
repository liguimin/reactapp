/**
 * Created by Administrator on 2019/7/2.
 */
/**
 * Created by Administrator on 2019/7/1.
 */
import React from 'react';
import { Modal, Button,Form, Input, Radio,Switch,DatePicker,Upload,Icon,Select  } from 'antd';

import Axios from '../../component/axios/Axios';
import {getBase64} from '../../component/common/Fuc';
import qs from 'qs';

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            priviewImg: '',
            roleList: []
        };
    }

    componentDidMount = ()=> {
        this.getInfo();
    };

    //获取表单信息
    getInfo = ()=> {
        Axios.get('/v1/user/create').then((ret)=> {
            this.setState({
                roleList: ret.data.roleList
            });
        });
    };

    handleSubmit = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    if (values['birthday']) {
                        values['birthday'] = values['birthday'].format('YYYY-MM-DD');
                    }
                    values['avatar'] = this.state.avatar;

                    Axios.post('/v1/user', {
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

    //上传头像前的钩子
    beforeUploadAvatar = file=> {
        this.setState({
            avatarUploadLoading: true,
            avatar: file
        }, ()=> {
            //执行上传
            Axios.post('/v1/user/avatar', {
                transformRequest: [(data)=> {
                    // 对 data 进行任意转换处理
                    let formData = new FormData();
                    formData.append('avatar', file);
                    return formData;
                }]
            }).then((ret)=> {
                this.setState({
                    avatarUploadLoading: false,
                    priviewImg: ret.data.preview_url,
                    avatar: ret.data.img_url
                });
            }).catch(()=> {
                this.setState({
                    avatarUploadLoading: false,
                });
            });
        });

        return false;
    };


    render = ()=> {
        const formLayout = 'horizontal';

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };

        const {getFieldDecorator}=this.props.form;
        const { TextArea } = Input;
        const {Option}=Select;

        return (
            <div>
                <Form layout={formLayout} {...formItemLayout}>
                    <Form.Item label="用户名">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名',
                                },
                            ]
                        })(<Input placeholder="请输入用户名"/>)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('pwd', {
                            initialValue: '',
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
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码确认',
                                },
                            ]
                        })(<Input.Password placeholder="请再次输入密码"/>)}
                    </Form.Item>
                    <Form.Item label="状态">
                        {getFieldDecorator('state', {
                            initialValue: '',
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
                    <Form.Item label="头像">
                        {getFieldDecorator('avatar', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请上传头像',
                                },
                            ]
                        })(
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={this.beforeUploadAvatar}
                                onChange={this.onUplaodAvatarChange}
                            >
                                {this.state.priviewImg ?
                                    <img src={this.state.priviewImg} alt="avatar" style={{width:'100%'}}/> : (
                                    <div>
                                        <Icon type={this.state.avatarUploadLoading ? 'loading' : 'plus'}/>
                                        <div className="ant-upload-text">Upload</div>
                                    </div>
                                )}
                            </Upload>
                        )}
                    </Form.Item>

                    <Form.Item label="角色">
                        {getFieldDecorator('checked_role', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择角色',
                                },
                            ],
                            initialValue: []
                        })(
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="请选择角色（可多选）"
                            >
                                {
                                    this.state.roleList.map((item,key)=>(
                                            <Option key={key} value={item.id}>{item.name}</Option>
                                    ))

                                }
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="姓名">
                        {getFieldDecorator('name', {
                            initialValue: ''
                        })(<Input placeholder="请输入姓名"/>)}
                    </Form.Item>
                    <Form.Item label="生日">
                        {getFieldDecorator('birthday', {
                            initialValue: ''
                        })(<DatePicker placeholder="请选择生日"/>)}
                    </Form.Item>
                    <Form.Item label="手机号">
                        {getFieldDecorator('mobile', {
                            initialValue: ''
                        })(<Input placeholder="请输入手机号"/>)}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remarks', {
                            initialValue: ''
                        })(<TextArea rows="4" placeholder="请输入备注"/>)}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default Form.create({name: 'search'})(CreateForm);
