// 登录页面

import React from 'react';

import Logo from '../../component/logo/logo.js';

import {InputItem,Button,List,WingBlank,WhiteSpace} from 'antd-mobile';

import {connect} from 'react-redux';

import {login,reset} from '../../redux/user.js';

import {Redirect} from 'react-router-dom';

// 引入自定义的高阶组件
import High_order_component from '../../component/Form/Form.js';

class Login extends React.Component{
    constructor(props){
        super(props);
        // 引入高阶组件后不需要this.state，由高阶组件传递进该组件的props
        // this.state={
        //     username:'',
        //     password:''
        // }
        this.register=this.register.bind(this);
    }
    render(){
        return (
            <div>
                <Logo></Logo>
                <h3>登录页面</h3>
                {/*用户打开登录页面后有登录信息就直接跳转到其他页面，无需登录*/}
                {this.props.user.redirectTo?<Redirect to={this.props.user.redirectTo}/>:null}
                <WingBlank>
                    {this.props.user.msg?<p className='err-msg'>{this.props.user.msg}</p>:null}
                    <List>
                        <InputItem
                            // 没有引入自定义高阶组件
                            // onChange={val=>this.handelChange('username',val)}
                            // 引入自定义组件后，由于我们在自定义组件中有handelChange这个函数，并且传递给了Login这个组件
                            onChange={val=>this.props.handelChange('username',val)}
                        >用户名</InputItem>
                        <WhiteSpace/>
                        <InputItem
                            type='password'
                            // onChange={val=>this.handelChange('password',val)}
                            onChange={val=>this.props.handelChange('password',val)}
                        >密码</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={()=>this.handelLogin()}>登录</Button>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.register}>注册</Button>
                        <WhiteSpace/>
                    </List>
                </WingBlank>
            </div>
        );
    }
    register(){
        // 这里重置redux中的状态是因为可能用户点击登陆后会改面redux中的状态，跳转到注册页面后这些状态不是需要的
        this.props.reset();
        // 进行路由跳转,所有的路有组件都有this.props.history，普通组件没有
        this.props.history.push('/register');
    }
    handelLogin(){
        this.props.login(this.props.state);
    }
}

Login=High_order_component(Login);

const mapStateToProps=(state)=>{
    return {
        user:state.user
    }
};
const actionCreators={login,reset}

Login=connect(mapStateToProps,actionCreators)(Login);


export default Login