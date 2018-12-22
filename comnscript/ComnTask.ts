import {Ajax} from './ActiveAjax'
import {Store} from './BrowserStorage'
import $ = require('jquery')

export class RefreshToken implements Ajax.Task{
    execute(data:Ajax.Reply){
        var port = new Store.Access(Store.Type.Local);
        port.setValue('token', data.newToken());
    }
    errorRespond(url:string){}
}


export class AccountMsg implements Ajax.Task{
    execute(res:Ajax.Reply){
        $('#msg-out').text(res.reason());
    }
    errorRespond(){}
}

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
