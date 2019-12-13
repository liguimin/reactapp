/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import findIndex from '../../../../../node_modules/lodash/findIndex';

const WithAuth = (Component,NoPermissionComponent)=> {
    class WrapComponent extends React.Component {
        constructor() {
            super();

            this.state={
                hasPermission:true
            };
        }

        componentDidMount=()=>{
            const index=findIndex(this.props.permissions.btnPermissions, (item)=> {
                return item.identify === this.props.auth;
            });

            if (index==-1){
                this.setState({
                    hasPermission:false
                });
            }
        };


        render=()=>{
            const {permission,dispatch,...props}=this.props;
            if (this.state.hasPermission){
                return  <Component {...props}/>;
            }else {
                return NoPermissionComponent===null?null:<NoPermissionComponent/>;
            }
        }
    }

    const mapStateToProps = (state)=> {
        return {
            permissions: state.permissionReducer.permissions
        }
    };

    return  connect(mapStateToProps,null)(WrapComponent);
};

export default WithAuth;