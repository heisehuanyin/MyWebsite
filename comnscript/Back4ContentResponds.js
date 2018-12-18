
//创建一个便捷接口，通过本接口存储指定格式数据=================================================================
function BrowserStorage(type_StorageTypeItem) {
    this._type_StorageType = type_StorageTypeItem;

    this.getValue_string = (key_string, default_string) => {
        if (this._type_StorageType == 0)
            var v = localStorage.getItem(key_string);
        else {
            v = sessionStorage.getItem(key_string);
        }
        if (v == null) {
            return default_string;
        }
        else {
            return v;
        }
    }

    this.setValue_void = (key_string, value_string) => {
        if (this._type_StorageType) {
            this.localStorage.setItem(key_string, value_string);
        } else {
            this.sessionStorage.setItem(key_string, value_string);
        }
    }


}
//存储类型，新建BrowserStorage的时候提供参数
var StorageType = {
    LocalStorage: 0,
    SessionStorage: 1
}


//创建一个接口，用于与服务器进行Ajax交互，配置规定格式数据源，自动格式化==================================================
function AjaxPort(url_string){
    this.port_url = url_string;
    this.method_work = 0;

    this.postRequest = (req_ajaxRequest, recieve_method_ajaxRespond_) => {
        this.method_work = recieve_method_ajaxRespond_;

        var datax = {};
        datax.method = "POST";
        datax.url = this.port_url;
        datax.data = req_ajaxRequest.postData;
        datax.success = this._success;
        $.ajax(datax);

        this.workState = 0;
        return this.ajaxRespond;
    }

    this._success = (data, states, msg) => {
        var x = new ajaxRespond($(data));
        this.method_work(x);
    }

}

//自动生成的数据，包含返回数据
function ajaxRespond(data_JQuery){
    this.data = data_JQuery 
    
    this.result_bool = () => {
        var temp = this.data;
        var resultNode = temp.find('result').first();
        console.log("==========>>>>>>>>>>>>>>>")
        console.log(resultNode);

        if (resultNode.attr('value') == 'True')
            return true;
        else
            return false;
    }

    this.reason_string = () => {
        var temp = this.data;
        var reasonNode = temp.find('reason').first();
        return reasonNode.text();
    }

    this.newToken_string = () => {
        var tokenNode = this.data.find('token').first();
        return tokenNode.attr('token');
    }

    this.xmlContent_JQuery = () => {
        return this.data.find('content').first();
    }
    this.textContent_string = () => {
        return this.xmlContent_JQuery.prop('innerHTML');
    }
}

//生成一个request数据源,数据源的固有属性是actName和token
function ajaxRequest(actName_string, token_string){

    this.postData = {
        "actName":actName_string,
        "token":token_string
    }

    this.appendArgs_void = (key_string, value_string) => {
        postData[key_string] = value_string;
    }

    this.appendTextContent = (key_string, text_string) => {
        this.appendArgs_void(key_string, text_string);
    }

    this.appendXMLContent = (key_string, content_JQuery) => {
        var x = content_JQuery.prop('outerHTML');
        this.appendTextContent(key_string, x);
    }
}

//code for work======================================================================================================
$(document).ready(
    () => {
        var ajaxp = new AjaxPort('cgi-bin/S_AccountCheck.py');
        var req = new ajaxRequest('pla', 'anyToken');
        //recieve: (request:ajaxRequest)=>void
        var respd = ajaxp.postRequest(req, recieve);
    }
);

function recieve(respd){
        alert(respd.result_bool() + ":" + respd.reason_string());
        alert("newToken:"+respd.newToken_string());
}
