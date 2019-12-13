/**
 * Created by Administrator on 2019/10/17.
 */
/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import WithAuth from './WithAuth';

const WithAuthTextBtn = (TextBtnComponent)=> {
    const AuthTextBtn=WithAuth(TextBtnComponent,null);
    class WrapComponent extends React.Component {
        constructor(){
            super();
        }

        render=()=>{
            const {dispatch,...props}=this.props;
            return <AuthTextBtn {...props}/>;
        }
    }

    return WrapComponent;
};

export default WithAuthTextBtn;