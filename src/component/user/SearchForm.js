/**
 * Created by Administrator on 2019/7/8.
 */
import  React,{Fragment} from 'react';
import {Form,Input,Button,Row,Col,DatePicker,Select,Upload} from 'antd';


import {searchFormLayout,searchFormColConfig,searchFormConfig} from '../../component/common/Common';
import FormLabel from '../common/FormLabel';
import ToggleBtn from '../common/auth/btn/ToggleBtn';


class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }

    //重置搜索条件
    handleReset = ()=> {
        this.props.handleSearchReset();
        this.props.form.resetFields();
    };

    //点击提交触发
    handleSubmit = ()=> {
        const values = this.props.form.getFieldsValue();
        if ('birthday' in values && values['birthday']) {
            values['birthday'] = values['birthday'].format('YYYY-MM-DD');
        } else {
            values['birthday'] = '';
        }
        if ('s_create_time' in values && values['s_create_time']) {
            values['s_create_time'] = values['s_create_time'].format('YYYY-MM-DD');
        } else {
            values['s_create_time'] = '';
        }
        if ('e_create_time' in values && values['e_create_time']) {
            values['e_create_time'] = values['e_create_time'].format('YYYY-MM-DD');
        } else {
            values['e_create_time'] = '';
        }

        this.props.handleSearch(values);
    };

    //展开、收起部分搜索框
    toggle = ()=> {
        this.setState({
            isShow: !this.state.isShow
        });
    };

    render = ()=> {
        const {getFieldDecorator}=this.props.form;
        const {Option}=Select;
        const {isShow}=this.state;
        return (
            <div>
                <Form {...searchFormConfig}>
                    <Row gutter={24}>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="用户名" {...searchFormLayout}>
                                {getFieldDecorator('username', {initialValue: ''})(<Input placeholder="请输入用户名"/>)}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="姓名"  {...searchFormLayout}>
                                {getFieldDecorator('name', {initialValue: ''})(<Input placeholder="请输入姓名"/>)}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="手机号" {...searchFormLayout}>
                                {getFieldDecorator('mobile', {initialValue: ''})(<Input
                                    placeholder="请输入手机号"/>)}
                            </Form.Item>
                        </Col>

                        <Col {...searchFormColConfig}>
                            <Form.Item label="生日" {...searchFormLayout}>
                                {getFieldDecorator('birthday', {initialValue: null})(<DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择日期"
                                    style={{width:'100%'}}/>)}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="状态" {...searchFormLayout}>
                                {getFieldDecorator('state', {
                                    initialValue: ''
                                })(
                                    <Select>
                                        <Option value="">全部</Option>
                                        <Option value="1">启用</Option>
                                        <Option value="0">禁用</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="创建时间" {...searchFormLayout}>
                                <Row gutter={10}>

                                    <Col span={12}>
                                        <Form.Item style={{marginBottom:'0px'}}>
                                            {getFieldDecorator('s_create_time', {initialValue: null})(
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    placeholder="开始"
                                                    style={{width:'100%'}}/>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item style={{marginBottom:'0px'}}>
                                            {getFieldDecorator('e_create_time', {initialValue: null})(
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    placeholder="结束"
                                                    style={{width:'100%'}}/>)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>


                        <Col {...searchFormColConfig}>
                            <Form.Item >
                                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleSubmit}>
                                    搜索
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                                {/*<ToggleBtn isShow={isShow} hideText="展开" showText="收起" style={{marginLeft:'10px'}}
                                           onClick={this.toggle}/>*/}
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </div>
        )
    }
}

export default Form.create()(SearchForm);