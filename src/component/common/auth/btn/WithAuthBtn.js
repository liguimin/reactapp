/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import WithAuth from './WithAuth';

const WithAuthBtn = (BtnComponent)=> {
    const AuthBtn=WithAuth(BtnComponent,null);
    class WrapComponent extends React.Component {
        constructor(){
            super();
        }

        render=()=>{
            const {dispatch,...props}=this.props;
            return <AuthBtn {...props}/>;
        }
    }

    return WrapComponent;
};

export default WithAuthBtn;