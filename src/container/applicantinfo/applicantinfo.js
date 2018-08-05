// 应聘者完善信息页面

import React from 'react';

import {InputItem,TextareaItem,NavBar,Button} from 'antd-mobile';

import AvatarSelector from '../../component/avatar-selector/avatar-selector.js';

import {connect} from 'react-redux';

import {update} from '../../redux/user.js';

import {Redirect} from 'react-router-dom';

class ApplicantInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            desc1:''
        }
    }
    render(){
        var path=this.props.location.pathname;
        var redirectto=this.props.state.redirectTo;
        return (
            <div>
                {(redirectto && redirectto!==path)?<Redirect to={redirectto}/>:null}
                <NavBar mode="dark">applicant完善信息页面</NavBar>
                <AvatarSelector selectAvatar={(imgName)=>{this.handelSelectAvatar(imgName)}}></AvatarSelector>
                <InputItem onChange={(val)=>this.handelChange('title',val)}>
                    求职岗位</InputItem>
                <TextareaItem autoHeight title='个人简介'
                              onChange={(val)=>this.handelChange('desc1',val)}
                ></TextareaItem>
                <Button type='primary' onClick={()=>this.handelSave()}>保存</Button>
            </div>
        )
    }
    handelChange(key,val){
        this.setState({
            [key]:val
        })
    }
    handelSelectAvatar(imgName){
        this.setState({avatar:imgName})
    }
    handelSave(){
        this.props.update(this.state);
    }
}

const mapStateToProps=(state)=>{
    return {
        state:state.user
    }
}

const actionCreators={update};

ApplicantInfo=connect(mapStateToProps,actionCreators)(ApplicantInfo);
export default ApplicantInfo;