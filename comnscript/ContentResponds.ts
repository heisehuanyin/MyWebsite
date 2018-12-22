import { Store } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import { 
    RefreshToken, 
    AccountResult, 
    AccountMsg, 
    PageRender,
    NavDataUpload} from './ComnTask'
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
        token = 'anytoken';
    }


    var request = new Ajax.Request(actName, token);
    request.appendArgs('type','NavigateData');
    var port = new Ajax.Port('cgi-bin/S_4ConfigDownload.py');

    port.postRequest(request, [new RefreshToken(),
                            new NavDataUpload(actName, token),
                            new PageRender()]);

    //TODO: 向服务器发送请求获取自定义的配置
    //TODO: 利用自定义配置对页面进行重新渲染

});







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
    var actName = String($('#form-1 input[name=actName]').val());
    var req = new Ajax.Request(actName,'anytoken');
        req.appendArgs('pswd', String($('#form-1 input[name=pswd]').val()));
    
    var port = new Ajax.Port('cgi-bin/S_AccountLogin.py');
    port.postRequest(req, [new RefreshToken(),
        new AccountResult(actName)]);
}

function singupProcess(){
    var actName = String($('#form-2 [name=actName]').first().val());
    var req = new Ajax.Request(actName,'anytoken');
        req.appendArgs('pswd', 
            String($('#form-2 [name=pswd]').first().val()));
        req.appendArgs('email', 
            String($('#form-2 [name=email]').first().val()));
        
    var port = new Ajax.Port('cgi-bin/S_AccountCreate.py');
    port.postRequest(req, [new RefreshToken(),
        new AccountResult(actName)]);
}
function checkAccount(){
    var port = new Ajax.Port('cgi-bin/S_AccountCheck.py');
    var actName = String($(this).val())

    var request = new Ajax.Request(actName,'anytoken');
    port.postRequest(request, [new AccountMsg()]);
}