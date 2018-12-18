import { Store } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import $ = require('jquery')

$(document).ready(() => {
    var access = new Store.Access(Store.Type.Local);
    var actName = access.getValue('actName');
    var token = access.getValue('token');
    
    if(actName == null || token == null){
        actName = 'anyOne';
        token = 'anyToken';
    }

    var port = new Ajax.Port('cgi-bin/S_AccountCheck.py');
    var req = new Ajax.Request(actName, token);
    port.postRequest(req, [new MyTask(), new RefreshToken()]);
});

class MyTask implements Ajax.Task {
    execute(data: Ajax.Reply) {
        alert('Account is empty? ' + data.result() + "\nnewToken = " + data.newToken())
    }
    errorRespond(url:string) {}
}

class RefreshToken implements Ajax.Task{
    execute(data:Ajax.Reply){
        var port = new Store.Access(Store.Type.Local);
        port.setValue('token', data.newToken());
    }
    errorRespond(url:string){}
}