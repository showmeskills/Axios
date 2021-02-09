//1.声明结构
function Axios(config){
    this.config = config;
}
Axios.prototype.request = function(config){
    //创建一个Promise 对象
    let promise = Promise.resolve(config);
    //声明一个数组
    let chains = [dispatchRequest,undefined];//undefined 占位 原型链占位
    //调用then方法指定回调
    let result = promise.then(chains[0],chains[1])
    return result

}
//2.dispatch request 函数 这个是chains里面的dispatchRequest
function dispatchRequest(config){
    //调用适配器发送请求
    return xhrAdapter(config).then(response=>{
        //对相应结果进行处理
        return response
    },error=>{
        throw error
    })
}
//3.adapter 适配器
function xhrAdapter(config){
    return new Promise((resolve,reject)=>{
        //发送ajax 请求
        let xhr = new XMLHttpRequest();
        xhr.open(config.method,config.url);
        xhr.send();
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status >=200 && xhr.status < 300 || xhr.status === 304){
                    resolve({
                        //配置对象
                        config:config,
                        //响应体
                        data:xhr.response,
                        //响应头
                        headers:xhr.getAllResponseHeaders(),//字符串
                        //xhr的请求对象
                        request:xhr,
                        //响应状态码
                        status:xhr.status,
                        //响应状态字符串
                        statusText:xhr.statusText
                    })
                }else{
                    reject(new Error(`请求失败 失败的状态码为${xhr.status}`))
                }
            }
        }
    })
}
//4.创建axios函数
const axios = Axios.prototype.request.bind(null)
