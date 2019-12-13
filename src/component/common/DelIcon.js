/**
 * Created by Administrator on 2019/9/27.
 */
import {Icon} from 'antd';
import React from 'react';

class DelIcon extends React.Component{
    constructor(props){
        super(props);
    }

    render=()=>{
        return(
            <Icon type="delete"  {...{...this.props,style: {color:'rgb(255, 0, 0)',cursor:'pointer',...this.props.style}}}/>
        );
    }
}

export default DelIcon;