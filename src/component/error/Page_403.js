/**
 * Created by Administrator on 2019/5/9.
 */
/**
 * Created by Administrator on 2019/5/5.
 */
import React from 'react';
import ReactDom from 'react-dom';
import {Result,Button} from 'antd';

class Page_403 extends React.Component {
    render() {
        return (
            <div>
                <Result
                    status="403"
                    title="403"
                    subTitle="对不起，您没有权限访问该页面"
                />
            </div>
        );
    }
}

export default Page_403;