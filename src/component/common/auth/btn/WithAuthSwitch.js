/**
 * Created by Administrator on 2019/10/15.
 */
import React from 'react';
import WithAuth from './WithAuth';

const WithAuthSwitch = (SwitchComponent)=> {
    class WrapComponent extends React.Component {
        constructor(){
            super();
        }

        render=()=>{
            const {dispatch,...props}=this.props;
            const NoPermissionSwitch=()=><SwitchComponent {...props} disabled/>;
            const AuthSwitch=WithAuth(SwitchComponent,NoPermissionSwitch);
            return <AuthSwitch {...props}/>;
        }
    }

    return WrapComponent;
};

export default WithAuthSwitch;