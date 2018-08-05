import axios from 'axios';

const USER_LIST='USER_LIST';

// 重置状态
const RESET='RESET';

var initState={
    userList:[]
}

export function chatuser(state=initState,action){
    switch(action.type){
        case USER_LIST:
            return {...state,userList:action.data}
        case RESET:
            return {...initState}
        default:
            return state;
    }
}

// 获取用户列表
function userList(data){
    return {
        type:USER_LIST,
        data
    }
}

// 根据传入的身份，获取的列表
export function getUserList(type){
    return dispatch=>{
        axios.get('/user/list?type='+type).then(res=>{
            if(res.status===200 && res.data.code===0){
                dispatch(userList(res.data.data))
            }
        }).catch(err=>{
            if(err){
                console.log(err);
            }
        })
    }
}