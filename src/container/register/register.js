// 注册页面

import React from 'react';

import Logo from '../../component/logo/logo.js';

import {InputItem,Button,List,WhiteSpace,WingBlank,Radio} from 'antd-mobile';

import {connect} from 'react-redux';

import {register} from '../../redux/user.js';

import {Redirect} from 'react-router-dom';

import High_order_component from '../../component/Form/Form.js';

class Register extends React.Component{
    constructor(props){
        super(props);
        // this.state={
        //     username:'',
        //     password:'',
        //     repeatpwd:'',
        //     type:'applicant' //用户身份，applicant表示是应聘者，boss表示是boss
        // }
    }
    render (){
        // RadioItem组件
        const RadioItem=Radio.RadioItem;
        return (
            <div>
                <Logo></Logo>
                <h3>注册页面</h3>
                {/*用户注册完成后，有登录信息就直接跳转到其他页面*/}
                {this.props.user.redirectTo?<Redirect to={this.props.user.redirectTo}/>:null}
                {/*WingBlank是2边留空白，属于布局组件*/}
                <WingBlank>
                    {this.props.user.msg?<p className='err-msg'>{this.props.user.msg}</p>:null}
                    {/*List列表组件*/}
                    <List>
                        <InputItem
                            onChange={val=>this.props.handelChange('username',val)}
                        >用户名</InputItem>
                        <WhiteSpace/>
                        <InputItem
                            type='password'
                            onChange={val=>this.props.handelChange('password',val)}
                        >密码</InputItem>
                        <WhiteSpace/>
                        <InputItem
                            type='password'
                            onChange={val=>this.props.handelChange('repeatpwd',val)}
                        >确认密码</InputItem>
                        <WhiteSpace/>
                        <RadioItem
                            checked={this.props.state.type==='applicant'}
                            onChange={()=>this.props.handelChange('type','applicant')}
                        >应聘者</RadioItem>
                        <WhiteSpace/>
                        <RadioItem
                            checked={this.props.state.type==='boss'}
                            onChange={()=>this.props.handelChange('type','boss')}
                        >boss</RadioItem>
                        <WhiteSpace/>
                        <Button
                            type='primary'
                            onClick={()=>this.handelRegister()}
                        >注册</Button>
                    </List>
                </WingBlank>
            </div>
        );
    }
    componentDidMount(){
        // 由于高阶组件的state没有type这个默认值，所以我们要手动的去添加
        this.props.handelChange('type','applicant');
    }

    handelRegister(){
        this.props.register(this.props.state);
    }
}


function mapStateToProps(state){
    return {
        user:state.user
    }
}
const actionCreators={register}
Register=connect(mapStateToProps,actionCreators)(Register);

Register=High_order_component(Register);

export default Register