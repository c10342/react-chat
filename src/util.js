// 登录或者注册后，判断需要跳转到那个页面
export function getRedirectPath({type,avatar}){
    var url=(type==='boss')?'/boss':'/applicant';

    // 如果没有头像，说明没有完善信息，需要跳转到完善信息的页面
    if(avatar==='' || avatar===null || avatar===undefined){
        url+='info';
    }
    return url;
}

// 根据传入的接收送者的id，和自己的id返回chatid
export function chatid(fromid,toid) {
    return [fromid,toid].join('_');
}