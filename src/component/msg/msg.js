import React from 'react';

import {connect} from 'react-redux';

import {List,Badge} from 'antd-mobile';

class Msg extends React.Component{
    render(){
        var msgGroup={}
        // 对聊天信息进行分组
        this.props.chat.chatmsg.forEach(v=>{
            msgGroup[v.chatid]=msgGroup[v.chatid] || [];
            msgGroup[v.chatid].push(v);
        });
        // 获取所有的value值
        // console.log(Object.values({name: 'zhangsan', age: 18}));
        // 获取所有的key值
        // console.log(Object.keys({name:'zhangsan',age:18}))
        var chatList=Object.values(msgGroup);

        // 对聊天信息进行排序，使最新消息在前面
        // a,b是前后2个相邻的元素
        // 根据最后每个人最后的一条消息的创建时间进行排序
        chatList=chatList.sort((a,b)=>{
            var a_last=this.getLastMsg(a).createTime;
            var b_last=this.getLastMsg(b).createTime;
            return b_last-a_last;
        })

        const userid=this.props.user.id;
        return (
            <div>
                {chatList.map((v,i)=>{
                    // console.log(v);
                    // 不是发送给自己的消息不显示在消息列表中
                    if(userid!==v[0].toid){
                        return null;
                    }
                    var targetInfo=null;
                    // 查找发送给自己消息的那个用户信息
                    this.props.chatuser.userList.forEach(v1=>{
                        if (v1.id===v[0].fromid){
                            targetInfo=v1;
                        }
                    });

                    // 获取发送消息的用户的图片
                    var targetavatar=require(`../img/${targetInfo.avatar}.png`) || '';

                    // 未读消息数量
                    var unReadNum=v.filter(item=>(item.isread===1&&item.toid===userid)).length;


                    return (
                        <List key={i}>
                            <List.Item
                                extra={<Badge text={unReadNum}></Badge>}
                                thumb={targetavatar}
                                arrow='horizontal'
                                // 跳转到聊天面板
                                onClick={()=>{this.props.history.push(`/chat/${targetInfo.id}`)}}
                            >
                                {this.getLastMsg(v).content}
                               <List.Item.Brief>
                                   {targetInfo.username}
                               </List.Item.Brief>
                            </List.Item>
                        </List>
                    )
                })}
            </div>
        )
    }
    // 获取最后一条聊天信息
    getLastMsg(arr){
        return arr[arr.length-1];
    }
}

const mapStateToProps=(state)=>{
    return {
        ...state
    }
}

Msg=connect(mapStateToProps,null)(Msg);

export default Msg;