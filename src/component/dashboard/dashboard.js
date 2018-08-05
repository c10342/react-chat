// 完善信息后进来的面板

import React from 'react';

import {NavBar} from 'antd-mobile';

import {connect} from 'react-redux';

import NavLink from '../navlink/navlink.js';

import {Route} from 'react-router-dom';

import Boss from '../boss/boss.js';

import Applicant from '../applicant/applicant.js';

import User from '../user/user.js';

import Msg from '../msg/msg.js';

import {getMsgList,recvmsg} from "../../redux/chat.js";

import QueueAnim from 'rc-queue-anim';

class Dashboard extends React.Component{
    render(){
        var user=this.props.user;
        // 获取路由地址
        var {pathname}=this.props.location;
        const navList=[
            {
                path:'/boss',
                text:'应聘者',
                title:'应聘者列表',
                icon:'boss',
                component:Boss,
                hide:user.type==='applicant'

            },
            {
                path:'/applicant',
                text:'boss',
                title:'boss列表',
                icon:'job',
                component:Applicant,
                hide:user.type==='boss'

            },
            {
                path:'/msg',
                text:'消息',
                title:'消息列表',
                icon:'msg',
                component:Msg

            },
            {
                path:'/me',
                text:'我',
                title:'个人中心',
                icon:'user',
                component:User,
            }
        ]
        const page=navList.find(v=>v.path===pathname)
        // this.props.user.username判断this.props.user.username是否存在，因为发送请求是异步的,若判断this.props.user，则为空，因为一开始this.props.user={}
        return this.props.user.username?(
            <div className='Dashboard'>
                {/*find是从数组中找出一个符合要求的项*/}
                <NavBar className='fixed-header' mode="dark">{navList.find(v=>v.path===pathname).title}</NavBar>
                <div style={{marginTop:45,marginBottom:50}}>
                    {/*QueueAnim只能渲染一个路由,并且渲染的元素必须有唯一的key值*/}
                    <QueueAnim type={'scale'} duration={800}>
                    <Route
                        key={page.path}
                        path={page.path}
                        component={page.component}
                    />
                    </QueueAnim>
                </div>
                <NavLink data={navList}/>
            </div>
        ):null
    }
    componentDidMount(){
        var {pathname}=this.props.location;
        // 直接刷新
        if(pathname==='/'){
            this.props.history.push('/login');
            return;
        }
        // 获取聊天信息，这里是为了防止来回切换，导致一条信息重复出现
        if(this.props.chat.chatmsg.length===0){
            this.props.getMsgList();
            this.props.recvmsg();
        }
    }
}

const mapStateToProps=(state)=>{
    return {
        user:state.user,
        chat:state.chat
    }
}

const actionCreators={getMsgList,recvmsg}

Dashboard=connect(mapStateToProps,actionCreators)(Dashboard)

export default Dashboard;