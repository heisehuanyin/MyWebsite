import { StorageAccess, StorageType } from './BrowserStorage';
import { Ajax } from './ActiveAjax';
import $ = require('jquery')

$(document).ready(() => {
    var port = new Ajax.Port('cgi-bin/S_AccountCheck.py');
    var req = new Ajax.Request('act', 'anytoken');
    port.postRequest(req, recieve);
});

function recieve(data: Ajax.Respond): void {
    alert('Account is empty? ' + data.result() + "\nnewToken" + data.newToken())
}