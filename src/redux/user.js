import axios from 'axios';

import {getRedirectPath} from '../util.js'

// 注册，登录，完善信息成功
const AUTH_SUCCESS='AUTH_SUCCESS';

// 注册或者登录失败
const ERR_MSG='ERR_MSG';

// 获取用户信息
const LOAD_DATA='LOAD_DATA';

// 重置状态
const RESET='RESET';

// 初始状态
var initState={
    username:'',
    // 注册或者登录失败的信息
    msg:'',
    type:'',
    // 注册或者登录成功后需要跳转到的路由
    redirectTo:''
}

// reducer
export function user(state=initState,action){
    switch(action.type){
        case AUTH_SUCCESS:
            return {...state,msg:'',...action.data,redirectTo:getRedirectPath(action.data)}
        case LOAD_DATA:
            // 返回用户信息
            return {...state,msg:'',...action.data,redirectTo:getRedirectPath(action.data)}
        case RESET:
            return {isAuth:false,username:'',msg:'',type:'',redirectTo:''}
        case ERR_MSG:
            // 返回注册失败的状态
            return {...state,isAuth:false,msg:action.msg,username:'',type:''}
        default:
            return state;
    }
}


// action
// 各种错误信息
function errMsg(msg){
    return {
        type:ERR_MSG,
        msg
    }
}

// 注册，登录，完善信息
function authSuccess(data){
    return {
        type:AUTH_SUCCESS,
        data
    }
}

// 获取用户信息
export function loadData(data){
    return {
        type:LOAD_DATA,
        data
    }
}

// 重置状态
export function reset(){
    return{
        type:RESET
    }
}

// 异步
// 注册
export function register({username,password,repeatpwd,type}){
    if(!username || !password || !repeatpwd){
        return errMsg('用户名和密码必须填写');
    }
    if(password!==repeatpwd){
        return errMsg('密码和确认密码不一致');
    }
    return dispatch=>{
        axios.post('/user/register',{username,password,type}).then((res)=>{
            if(res.status===200 && res.data.code===0){ //注册成功
                dispatch(authSuccess(res.data.data))
            }else{ //失败
                dispatch(errMsg(res.data.msg))
            }
        });
    }
}
// 登录
export function login({username,password}){
    if(!username||!password){
        return errMsg('请输入用户名或者密码')
    }
    return dispatch=>{
        axios.post('/user/login',{username,password}).then(res=>{
            if(res.status===200 && res.data.code===0){ //登陆成功
                dispatch(authSuccess(res.data.data));
            }else{ //失败
                dispatch(errMsg('用户名或者密码错误'))
            }
        })
    }
}

// 完善信息
export function update(data){
    return dispatch=>{
        axios.post('/user/update',data).then(res=>{
            if(res.status===200 && res.data.code===0){ //登陆成功
                dispatch(authSuccess(res.data.data));
            }else{ //失败
                dispatch(errMsg(res.data.msg))
            }
        })
    }
}