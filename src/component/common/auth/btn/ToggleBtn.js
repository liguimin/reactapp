/**
 * Created by Administrator on 2019/10/21.
 */
import React from 'react';
import {Icon} from 'antd';

class ToggleBtn extends React.Component{
    constructor(){
        super();
    }

    render=()=>{
        const {isShow,showText,hideText,...props}=this.props;
        const text=isShow?showText:hideText;
        const iconType=isShow?'up':'down';
        return (
            <a href="javascript:;" {...props}>
                {text}
                <Icon type={iconType}/>
            </a>
        );
    }
}

export default ToggleBtn;