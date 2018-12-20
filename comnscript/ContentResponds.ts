import { Store } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import { RefreshToken, MyTask} from './ComnTask'
import $ = require('jquery')

$(document).ready(() => {
    //完整页面信息加载，不做任何改变
    //为页面所有的Icon上添加回调，记录所有点击数目，记录在浏览器本地存储中
    
    
    //获取用户登录状态信息
    var access = new Store.Access(Store.Type.Local);
    var actName = access.getValue('actName');
    var token = access.getValue('token');
    
    if(actName == null || token == null){
        actName = 'anyOne';
        token = 'anyToken';
    }

    //获取综合数据到目前页面
    //成功
        //从本地缓存中获取数据+返回数据对当前页面的导航图标进行重新排版
        //向服务器发送综合数据,服务器保存该数据
        //向服务器发送请求获取自定义的配置
        //利用自定义配置对页面进行重新渲染
    //失败
        //删除本地浏览器缓存数据



});


