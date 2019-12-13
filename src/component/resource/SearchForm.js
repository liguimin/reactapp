/**
 * Created by Administrator on 2019/7/8.
 */
import  React,{Fragment} from 'react';
import {Form,Input,Button,Row,Col,DatePicker,Select,Upload} from 'antd';


import {searchFormLayout,searchFormColConfig,searchFormConfig} from '../../component/common/Common';
import {TYPES,TYPE_NAMES,METHODS,METHOD_NAMES,IS_PUBLIC,IS_PUBLIC_NAMES} from '../common/header/resource';
import ToggleBtn from '../common/auth/btn/ToggleBtn';


class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isShow:false
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
                            <Form.Item label="权限名称" {...searchFormLayout}>
                                {getFieldDecorator('name', {initialValue: ''})(<Input placeholder="请输入权限名称"/>)}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="资源标识"  {...searchFormLayout}>
                                {getFieldDecorator('identify', {initialValue: ''})(<Input placeholder="请输入资源标识"/>)}
                            </Form.Item>
                        </Col>
                        <Col {...searchFormColConfig}>
                            <Form.Item label="类型" {...searchFormLayout}>
                                {getFieldDecorator('type', {
                                    initialValue: ''
                                })(
                                    <Select>
                                        <Option value="">全部</Option>
                                        {Object.keys(TYPE_NAMES).map((key)=>
                                            <Option key={key} value={key}>{TYPE_NAMES[key]}</Option>
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        {
                            isShow?(
                                <Fragment>
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
                                        <Form.Item label="请求方法" {...searchFormLayout}>
                                            {getFieldDecorator('method', {
                                                initialValue: ''
                                            })(
                                                <Select>
                                                    <Option value="">全部</Option>
                                                    {Object.keys(METHOD_NAMES).map((key)=>
                                                        <Option key={key} value={key}>{METHOD_NAMES[key]}</Option>
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col {...searchFormColConfig}>
                                        <Form.Item label="是否公共" {...searchFormLayout}>
                                            {getFieldDecorator('is_public', {
                                                initialValue: ''
                                            })(
                                                <Select>
                                                    <Option value="">全部</Option>
                                                    {Object.keys(IS_PUBLIC_NAMES).map((key)=>
                                                        <Option key={key} value={key}>{IS_PUBLIC_NAMES[key]}</Option>
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col {...searchFormColConfig}>
                                        <Form.Item label="创建时间" {...searchFormLayout}>
                                            <Row gutter={10}>

                                                <Col span={12}>
                                                    <Form.Item style={{marginBottom:'0px'}}>
                                                        {getFieldDecorator('s_create_time', {initialValue: null})(<DatePicker
                                                            format="YYYY-MM-DD"
                                                            placeholder="开始"
                                                            style={{width:'100%'}}/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item style={{marginBottom:'0px'}}>
                                                        {getFieldDecorator('e_create_time', {initialValue: null})(<DatePicker
                                                            format="YYYY-MM-DD"
                                                            placeholder="结束"
                                                            style={{width:'100%'}}/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>

                                </Fragment>
                            ):null
                        }
                        <Col {...searchFormColConfig}>
                            <Form.Item >
                                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleSubmit}>
                                    搜索
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                                <ToggleBtn isShow={isShow} hideText="展开" showText="收起" style={{marginLeft:'10px'}}
                                           onClick={this.toggle}/>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </div>
        )
    }
}

export default Form.create()(SearchForm);