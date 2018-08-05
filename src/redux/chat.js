import axios from 'axios';

import io from 'socket.io-client';
// 'ws://localhost:9093'这里因为跨域了，我们需要手动连接，如果没跨域，则不需要填写'ws://localhost:9093'，直接io()

const socket=io('ws://localhost:9093');

// 登录进来时获取所有聊天列表
const MSG_LIST='MAG_LIST';

// 接收信息
const MSG_RECV = 'MSG_RECV';

// 表示已读信息
const MSG_READ = 'MSG_READ';

// 重置状态
const RESET='RESET';

const initState = {
    // 聊天信息
    chatmsg: [],
    // 未读信息总数量
    unread: 0,
    // 用户信息
    users: []
};

export function chat(state=initState,action){
    switch (action.type){
        case MSG_LIST:
            return {
                ...state,
                chatmsg:action.msgs,
                users:action.users,
                unread:action.msgs.filter(v=>(v.isread===1&&v.toid===action.userid)).length,//未读不包括自己发的，所以要过滤
            }
        case MSG_RECV:
            var n=action.userid===action.msg.toid?1:0; //自己发送的消息不能算入未读的
            return {...state,chatmsg:[...state.chatmsg,action.msg],unread:state.unread+n}
        case MSG_READ:
            return {
                ...state,
                // 根据fromid和toid把信息置为0（已读）
                chatmsg:state.chatmsg.map(v=>({...v,isread:v.fromid===action.fromid&&v.toid===action.toid?0:v.isread})),
                // 不进行判断可能会变成负数
                unread:state.unread-action.num===0?0:state.unread-action.num
            }
        case RESET:
            return {...initState}
        default:
            return state;
    }
}

function msgList(msgs,users,userid){
    return {
        type:MSG_LIST,
        msgs,
        users,
        userid
    }
}

function msgRecv(msg,userid){
    return {
        type:MSG_RECV,
        msg,
        userid
    }
}

function msgRead(fromid,toid,num) {
    return {
        type:MSG_READ,
        fromid,
        toid,
        num
    }
}

// 登录进来时获取所有聊天列表
export function getMsgList() {
    // dispatch派发事件，getState获取状态
    return (dispatch,getState)=>{
        axios('/user/getMsgList')
            .then((res)=>{
                if(res.status===200 && res.data.code===0){
                    dispatch(msgList(res.data.msgs,res.data.users,getState().user.id))
                }
            })
    }
}

// 发送信息
export function sendMsg(data){
    return dispatch=>{
        socket.emit('sendmsg',data)
    }
}

// 监听recvmsg事件
export function recvmsg(){
    return (dispatch,getState)=>{
        socket.on('recvmsg',function (data) {
            // console.log(data.msg);
            dispatch(msgRecv(data.msg,getState().user.id));
        })
    }
}

// 使用async+await优化异步代码，async+await是es7的内容，await必须在async内部
export  function readmsg(from) {
    // return (dispatch,getState)=>{
    //     axios.post('/user/msgread',{from}).then(res=>{
    //         if(res.status===200 && res.data.code===0){
    //             dispatch(msgRead(from,getState().user.id,res.data.num));
    //         }
    //     })
    // }
    // 把返回的函数变为异步
    return async (dispatch,getState)=>{
        // 异步变同步,这样就可以不用嵌套回调
        var res=axios.post('/user/msgread',{from});
        if(res.status===200 && res.data.code===0){
            dispatch(msgRead(from,getState().user.id,res.data.num));
        }
    }
}