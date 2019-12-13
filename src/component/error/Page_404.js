/**
 * Created by Administrator on 2019/5/9.
 */
/**
 * Created by Administrator on 2019/5/5.
 */
import React from 'react';
import ReactDom from 'react-dom';
import {Result,Button} from 'antd';

class Page_404 extends React.Component {

    backToHome = ()=> {
        this.props.history.push('/');
    };

    render() {
        return (
            <div>
                <Result
                    status="404"
                    title="404"
                    subTitle="页面不存在"
                    extra={<Button type="primary" onClick={this.backToHome}>返回首页</Button>}
                />
            </div>
        );
    }
}

export default Page_404;