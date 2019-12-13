/**
 * Created by Administrator on 2019/10/21.
 */
import {Icon} from 'antd';
import React from 'react';

class FormLabel extends React.Component{
    constructor(){
        super();
    }

    render=()=>{
        const {align}=this.props;

        return(
            <span>加快结构</span>
        );
    }
}

export default FormLabel;