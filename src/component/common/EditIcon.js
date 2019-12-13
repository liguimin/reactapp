/**
 * Created by Administrator on 2019/9/27.
 */
import {Icon} from 'antd';
import React from 'react';

class EditIcon extends React.Component{
    constructor(props){
        super(props);
    }

    render=()=>{
        return(
            <Icon type="edit"  {...{...this.props,style: {color:'#1890ff',cursor:'pointer',...this.props.style}}}/>
        );
    }
}

export default EditIcon;