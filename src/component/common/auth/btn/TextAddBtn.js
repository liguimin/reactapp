/**
 * Created by Administrator on 2019/9/27.
 */
import {Icon} from 'antd';
import React from 'react';

class TextAddBtn extends React.Component{
    constructor(props){
        super(props);
    }

    render=()=>{
        const {text,dispatch,...props}=this.props;
        return(
            <a href="javascript:;"
                {...{...props,style: {fontSize:'14px',fontWeight:'500',...this.props.style}}}>
                <Icon type="plus"/>{text}
            </a>
        );
    }
}

export default TextAddBtn;