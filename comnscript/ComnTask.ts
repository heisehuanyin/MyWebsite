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