import React from 'react';

import PropTypes from 'prop-types';

class Sider extends React.Component{
    render (){
        return (
            <div>
                侧栏
                <Navbar></Navbar>
                <Hello></Hello>
            </div>
        )
    }
}

// 无状态的函数式组件中引用 Context
function Hello(props,context){
    return (
        <div>你好{context.username}</div>
    )
}
Hello.contextTypes={
    username:PropTypes.string
}

class Navbar extends React.Component{
    // 校验父级组件传递过来的context参数类型，使用context上下文时必须填写
    static contextTypes={
        username:PropTypes.string
    }
    render(){
        return (
            <div>
                我是{this.context.username}的导航栏
            </div>
        )
    }
}
class Page extends React.Component{
    // 指定传递给子组件的context参数类型，使用context上下文时必须填写
    static childContextTypes={
        username:PropTypes.string
    }
    // 传递给子组件的context参数
    getChildContext(){
        // 返回一个对象
        return this.state;
    }
    constructor(props){
        super(props);
        this.state={
            username:'张三'
        }
    }
    render (){
        return (
            <div>
                <p>我是{this.state.username}</p>
                <Sider></Sider>
            </div>
        )
    }
}

export default Page;