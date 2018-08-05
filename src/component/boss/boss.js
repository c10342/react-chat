
// boss列表

import React from 'react';

import {connect} from 'react-redux';

import {getUserList} from "../../redux/chatuser.js";

import UserCard from '../userCard/userCard.js';


class Boss extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        }
    }
    render(){
        return (
            <UserCard userList={this.props.chatuser.userList}/>
        );
    }
    componentDidMount(){
        // 触发redux的action事件
        this.props.getUserList('applicant')
    }
}

const mapStateToProps=(state)=>{
    return{
        user:state.user,
        chatuser:state.chatuser
    }
}

const actionCreators={getUserList}

Boss=connect(mapStateToProps,actionCreators)(Boss)
export default Boss;