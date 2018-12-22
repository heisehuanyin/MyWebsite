import {Ajax} from './ActiveAjax'
import {Store} from './BrowserStorage'
import $ = require('jquery')

export class MyTask implements Ajax.Task {
    execute(data: Ajax.Reply) {
        alert('Account is empty? ' + data.result() + "\nnewToken = " + data.newToken())
    }
    errorRespond(url:string) {}
}

export class RefreshToken implements Ajax.Task{
    execute(data:Ajax.Reply){
        var port = new Store.Access(Store.Type.Local);
        port.setValue('token', data.newToken());
    }
    errorRespond(url:string){}
}


export class PrintLoginLog implements Ajax.Task{
    execute(res:Ajax.Reply){
        $('#msg-out').text(res.reason());
    }
    errorRespond(){}
}

export class DisplayResult implements Ajax.Task{
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
