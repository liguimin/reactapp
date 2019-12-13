/**
 * Created by Administrator on 2019/9/23.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Transfer, Table,Input,Button,Row,Col,Modal,message} from 'antd';
import difference from 'lodash/difference';
import uniqBy from 'lodash/uniqBy';

import Axios from '../axios/Axios';
import ResourceCreate from './Create';
import {TYPES,TYPE_NAMES,METHOD_NAMES} from '../common/header/resource';

const columns = [
/*    {
        dataIndex: 'id',
        title: 'ID',
    },*/
    {
        dataIndex: 'name',
        title: '名称',
        width:150
    },
    {
        dataIndex: 'identify',
        title: '标识',
        width:100,
        render:(text, record, index)=>{
            return(
                <div>
                    <span style={{color:'orangered',marginRight:'5px'}}>{METHOD_NAMES[record.method]}</span> {record.identify}
                </div>
            );
        }
    },
    {
        dataIndex: 'state',
        title: '状态',
        width:100,
        render:(text, record, index)=>{
            return(
                <div>
                    {record.state==1?(
                    <div style={{color:'green'}}>启用</div>
                    ):(
                    <div style={{color:'red'}}>禁用</div>
                    )}
                </div>
            );
        }
    },
];

class TableTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            totalData: [],
            pagination: {
                page: 1,
                pageSize: 20,
                total: 0
            },
            loading: false,

            resourceCreateVisible:false,
            resourceCreateBtnLoading:false
        };
    }

    componentDidMount() {
        this.getSourceList({},true);
    }

    //获取资源数据
    getSourceList = ({...searchData}={},first_load=false)=> {
        this.setState({loading: true});
        const {page,pageSize}=this.state.pagination;
        const {permissionId}=this.props;

        Axios.get('/v1/resource', {
            params: {
                page: page,
                page_size: pageSize,
                permission_id:permissionId&&first_load?permissionId:0,     //首次加载且是修改权限，则后台的data需要将已选的资源列表全部返回
                ...searchData
            },
            msg: false
        }).then(ret=> {
            this.setState({
                data: ret.data.data,
                totalData: uniqBy(this.state.totalData.concat(ret.data.data.concat(ret.data.h_data)), 'id'),
                pagination: {
                    ...this.state.pagination,
                    total: ret.data.count
                },
                loading: false
            });
        });
    };

    //显示添加资源的界面
    showResourceCreate=()=>{
        this.setState({
            resourceCreateVisible:true
        });
    };

    //关闭添加资源的界面
    cancelResourceCreate=()=>{
        this.setState({
            resourceCreateVisible:false
        });
    };

    //执行添加资源
    doResourceCreate=()=>{
        this.setState({
            resourceCreateBtnLoading: true
        });
        this.resourceCreateForm.doCreate().then((ret)=> {
            this.setState({
                resourceCreateBtnLoading: false,
                resourceCreateVisible: false,
                totalData: uniqBy(this.state.totalData.concat(ret.data.insert_data), 'id'),
            },()=>{
                this.getSourceList();
             /*   this.props.onChange(this.props.targetKeys.concat(ret.data.insert_data.id),'right',[],()=>{
                    this.getSourceList();
                });*/
            });
            message.success('创建成功', 3);
        }).catch((e)=> {
            this.setState({
                resourceCreateBtnLoading: false
            });
        });
    };

    //搜索左侧资源列表
    onLeftTableSearch=(value)=>{
        this.getSourceList({
            name:value
        });
    };

    render() {
        const { targetKeys } = this.props;
        const { data, pagination, totalData, loading,resourceCreateVisible,resourceCreateBtnLoading } = this.state;
        const {Search}=Input;

        return (
            <Transfer {...this.props} dataSource={data} rowKey={record => record.id} locale={{itemUnit:'项',itemsUnit:'项'}}>
                {({
                    direction,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                    }) => {
                    const rowSelection = {
                        getCheckboxProps: item => ({
                            disabled: listDisabled || item.disabled,
                        }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({ id }) => id);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ id }, selected) {
                            //console.log(id);
                            //console.log(selected);
                            onItemSelect(id, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };

                    const handleTableChange = paginationObj => {
                        if (direction === 'left') {
                            const pager = {...this.state.pagination};
                            pager.page = paginationObj.current;
                            this.setState({
                                pagination: pager,
                            }, ()=> {
                                this.getSourceList();
                            });
                        }
                    };

                    const rightData = totalData.filter(item => targetKeys.includes(item.id));

                    const leftData = data.map(item => ({
                        ...item,
                        disabled: targetKeys.includes(item.id),
                    }));

                    return (
                        <div id="ts">
                            {
                                direction==='left'?(
                                    <Row >
                                        <Col span={16}>
                                            <Search style={{marginBottom:'10px'}} placeholder="请输入资源名称"
                                                    onSearch={this.onLeftTableSearch} enterButton/>
                                        </Col>
                                        <Col span={8} style={{marginTop:'-1px'}}>
                                            <Button type="primary" icon="plus" style={{float:'right'}} onClick={this.showResourceCreate}>
                                                添加
                                            </Button>
                                        </Col>
                                    </Row>
                                ):null
                            }
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                loading={direction === 'left' && loading}
                                dataSource={direction === 'left' ? leftData : rightData}
                                size="small"
                                onRow={({ id, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled) return;
                                    onItemSelect(id, !listSelectedKeys.includes(id));
                                 },
                                 })}
                                onChange={handleTableChange}
                                pagination={direction === 'left' ? pagination : false}
                                scroll={{y:300}}
                            />



                            <Modal
                                title="添加资源"
                                okText="确认提交"
                                cancelText="取消"
                                visible={resourceCreateVisible}
                                destroyOnClose={true}
                                onCancel={this.cancelResourceCreate}
                                bodyStyle={{maxHeight:'60vh',overflow:'auto'}}
                                footer={[
                       <Button key="back" onClick={this.cancelResourceCreate}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" loading={resourceCreateBtnLoading} onClick={this.doResourceCreate}>
                           提交
                       </Button>,
                    ]}
                            >
                                <ResourceCreate wrappedComponentRef={(form) => this.resourceCreateForm = form}/>
                            </Modal>
                        </div>
                    );
                }}
            </Transfer>
        );
    }
}

export  default TableTransfer;
