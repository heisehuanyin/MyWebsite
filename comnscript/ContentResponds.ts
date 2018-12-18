import { StorageAccess, StorageType } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import $ = require('jquery')

$(document).ready(() => {
    var port = new Ajax.Port('cgi-bin/S_AccountCheck.py');
    var req = new Ajax.Request('act', 'anytoken');
    port.postRequest(req, new MyTask());
});

class MyTask implements Ajax.Task {
    execute(data: Ajax.Reply) {
        alert('Account is empty? ' + data.result() + "\nnewToken = " + data.newToken())
    }
    errorRespond() {

    }
}