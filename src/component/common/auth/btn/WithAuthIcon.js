/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import WithAuth from './WithAuth';

const WithAuthIcon = (IconComponent)=> {
    const AuthIcon=WithAuth(IconComponent,null);
    class WrapComponent extends React.Component {
        constructor(){
            super();
        }

        render=()=>{
            const {dispatch,...props}=this.props;
            return <AuthIcon {...props}/>;
        }
    }

    return WrapComponent;
};

export default WithAuthIcon;