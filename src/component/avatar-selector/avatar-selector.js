// 完善信息时的头像选择

import React from 'react';

import {Grid,List} from 'antd-mobile';

import PropTypes from 'prop-types';

class AvatarSelector extends React.Component{
    // 对传递过来的props属性进行类型检测，使用import PropTypes from 'prop-types';
    static propTypes={
        // 传递过来selectAvatar必须是个函数，而且是必须要传递的
        selectAvatar:PropTypes.func.isRequired
    }

    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        // Grid组件数据源
        const avatarList='boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
            .split(',') //分割成数组
            .map((item)=>({  //返回新的数组，用于Grid的数据源，必须有icon
            icon:require(`../img/${item}.png`), //图片地址
            text:item //图片名称
        }));
        var gridHeader=this.state.icon?(
            <div style={{verticalAlign:'center'}}>
                <span>已选择头像</span>
                <img style={{width:20}} src={this.state.icon} alt=""/>
            </div>
        ): <div>请选择头像</div>
        return (
            <div>
                {/*renderHeader渲染List的头部*/}
                <List renderHeader={()=>gridHeader}>
                    <Grid
                        data={avatarList}
                        columnNum={5}
                        onClick={(val)=>{
                            // 把头像名称传递给父组件
                            this.props.selectAvatar(val.text);
                            // val是每一个数据源项{icon:xx,text:xx}
                            // 保存点击的头像到state中
                            this.setState(val);
                        }}
                    />
                </List>
            </div>
        )
    }
}

export default AvatarSelector