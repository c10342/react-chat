const crypto = require('crypto');

// md5加密
function md5(str){
    return crypto.createHash('md5').update(str).digest('base64');
}

module.exports={
    md5
}