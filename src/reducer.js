import {combineReducers} from 'redux';

import {user} from './redux/user.js';

import {chatuser} from './redux/chatuser.js';

import {chat} from './redux/chat.js';


// 合并所有的reducer
export default combineReducers({
    user,
    chatuser,
    chat
})