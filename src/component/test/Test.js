/**
 * Created by Administrator on 2019/11/11.
 */
import React from 'react';

class Test extends React.Component{
    constructor(){
        super();
        this.state={
            counter:0
        };
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=()=>{
        this.setState({
            counter:this.state.counter+1
        });
    }


    render=()=>{
        return (
            <div>{this.state.counter}</div>
        );
    }
}

export default Test;