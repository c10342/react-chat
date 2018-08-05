// 下方的导航栏

import React from 'react';

import {TabBar} from 'antd-mobile';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';

import PropTypes from 'prop-types';

class NavLink extends React.Component{
    // 校验传递过来的props参数
    static propTypes={
        data:PropTypes.array.isRequired
    }

    render(){
        // 过滤掉不需要显示的
        var navList=this.props.data.filter(v=>!v.hide);
        var {pathname}=this.props.location;
        return (
            <div>
                <TabBar>
                    {navList.map(v => (
                        <TabBar.Item
                            // 只有消息这里需要显示消息数量
                            badge={v.path==='/msg'?this.props.chat.unread:0}
                            key={v.path}
                            title={v.text}
                            // 图标，利用webpack的require
                            icon={{uri: require(`./img/${v.icon}.png`)}}
                            // 被选中时显示的图标
                            selectedIcon={{uri: require(`./img/${v.icon}-active.png`)}}
                            // 是否被选中
                            selected={v.path === pathname}
                            onPress={() => {
                                this.props.history.push(v.path)
                            }}
                        >
                        </TabBar.Item>
                    ))}
                </TabBar>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        chat:state.chat
    }
}

NavLink=connect(mapStateToProps,null)(NavLink);

export default withRouter(NavLink);