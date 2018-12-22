import { Store } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import { RefreshToken, MyTask} from './ComnTask'
import $ = require('jquery')

$(document).ready(() => {
    //完整页面信息加载，不做任何改变
    $('#accessBtn').on('click', loginAccess);
    $('.loginframe input[data-for=change]').on('click', changeFrontForm);
    $('.loginframe input[name=actName]').on('keyup', checkAccount);
    $('#signin').on('click', signinProcess);
    $('#signup').on('click', singupProcess);

    //为页面所有的Icon上添加回调，记录所有点击数目，记录在浏览器本地存储中
    $('a').on({
        "click":recordImageClick
    }, 'img');
    
    
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

class GetConfigData implements Ajax.Task{
    execute(respond:Ajax.Reply){
        if(! respond.result()){
            return;
        }

        var reply = respond.textContent();
        var cfgData = new Store.NavData();
        cfgData.parseString(reply);

        var task = new NavigateIconRender(cfgData);
        task.do();
    }
    errorRespond(url){
        console.log(url+ ':服务器链接错误.........');
    }
}

class NavigateIconRender {
    private data:Store.NavData = new Store.NavData();

    constructor(external?: Store.NavData){
        var port = new Store.Access(Store.Type.Local);
        this.data = port.getNavDataFormLocalStorage();

        if(external != null)
            this.data.mergeNavData(external);
    }

    public do(){
        var linkdata = this.data.getInData();
        
    }
}










function recordImageClick(){
    var x = $(this).parent().attr('href');
    var port = new Store.Access(Store.Type.Local);
    port.refreshNaviDataAtLocalStorage(x);
}

function loginAccess(){
    if($(this).attr('value') == "登录"){
        $(this).attr('value','取消');
        $('.loginframe').attr('data-show','yes');
    }else if($(this).attr('value') == "取消"){
        $(this).attr('value','登录');
        $('.loginframe').attr('data-show','no');
    }
}

function changeFrontForm(){
    if($(this).attr('value') == '注册账户'){
        $('#form-1').attr('data-front', 'no');
        $('#form-2').attr('data-front', 'yes');
    }
    if($(this).attr('value') == '返回登录'){
        $('#form-1').attr('data-front', 'yes');
        $('#form-2').attr('data-front', 'no');
    }
}

function signinProcess(){

}

function singupProcess(){
    var req = new Ajax.Request(
        String($('#form-2 [name=actName]').first().val()),
        'anytoken');
        req.appendArgs('pswd', 
            String($('#form-2 [name=pswd]').first().val()));
        req.appendArgs('email', 
            String($('#form-2 [name=email]').first().val()));
        
    var port = new Ajax.Port('cgi-bin/S_AccountCreate.py');
    port.postRequest(req, [new RefreshToken(),
        new DisplayResult()]);
}

class DisplayResult implements Ajax.Task{
    execute(req:Ajax.Reply){
        if(!req.result()){
            alert(req.reason());
            return;
        }
        alert('您的账户创建成功！');
        $('#accessBtn').trigger('click');
    }

    errorRespond(url:string){}
}


function checkAccount(){
    var port = new Ajax.Port('cgi-bin/S_AccountCheck.py');
    var actName = String($(this).val())

    var request = new Ajax.Request(actName,'anytoken');
    
    port.postRequest(request, [new PrintLoginLog()]);
}

class PrintLoginLog implements Ajax.Task{
    execute(res:Ajax.Reply){
        $('#msg-out').text(res.reason());
    }
    errorRespond(){}
}