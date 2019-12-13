/**
 * Created by Administrator on 2019/7/20.
 */
import React from 'react';
import {Drawer,Skeleton,Descriptions,Row,Col,Avatar,Spin,Icon,Tag,Popover  } from 'antd';

import Axios from '../axios/Axios';

import  '../../static/css/userinfo.mudule.css';
class Userinfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            spinning: true,
            userinfo: {}
        }
    }

    //切换抽屉时动画结束后的回调
    afterVisibleChange = (visible)=> {
        if (visible) {
            this.getUserInfo();
        }
    };

    //查找用户信息
    getUserInfo = ()=> {
        this.setState({
            spinning: true
        }, (ret)=> {
            Axios.get('/v1/user/userinfo', {
                msg: false
            }).then((ret)=> {
                console.log(ret);
                this.setState({
                    userinfo: ret.data.userinfo,
                    spinning: false
                });
            });
        });
    };

    //显示抽屉
    show = ()=> {
        this.setState({
            visible: true
        });
    };

    //关闭抽屉
    hide = ()=> {
        this.setState({
            visible: false,
            spinning: true
        });
    };

    render = ()=> {

        const DescriptionItem = ({ title, content,icon }) => (
            <div
                style={{
      fontSize: 14,
      lineHeight: '15px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
            >
                <p
                    style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.7)',
      }}
                >
                    {title}:
                </p>
                {content}
            </div>
        );

        const {userinfo}=this.state;

        const bigAvatar=(
            <div>
                <img src={userinfo.avatar} style={{maxWidth:'400px'}}/>
            </div>
        );

        return (
            <Drawer

                placement="right"
                closable={false}
                onClose={this.hide}
                visible={this.state.visible}
                afterVisibleChange={this.afterVisibleChange}
                width="500"
                keyboard={true}
                destroyOnClose={true}
            >

                {
                    !this.state.spinning ?
                        <div>
                            <div style={{textAlign:'center'}}>
                                <Popover content={bigAvatar} title="头像" trigger="hover" placement="bottomRight">
                                    <Avatar src={userinfo.avatar} size={104}/>
                                </Popover>
                                <div
                                    style={{fontSize:'20px',fontWeight:'500',color:'rgba(0,0,0,.85)',marginTop:'15px'}}>{userinfo.username}</div>
                                <div>{userinfo.remarks}</div>
                            </div>

                            <div style={{padding:'20px 0',borderBottom:'dashed 1px rgba(0,0,0,.2)'}}>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <DescriptionItem icon="user" title="用户名" content={userinfo.username}/>
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem icon="" title="姓名" content={userinfo.name}/>
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem icon="user" title="生日" content={userinfo.birthday}/>
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem title="手机号" content={userinfo.mobile}/>
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem icon="user" title="创建时间" content={userinfo.create_time}/>
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem title="修改时间" content={userinfo.update_time}/>
                                    </Col>
                                </Row>
                            </div>

                            <div className={'li-tag'}>
                                <Row gutter={20}>
                                    <Col span={24} style={{marginBottom:'15px',color:'rgba(0,0,0,1)'}}>
                                        标签
                                    </Col>
                                </Row>
                                <Tag>牛逼</Tag>
                                <Tag>666</Tag>
                                <Tag>天选之子</Tag>
                                <Tag>百年难得一遇</Tag>
                                <Tag>叼得一批</Tag>
                                <Tag>前无古人，后无来者</Tag>
                                <Tag>时代楷模</Tag>
                                <Tag style={{ background: '#fff', borderStyle: 'dashed' }}>
                                    <Icon type="plus"/> 添加
                                </Tag>
                            </div>

                        </div>
                        :
                        <div>
                            <div style={{textAlign:'center'}}>
                                <Avatar src="" size={104}/>
                                <div
                                    style={{fontSize:'20px',fontWeight:'500',color:'rgba(0,0,0,.85)',marginTop:'15px'}}></div>
                                <Skeleton paragraph={{rows:5}}/>
                            </div>
                            <Skeleton/>
                        </div>
                }

            </Drawer>
        );
    }
}

export default Userinfo;