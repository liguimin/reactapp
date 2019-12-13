/**
 * Created by Administrator on 2019/5/5.
 */
import React from 'react';
import ReactDom from 'react-dom';

class Home extends React.Component{

    componentWillUnmount(){
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return;
        }
    }

    render(){
        return(
            <div>主页，内容暂定</div>
        );
    }
}

export default Home;