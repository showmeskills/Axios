//构造函数
function Axios(config){
    this.config = config;
}
//原型request方法
Axios.prototype.request = function(config){
    return dispatchRequest(config)
}
//dispatchRequest函数
function dispatchRequest(config){
    return xhrAdapter(config)
}
//xhrAdapter
function xhrAdapter(config){
    //发送ajax请求
    return new Promise((resolve, reject)=>{
        //实例化对象
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url);
        xhr.send();
        xhr.onreadystatechange = function(){
            if(xhr.readyState ===4){
                if(xhr.status >=200 && xhr.status <300){
                    resolve({
                        status:xhr.status,
                        statusText:xhr.statusText
                    })
                }
            }else{
                reject(new Error(`请求失败`))
            }
        }
        //关于取消请求处理
        if(config.cancelToken){
            //对 cancelToken对象身上的promise对象指定成功的回调
            config.CancelToken.promise.then(value=>{
                xhr.abort();
                //整体结果设置失败
                reject(new Error(`请求失败`))
            })
        }
    })
}

//创建axios 函数
const context = new Axios()
const axios = Axios.prototype.request.bind(context)

//cancelToken 构造函数
function CancelToken(executor){
    //声明一个变量
    var resolvePromise;
    //为实例对象添加属性
    this.promise = new Promise(resolve=>{
        //将resolve赋值给resolvePromise
        resolvePromise = resolve
    });
    //调用executor函数
    executor(function(){
        //执行resolvePromise函数
        resolvePromise();
    })
}  