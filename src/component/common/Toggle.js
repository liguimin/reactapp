/**
 * Created by Administrator on 2019/12/8.
 */
import React from 'react';
import {Icon} from 'antd';
import commonStyle from '../../static/css/common.module.less';

class Toggle extends React.Component{
    constructor(){
        super();
        this.state={
            show:false,
            showText:false,
        }
    }

    //点击隐藏/显示
    onClick=()=>{
        this.setState({
            show:!this.state.show
        },()=>{
            if (this.state.show){
                this.props.onShow();
            }else {
                this.props.onHide();
            }
        });
    };

    //展开/收起的文字是否显示
    toggleText=()=>{
        this.setState({
            showText:!this.state.showText
        });
    };

    render=()=>{
        const{show,showText}=this.state;
        return(
            <div onClick={this.onClick} className={`${commonStyle.toggleBox} ${showText?commonStyle.toggleBoxActive:null}`} onMouseEnter ={this.toggleText} onMouseLeave={this.toggleText}>
                <Icon type={show?'caret-up':'caret-down'} style={{fontSize:'1px',marginTop:'-7px'}}/>
                {
                    showText?
                        <div>{show?'收起':'展开'}</div>
                        :null
                }
            </div>
        );
    }
}

export default Toggle;
