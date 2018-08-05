// 用户中心

import React from 'react';

import {connect} from 'react-redux';

import {Result,List,WhiteSpace,Modal} from 'antd-mobile';

import browserCookie from 'browser-cookies';

import {reset} from '../../redux/user.js'


class User extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return this.props.user.username?(
            <div>
                <Result
                title={this.props.user.username}
                // 身份为boss就显示公司
                message={this.props.user.type==='boss'?this.props.user.company:null}
                img={<img src={require(`../img/${this.props.user.avatar}.png`)} alt="" style={{width:50}}/>}
                />
                <List
                    // 渲染列表头部信息
                renderHeader={()=>'简介'}
                >
                    <List.Item
                        // 多行显示
                        multipleLine
                    >
                        <div>{this.props.user.title}</div>
                        <div>
                            {/*处理回车符*/}
                            {this.props.user.desc1.split('\n').map((v,i)=>(<List.Item.Brief key={i}>
                                {v}
                            </List.Item.Brief>))}
                        </div>
                        <div>
                            {this.props.user.type==='boss'?<List.Item.Brief>公司 : {this.props.user.company}</List.Item.Brief>:null}
                        </div>
                    </List.Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <List.Item onClick={(e) => {this.logout(e)}}>
                        退出登录
                    </List.Item>
                </List>
            </div>
        ):null
    }
    logout(e){
        e.preventDefault()
        e.stopPropagation();
        let alert=Modal.alert;
        alert('注销', '确认退出登录吗', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                    // 删除cookie
                    browserCookie.erase('userId');
                    // 刷新页面
                    // window.location.href=window.location.href;
                    // 退出后重置redux的所有状态
                    this.props.reset();
                    this.props.history.push('/login')
                } },
        ])
    }
}

const mapStateToProps=state=>{
    return {
        user:state.user
    }
}

const actionsCreators={reset}

User = connect(mapStateToProps, actionsCreators)(User);

export default User;