/**
 * Created by wangshuai on 2017/6/11.
 */

//-------------------------------------------------------
// 网页可用前，初始化执行环境
//
// 要么是存储了有用信息的，要么是'null'，只有这两个状态
function OnLoadTestAndInitEnvironment(){
    var storage = window.localStorage;

    var accountName = storage.getItem("accountName");
    var accessKey = storage.getItem("accessKey");

    // 如果关健值未赋值
    if(accessKey == null || accountName == null){
        storage.setItem("accountName", "null");
        storage.setItem("accessKey", "null");
    }
}
//-------------------------------------------------------










//----------------------------------------------------------------------
// 通用的页面加载完整过程
//
// 打开页面加载预设内容
function RefreshPageOnLoadEvent(){
    OnLoadTestAndInitEnvironment();
    LoadNavigateIconContent();
    var hotArticle = document.getElementById('newstab-header').firstElementChild
    LoadCenterTabControlContent(hotArticle.firstElementChild);
}
//-------------------------------------------------------------------------












//------------------------------------------------------
// 登录相关功能函数模块
//
// 登录，输入用户名与密码，获取授权码
function Get_accessCode(){
    var nameInput = document.getElementById('accountName');
    var passwordInput = document.getElementById('accountPassword');

    if(nameInput.value == '' || passwordInput.value == '')
        return;

    var httpRequest = new XMLHttpRequest();
    httpRequest.open("Get", "cgi-bin/LoginProcess.py?name="+nameInput.value + '&password=' + passwordInput.value, true);
    httpRequest.onreadystatechange = function (ev){
        var repose = ev.target.responseText;
        if(repose=='' || repose == 'no_name' || repose=='no_data' || repose=='passworderror' )
            return;

        window.localStorage.setItem('accessKey',repose);
        window.localStorage.setItem('accountName',nameInput.value);
        Cancel_LoginPanel();
        RefreshPageOnLoadEvent();
    }
    httpRequest.send();
}
// 调出隐藏的登录面板
function Call_LoginPanel(){
    var panel = document.getElementById("loginpanel");
    panel.style.display = 'block';
}
// 隐藏显示的登录面板
function Cancel_LoginPanel(){
    var panel = document.getElementById("loginpanel");
    panel.style.display = 'none';
}
//-------------------------------------------------------




//-----------------------------------------------------
// 加载图标导航内容功能模块
//
// 异步完成加载navigate栏目内容
function async_navigateProcess(event){
    if (event.target.readyState == XMLHttpRequest.DONE && event.target.status == 200){
        var navigateIconCollect = document.getElementById("navigate-icon");

        //Clear all the animation
        for(var eleCount = navigateIconCollect.childElementCount;
            eleCount>0;--eleCount){
            navigateIconCollect.removeChild(navigateIconCollect.firstElementChild);
        }

        // load content
        var getTextContent = event.target.responseText;

        navigateIconCollect.innerHTML = getTextContent.substring(getTextContent.indexOf('li')-1,getTextContent.lastIndexOf('li')+2);
    }
}
// 加载navigate栏目图标
function LoadNavigateIconContent(){
    var navigateIconCollect = document.getElementById("navigate-icon");
    if (navigateIconCollect == null)
        return;

    var httpRequest = new XMLHttpRequest();

    var storage = window.localStorage;
    var accountName = storage.getItem("accountName");
    var accessKey = storage.getItem("accessKey");

    httpRequest.onreadystatechange = async_navigateProcess;

    if(accessKey == "null" || accountName == "null"){
        httpRequest.open("GET", "index_src/StaticNavigate.xml");
    }else{
        httpRequest.open("GET", "cgi-bin/GetCustomNavigateContent.py?name="+accountName+"&accesskey="+accessKey, true);
    }

    httpRequest.send();
}
//------------------------------------------------------





function LoadCenterTabControlContent(obj){
}
