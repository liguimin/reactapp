/**
 * Created by Administrator on 2019/12/7.
 */
import React,{Fragment} from 'react';
import {Row,Col} from 'antd';
import commonCss from '../../static/css/common.module.less';
import Toggle from './Toggle';
import {CSSTransition} from 'react-transition-group';

class TableToolbar extends React.Component {
    constructor() {
        super();
        this.state = {
            showSearchForm: false,
            showSearchFormTs: false
        };
    }

    showFormTs = ()=> {
        this.setState({
            showSearchFormTs: true,
        });
    };

    hideFormTs = ()=> {
        console.log(233)
        this.setState({
            showSearchFormTs: false,
        });
    };

    showForm = ()=> {
        console.log(1212);
        this.setState({
            showSearchForm: true,
        });
    };

    hideForm = ()=> {
        this.setState({
            showSearchForm: false,
        });
    };

    render = ()=> {
        const {toolBtn:ToolBtn,simpleSearch:SimpleSearch,searchForm:SearchForm}=this.props;
        const {showSearchForm,showSearchFormTs}=this.state;
        return (
            <div className={commonCss.tableToolBox}>
                <div className={commonCss.toolbar}>
                    <Row type="flex" justify="space-around">
                        <Col span={4}>
                            {
                                ToolBtn ?
                                    <ToolBtn/>
                                    :
                                    null
                            }
                        </Col>
                        <Col span={4} offset={16}>
                            {
                                SimpleSearch ?
                                    <div className={showSearchForm?commonCss.displayNone:null}>
                                        <SimpleSearch/>
                                    </div>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                </div>

                {
                    SearchForm ?
                        <React.Fragment>
                            <CSSTransition
                                in={showSearchFormTs}
                                classNames='sc-form-ts'
                                timeout={{enter:700,exit:700}}
                                onEnter={this.showForm}
                                onExited={this.hideForm}
                                appear={true}
                            >
                                <div className={`${commonCss.tableToolBoxSearch}`}>
                                    <SearchForm/>
                                </div>
                            </CSSTransition>
                            <Toggle onShow={this.showFormTs} onHide={this.hideFormTs}/>
                        </React.Fragment>
                        :
                        null
                }
            </div>
        );
    }
}


export default TableToolbar;