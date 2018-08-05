// 应聘者列表

import React from 'react';

import {connect} from 'react-redux';

import {getUserList} from "../../redux/chatuser.js";

import UserCard from '../userCard/userCard.js';


class Applicant extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
           <UserCard userList={this.props.chatuser.userList} />
        );
    }
    componentDidMount(){
        // 触发redux的action事件
        this.props.getUserList('boss')
    }
}

const mapStateToProps=(state)=>{
    return{
        user:state.user,
        chatuser:state.chatuser
    }
}

const actionCreators={getUserList}

Applicant=connect(mapStateToProps,actionCreators)(Applicant);

export default Applicant;