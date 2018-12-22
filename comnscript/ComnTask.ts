import {Ajax} from './ActiveAjax'
import {Store} from './BrowserStorage'
import $ = require('jquery')

/**
 * 常用任务单元，根据ajax获取的回复中的token，
 * 刷新浏览器本地存储中的token
 */
export class RefreshToken implements Ajax.Task{
    execute(data:Ajax.Reply){
        var port = new Store.Access(Store.Type.Local);
        port.setValue('token', data.newToken());
    }
    errorRespond(url:string){}
}

/**
 * 显示账户查询操作结果
 */
export class AccountMsg implements Ajax.Task{
    execute(res:Ajax.Reply){
        $('#msg-out').text(res.reason());
    }
    errorRespond(){}
}

/**
 * 账户的注册和登录操作结果进行展示，并退出该界面
 */
export class AccountResult implements Ajax.Task{
    private actName:string='';
    
    constructor(actName:string){
        this.actName = actName;
    }

    execute(req:Ajax.Reply){
        if(!req.result()){
            alert(req.reason());
            return;
        }
        var access = new Store.Access(Store.Type.Local);
        access.setValue('actName', this.actName);
        alert(req.reason());
        $('#accessBtn').trigger('click');
    }

    errorRespond(url:string){}
}


/**
 * 设计用来进行页面的总体渲染任务，
 * 也掌管渲染数据的上传任务
 */
export class PageRender implements Ajax.Task{
    private act:string;
    private token:string;

    constructor(actName:string, token:string){
        this.act = actName;
        this.token = token;
    }

    execute(reply:Ajax.Reply){
        if(! reply.result()){
            return;
        }
        var replyStr = reply.textContent();
        var cfgData = new Store.Access(Store.Type.Local)
            .getNavDataFormLocalStorage();
        cfgData.parseString(replyStr);

        var request = new Ajax.Request(this.act, this.token);
        request.appendArgs('type', 'NavigateData');
        request.appendArgs('content', cfgData.toString());
        var port = new Ajax.Port('cgi-bin/S_4ConfigUpload.py');
        port.postRequest(request, [new RefreshToken()]);

        new HotAccessEdit(cfgData).do();
    }
    errorRespond(url){
        console.log(url+ ':服务器链接错误.........');
    }
}

/**
 * 热点访问区域编辑，用来根据传入数据对快速访问区域进行编辑
 */
class HotAccessEdit {
    private data = new Store.NavData();

    constructor(navData:Store.NavData){
        this.data = navData;
    }

    public do(){
        var linkdata = this.data.getInData();
        console.log(linkdata);

        var targetNode = $('.right .iconSet').first();
        targetNode.remove('li');

        $('.navigate >li').each(()=>{
            console.log($(this));
        })
        
    }
}

