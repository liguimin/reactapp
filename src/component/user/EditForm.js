/**
 * Created by Administrator on 2019/7/5.
 */
import React from 'react';
import { Modal, Button,Form, Input, Radio,Switch,DatePicker,Spin,Upload,Icon,Select } from 'antd';

import Axios from '../../component/axios/Axios';
import {getBase64} from '../../component/common/Fuc';
import moment from 'moment';


class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editData: '',
            isloading: true,
            avatar:'',
            priviewImg:'',
            avatarUploadLoading:false,
            roleList:[],
            checkedRole:[]
        };
    }

    componentWillMount = ()=> {
        this.getEditData();
    };

    //查询信息
    getEditData = ()=> {
        Axios.get(`/v1/user/${this.props.id}/edit`, {
            msg: false
        }).then((ret)=> {
            this.setState({
                editData: ret.data.data,
                isloading: false,
                priviewImg:ret.data.data.preview_url,
                avatar:ret.data.data.avatar,
                roleList:ret.data.roleList,
                checkedRole:ret.data.checkedRole
            });
        });
    };

    //上传头像前的钩子
    beforeUploadAvatar = file=> {
        this.setState({
            avatarUploadLoading:true,
            avatar:file
        },()=>{
            //执行上传
            Axios.post('/v1/user/avatar',{
                transformRequest: [ (data)=> {
                    // 对 data 进行任意转换处理
                    let formData=new FormData();
                    formData.append('avatar',file);
                    return formData;
                }]
            }).then((ret)=>{
                this.setState({
                    avatarUploadLoading:false,
                    priviewImg:ret.data.preview_url,
                    avatar:ret.data.img_url
                });
            }).catch(()=>{
                this.setState({
                    avatarUploadLoading:false,
                });
            });
        });

        return false;
    };

    //修改用户信息
    doUpdate = ()=> {
        return new Promise((resolve, reject)=> {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    if (values['birthday']) {
                        values['birthday'] = values['birthday'].format('YYYY-MM-DD');
                    }
                    values['avatar']=this.state.avatar;
                    values['re_checked_role']=this.state.checkedRole;
                    Axios.put(`/v1/user/${this.props.id}`, {
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
        const formLayout = 'horizontal';

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };

        const {getFieldDecorator}=this.props.form;
        const { TextArea } = Input;
        const {Option}=Select;

        let {editData,roleList,checkedRole}=this.state;
        return (
            <div>
                <Spin tip="Loading..." spinning={this.state.isloading}>
                    <Form layout={formLayout} {...formItemLayout}>
                        <Form.Item label="状态">
                            {getFieldDecorator('state', {
                                initialValue: this.state.isloading?'':editData.state,
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
                        <Form.Item label="头像">
                            {getFieldDecorator('avatar', {
                                initialValue:this.state.isloading?'':editData.avatar,
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
                                    {this.state.priviewImg ? <img src={this.state.priviewImg} alt="avatar" style={{width:'100%'}}/> : (
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
                                initialValue: checkedRole
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择角色（可多选）"
                                >
                                    {
                                        roleList.map((item,key)=>(
                                            <Option key={key} value={item.id}>{item.name}</Option>
                                        ))

                                    }
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.isloading?'':editData.name
                            })(<Input placeholder="请输入姓名"/>)}
                        </Form.Item>
                        <Form.Item label="生日">
                            {getFieldDecorator('birthday', {
                                initialValue: this.state.isloading||!editData.birthday?null:moment(editData.birthday, 'YYYY-MM-DD')
                            })(<DatePicker placeholder="请选择生日"/>)}
                        </Form.Item>
                        <Form.Item label="手机号">
                            {getFieldDecorator('mobile', {
                                initialValue:this.state.isloading?'':editData.mobile
                            })(<Input placeholder="请输入手机号"/>)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remarks', {
                                initialValue: this.state.isloading?'':editData.remarks
                            })(<TextArea rows="4" placeholder="请输入备注"/>)}
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}

export default Form.create()(EditForm);