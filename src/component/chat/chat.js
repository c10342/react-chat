// 聊天面板
import React from 'react';

import {List,InputItem,NavBar,Icon,Grid} from 'antd-mobile';

import {connect} from 'react-redux';

import {sendMsg,getMsgList,recvmsg,readmsg} from "../../redux/chat.js";

import {chatid} from '../../util.js';

import QueueAnim from 'rc-queue-anim';

class Chat extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:'',
            msg:[],
            // 是否显示表情
            showemoji:false
        }
    }
    render(){
        // 表情数据源
        const emoji='😀 😁 😂 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 ☺ 😇 😐 😑 😶 😏 😣 😥 😮 😯 😪 😫 😴 😌 😛 😜 😝 😒 😓 😔 😕 😲 😷 😖 😞 😟 😤 😢 😭 😦 😧 😨 😬 😰 😱 😳 😵 😡 😠 💪 👈 👉 ☝ 👆 👇 ✌ ✋ 👌 👍 👎 ✊ 👊 👋 👏 👐 ✍'.split(' ')
            .filter(v=>v)//表情是以一个空格间隔的，这里是防止出现2个空格的
            .map(v=>({text:v}))

        // 获取动态路由中的参数，userid是对方的id
        var userid=parseInt(this.props.match.params.userid);
        // 查找发送消息给我的用户
        var fromuser=this.props.state.chat.users.find(v=>v.id==userid);
        if(!fromuser){
            return null;
        }
        // 过滤信息，过滤掉不属于双方的信息
        const msg=this.props.state.chat.chatmsg.filter(v=>(v.chatid===chatid(userid,this.props.state.user.id) || v.chatid===chatid(this.props.state.user.id,userid)));
        return(
            <div id='chat-page'>
                <NavBar
                    mode='dark'
                    // 左边的图标
                    icon={<Icon type="left" />}
                    // 点击左边的图标
                    onLeftClick={() => {
                        // 返回上一级路由
                        this.props.history.goBack()
                    }}
                >{fromuser.username}</NavBar>
                <List>
                    <QueueAnim delay={100}>
                {msg.map((v,i)=>{
                    // 判断是自己发的还是对方发的，fromid是发送消息的人
                    return v.fromid===userid?(
                        <List.Item
                            thumb={require(`../img/${fromuser.avatar}.png`)}
                            className='chat-other'
                            key={i}
                        >{fromuser.username} : {v.content}</List.Item>
                    ):(
                        <List.Item
                            extra={<img src={require(`../img/${this.props.state.user.avatar}.png`)} alt=""/>}
                            className='chat-me'
                            key={i}
                            wrap
                        >
                            {v.content}</List.Item>
                    )
                })}
                    </QueueAnim>
                </List>
                <div className='stick-footer'>
                    <List>
                        <InputItem
                            value={this.state.text}
                            placeholder='请输入'
                            onChange={(v)=>{this.setState({text:v})}}
                            extra={
                                <div>
                                    <span
                                        onClick={()=>{
                                            this.setState({showemoji:!this.state.showemoji});
                                            this.fixCarousel();
                                        }}
                                        style={{marginRight:15,cursor: 'pointer'}}
                                    >😀</span>
                                    <span
                                        style={{cursor: 'pointer'}}
                                        onClick={()=>this.handelSubmit()}>发送</span>
                                </div>
                            }
                        ></InputItem>
                    </List>
                    {/*this.props.match.params.user获取动态路由中的参数*/}
                    {/*chat {this.props.match.params.user}*/}
                    {this.state.showemoji?(
                        // 显示表情
                        <Grid
                            data={emoji}
                            columnNum={9}
                            carouselMaxRow={4}
                            isCarousel
                            itemStyle={{cursor: 'pointer'}}
                            onClick={(el)=>{
                                console.log(el);
                                // this.setState({
                                //     text:this.state.text+el.text
                                // })
                            }}
                        />
                    ):null}
                </div>
            </div>
        )
    }
    componentDidMount(){
        // 聊天信息长度为0时，获取信息，这里是因为有可能在聊天面板刷新导致没有数据
        // if(this.props.state.chat.chatmsg.length===0 && this.props.state.chat.isconnect!==true){
        //     this.props.getMsgList();
        //     this.props.recvmsg();
        // }
        // 监听服务器发送过来的recvmsg事件，回调函数data是传递过来的参数
        // socket.on('recvmsg',(data)=>{
        //     this.setState({
        //         msg:[...this.state.msg,data.text]
        //     })
        // })
    }
    // 退出聊天面板时把消息置为已读
    componentWillUnmount(){
        const from =parseInt(this.props.match.params.userid);
        this.props.readmsg(from);
    }
    handelSubmit(){
        const fromid=this.props.state.user.id;
        const toid=parseInt(this.props.match.params.userid);
        const msg=this.state.text;
        this.props.sendMsg({fromid,toid,msg})
        // socket.emit('sendmsg',{text:this.state.text});
        this.setState({text:''})
    }
    // 修复显示表情时不能正确显示
    fixCarousel(){
        setTimeout(()=>{
            // 触发window的onresize事件
            window.dispatchEvent(new Event('resize'))
        },0)
    }
}
const mapStateToProps=(state)=>{
    return {
        state:state
    }
}

const actionCreators={sendMsg,getMsgList,recvmsg,readmsg}

Chat=connect(mapStateToProps,actionCreators)(Chat);

export default Chat