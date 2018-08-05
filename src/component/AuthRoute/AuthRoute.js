// 负责判断是否已经登陆了，登录了就跳转到对应页面，没有就跳转到登录页面

import React from 'react';

import axios from 'axios';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';

import {loadData} from '../../redux/user.js';

class AuthRoute extends React.Component{
    render(){
        return null;
    }
    componentDidMount(){
        var publicList=['/login','/register'];
        // 获取路由路径
        var pathName=this.props.location.pathname;;
        if(publicList.indexOf(pathName)>-1){
            //当前页面是登录页面或者是注册页面，说明没有登录信息，不需要发送请求
            return null;
        }
        axios.get('/user/info').then((res)=>{
            if(res.status===200){
                if(res.data.code===1){
                    // 无登录信息
                    this.props.history.push('/login')
                }else{
                    // 触发redux的action事件，保存登录信息到redux状态中
                    this.props.loadData(res.data.data);
                    // 跳转路由，react-router4路由跳转方式
                    this.props.history.push(this.props.state.redirectTo)
                    // 有登录信息
                    return null;
                }
            }
        }).catch(()=>{
            return null;
        })
    }
}

// 由于该组件是普通组件没有this.props.history，所有我们引入withRouter使该组件有this.props.history

AuthRoute=withRouter(AuthRoute)

function mapStateToProps(state){
    return {
        state:state.user
    }
}
const actionCreators={loadData}

AuthRoute=connect(mapStateToProps,actionCreators)(AuthRoute);

export default AuthRoute;