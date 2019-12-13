/**
 * Created by Administrator on 2019/5/9.
 */
/**
 * Created by Administrator on 2019/5/5.
 */
import React from 'react';
import ReactDom from 'react-dom';
import {Result,Button} from 'antd';

class Page_500 extends React.Component {

    backToHome = ()=> {
        this.props.history.push('/');
    };

    render() {
        return (
            <div>
                <Result
                    status="500"
                    title="500"
                    subTitle="页面出错了"
                    extra={<Button type="primary" onClick={this.backToHome}>返回首页</Button>}
                />
            </div>
        );
    }
}

export default Page_500;