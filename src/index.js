import React from 'react';

import ReactDom from 'react-dom';

import {Provider} from 'react-redux';

import {createStore,applyMiddleware,compose} from 'redux';

import thunk from 'redux-thunk';

import {BrowserRouter} from 'react-router-dom';

import reducers from './reducer.js';

import './config';

import './index.css';

import App from './app.js'



// 创建store
const store = createStore(reducers,compose(
    // 处理异步，需要用到thunk中间件
    applyMiddleware(thunk),
    // 开启谷歌浏览器中的redux插件
    window.devToolsExtension?window.devToolsExtension():f=>f
));


ReactDom.render(
    (
        // react-router4的写法，与react-router2的写法不一样
        <Provider store={store}>
            <BrowserRouter>
                <App></App>
            </BrowserRouter>
        </Provider>
    ),
    document.getElementById('root')
);


// import Page from './context.js';
//
// ReactDom.render(
//     <Page></Page>,
//     document.getElementById('root')
// );
