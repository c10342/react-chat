import React from 'react';
import Login from "./container/login/login";
import ApplicantInfo from "./container/applicantinfo/applicantinfo";
import BossInfo from "./container/bossinfo/bossinfo";
import Dashboard from "./component/dashboard/dashboard";
import Register from "./container/register/register";
import Chat from "./component/chat/chat";
// 判断路由跳转，以及是否已经登录了
import AuthRoute from './component/AuthRoute/AuthRoute.js';
import {Route,Switch} from 'react-router-dom';

class App extends React.Component{
    render(){
        return (
            <div>
                <AuthRoute/>
                {/*被Switch包裹的路由只能有一个被渲染，即有多个路由被匹配到，只渲染第一个被命中的*/}
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/bossinfo' component={BossInfo} />
                    <Route path='/applicantinfo' component={ApplicantInfo} />
                    <Route path='/chat/:userid' component={Chat} />
                    {/*不写path默认匹配所有路由*/}
                    <Route component={Dashboard}/>
                </Switch>
            </div>
        )
    }
}

export default App;