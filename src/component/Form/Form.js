import React from 'react';

// 高阶组件用法,类似于import {connect} from 'react-redux';的connect,相当于把传递进来的组件进行了一层包装
export default function High_order_component(Comp){
    return class HighOrderComponent extends React.Component{
        constructor(props){
            super(props)
            this.state={}
            this.handelChange=this.handelChange.bind(this);
        }
        render(){
            return (
                <Comp state={this.state} {...this.props} handelChange={this.handelChange}></Comp>
            )
        }
        handelChange(key,val){
            this.setState({
                [key]:val
            })
        }
    }
}