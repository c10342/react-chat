const mysqlConnection=require('./mysqlConnection.js');

const state=require('../config/common.js')

// tableName是查询的表(字符串),selectItem是查询的列(数组),[]或者null是查询所有列,selectConditions是查询的条件(字符串),null或者''是查询所有
function Query(tableName,selectItem,selectConditions){
    return new Promise((resolve,reject)=>{
        // 处理selectItem为null,'',或者是[]这3种情况
        if(selectItem!= null && selectItem.length!=0){
            selectItem=selectItem.join(',');
        }else{
            selectItem='*';
        }
        var sql=`select ${selectItem} from ${tableName}`;
        // 处理selectConditions为null,'',[]这3种情况
        if(selectConditions!=null && selectConditions.length>0){
            sql+=` where ${selectConditions}`;
        }
        var connection=mysqlConnection.mysqlConnection();
        // 连接数据库
        connection.connect();
        // 开始事物
        connection.beginTransaction(function(transactionErr){
            if(transactionErr){
                // reject(state.ERR);
                reject(transactionErr);
                connection.end();
                return;
            }
            // 查询
            connection.query(sql,function(queryErr,result,fields){
                if(queryErr){
                    // 回滚
                    connection.rollback(function(rollbackErr){
                        if(rollbackErr){
                            // reject(state.ERR);
                            reject(rollbackErr);
                            connection.end();
                            return;
                        }
                    });
                    // reject(state.ERR);
                    reject(queryErr);
                    connection.end();
                    return;
                }
                // 提交事务
                connection.commit(function(commitErr){
                    if(commitErr){
                        connection.rollback(function(rollbackErr){
                            if(rollbackErr){
                                // reject(state.ERR);
                                reject(rollbackErr);
                                connection.end();
                                return;
                            }
                        });
                        // reject(state.ERR);
                        reject(commitErr);
                        connection.end();
                        return;
                    }
                    resolve(result);
                    // 关闭链接
                    connection.end();
                    return;
                })
            });
        })
    })
}

// tableName是要插入的表(字符串),obj是要插入的数据(json对象)
function Insert(tableName,obj){
    return new Promise((resolve,reject)=>{
        var insertValue=[];
        var insertItem='';
        var value='';
        for(var key in obj){
            insertItem+=`${key},`;
            value+='?,';
            insertValue.push(obj[key]);
        }
        // 去掉最后一个逗号
        insertItem=insertItem.substring(0,insertItem.length-1);
        // 去掉最后一个逗号
        value=value.substring(0,value.length-1);
        var sql=`insert into ${tableName}(${insertItem}) values (${value})`;
        var connection=mysqlConnection.mysqlConnection();
        connection.connect();
        connection.beginTransaction(function(transactionErr){
            if(transactionErr){
                // reject(state.ERR);
                reject(transactionErr);
                connection.end();
                return;
            }
            connection.query(sql,insertValue,function(queryErr,result,fields){
                if(queryErr) {
                    connection.rollback(function(rollbackErr){
                        // reject(state.ERR);
                        reject(rollbackErr);
                        connection.end();
                        return;
                    });
                    // reject(state.ERR);
                    reject(queryErr);
                    connection.end();
                    return;
                };
                connection.commit(function(commitErr){
                    if(commitErr){
                        connection.rollback(function(rollbackErr){
                            // reject(state.ERR);
                            reject(rollbackErr);
                            connection.end();
                            return;
                        });
                        // reject(state.ERR);
                        reject(commitErr);
                        connection.end();
                        return;
                    }
                    resolve(result);
                    connection.end();
                    return;
                });
            });
        })
    })
}

// tableName是要更新的表(字符串),obj是要更新的数据(json对象),updateCondition是更新的条件(字符串),''或者null更新全部
function Update(tableName,obj,updateCondition){
    return new Promise((resolve,reject)=>{
        var updateItem='';
        var value=[]
        for(var key in obj){
            updateItem+=`${key}=?,`
            value.push(obj[key]);
        }
        // 去掉最后一个逗号
        updateItem=updateItem.substring(0,updateItem.length-1);
        // 处理updateCondition为null,'',' ',[],这四种情况
        if(updateCondition==null || updateCondition.length==0 || updateCondition==' '){
            updateCondition='';
        }else{
            updateCondition=`where ${updateCondition}`;
        }
        var sql=`update ${tableName} set ${updateItem} ${updateCondition}`;
        var connection=mysqlConnection.mysqlConnection();
        connection.connect();
        connection.beginTransaction(function(transactionErr){
            if(transactionErr){
                // reject(state.ERR);
                reject(transactionErr);
                connection.end();
                return;
            }
            connection.query(sql,value,function(queryErr,result,fields){
                if(queryErr){
                    connection.rollback(function(rollbackErr){
                        if(rollbackErr){
                            // reject(state.ERR);
                            reject(rollbackErr);
                            connection.end();
                            return;
                        }
                    });
                    // reject(state.ERR);
                    reject(queryErr);
                    connection.end();
                    return;
                }
                connection.commit(function(commitErr){
                    if(commitErr){
                        connection.rollback(function(rollbackErr){
                            if(rollbackErr){
                                // reject(state.ERR);
                                reject(rollbackErr);
                                connection.end();
                                return;
                            }
                        });
                        // reject(state.ERR);
                        reject(commitErr);
                        connection.end();
                        return;
                    }
                    resolve(result);
                    connection.end();
                    return;
                })
            });
        })
    })
}

// tableName是要删除的表(字符串),insertCondition是删除的条件(字符串)
function Delete(tableName,insertCondition){
    return new Promise((resolve,reject)=>{
        var sql='';
        // 处理insertCondition为null,'',' ',[]这四种情况
        if(insertCondition!=null && insertCondition.length!=0 && insertCondition!=' '){
            sql=`delete from ${tableName} where ${insertCondition}`
        }else{
            sql=`delete from ${tableName}`;
        }
        var connection=mysqlConnection.mysqlConnection();
        connection.connect();
        connection.beginTransaction(function(transactionErr){
            if(transactionErr){
                // reject(state.ERR);
                reject(transactionErr);
                connection.end();
                return;
            }
            connection.query(sql,function(queryErr,result,fields){
                if(queryErr) {
                    connection.rollback(function(rollbackErr){
                        if(rollbackErr){
                            // reject(state.ERR);
                            reject(rollbackErr);
                            connection.end();
                            return;
                        }
                    });
                    // reject(state.ERR);
                    reject(queryErr);
                    connection.end();
                    return;
                }
                connection.commit(function(commitErr){
                    if(commitErr) {
                        connection.rollback(function(rollbackErr){
                            if(rollbackErr){
                                // reject(state.ERR);
                                reject(rollbackErr);
                                connection.end();
                                return;
                            }
                        });
                        // reject(state.ERR);
                        reject(commitErr);
                        connection.end();
                        return;
                    }
                    resolve(result);
                    connection.end();
                    return;
                })
            });
        })
    })
}

module.exports={
    Query,
    Insert,
    Update,
    Delete
}