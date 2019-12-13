/**
 * Created by Administrator on 2019/7/29.
 */
import React from 'react';
import {Button,Form, Input,Icon,Radio,Spin } from 'antd';

import Axios from '../../component/axios/Axios';
import {formLayout} from '../common/Common';
import {objIsEmpty} from '../common/Fuc';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                name: '',
                state: ''
            },
            loading: true
        };
    }

    componentWillMount = ()=> {
        this.getInfo();
    };

    //查修改信息
    getInfo = ()=> {
        const {id}=this.props;
        Axios.get(`/v1/role/${id}/edit`).then((ret)=> {
            this.setState({
                data: ret.data,
                loading: false
            });
        });
    };

    //执行修改
    doUpdate=()=>{
        return new Promise((resolve,reject)=>{
            this.props.form.validateFields((err,values)=>{
                if (!err){
                    Axios.put(`/v1/role/${this.props.id}`,{
                        msg:'正在提交...',
                        data:values
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

        const {name,state,sort_num}=this.state.data;

        return (
            <div>
                {
                    <Spin tip="Loading..." spinning={this.state.loading}>
                        <Form {...formLayout}>
                            <Form.Item label="角色名称">
                                {
                                    getFieldDecorator('name', {
                                        initialValue: name ? name : null,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入角色名称'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入角色名称"/>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="排序">
                                {
                                    getFieldDecorator('sort_num',{
                                        initialValue:sort_num ? sort_num : 0,
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
                                    initialValue: state ? state : null,
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
                        </Form>
                    </Spin>

                }
            </div>
        );
    };
}

export default  Form.create({name: 'roleEdit'})(Edit);