/**
 * Created by Administrator on 2019/12/6.
 */
import React from 'react';
import loadingImg from '../../static/images/loading/loading.jpg';

class Loading extends React.Component{
    render=()=>{
        return (
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'#fff',zIndex:99999}}>
                <img src={loadingImg} style={{height:'400px',position:'absolute',top:'50%',left:'50%',transform:"translate(-50%,-50%)"}}/>
            </div>
        );
    }
}

export default Loading;