// 应聘者列表或者是boss列表中的每一个用户列表

import React from 'react';

import {WhiteSpace,Card} from 'antd-mobile';

import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';

class UserCard extends React.Component{
    static propTypes={
        userList:PropTypes.array.isRequired
    }
    render(){
        return (
            <div>
                {this.props.userList.map(v => (
                    v.avatar?(
                        <div key={v.id} onClick={(e)=>{this.handelClick(e,v)}}>
                            <WhiteSpace/>
                            <Card>
                                <Card.Header
                                    title={v.username}
                                    thumb={require(`../img/${v.avatar}.png`)}
                                    extra={v.title}
                                />
                                <Card.Body>
                                    {/*判断每一个认识boss还是applicant*/}
                                    {v.type==='boss'?<div>公司:{v.company}</div>:null}
                                    {/*desc1中可能含有回车符号*/}
                                    {v.desc1.split('\n').map((d,i)=>(
                                        <div key={i}>
                                            {d}
                                        </div>
                                    ))}
                                    {v.type==='boss'?<div>薪资:{v.money}</div>:null}
                                </Card.Body>
                            </Card>
                        </div>
                    ):null
                ))}
            </div>
        )
    }
    handelClick(e,v){
        e.preventDefault();
        this.props.history.push(`/chat/${v.id}`);
    }
}

export default withRouter(UserCard);