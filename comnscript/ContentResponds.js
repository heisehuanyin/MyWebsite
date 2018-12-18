
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

    this.ajaxRespond = 0;

    //=0表示人物未开始，<0表示服务器未回复，>0表示处理结束
    this.workState = 0;

    this.postRequest_ajaxRespond = (req_ajaxRequest) => {
        this.workState = -1;

        $.ajax({
            method : "POST",
            url: this.port_url,
            data: req_ajaxRequest.postData,
            success: this._success,
            error:this._error
        })
        while(this.workState < 0){
            setTimeout(()=>{
                console.log('等待服务器数据..........')
            }, 50)
            this.workState--;
        }

        this.workState = 0;
        return this.ajaxRespond;
    }

    this._success = (data) => {
        var x = $(data);
        this.ajaxRespond = new ajaxRespond(x);

        this.workState = 1;
    }

    this._error = () => {
        this.workState = 1;
    }

}

//自动生成的数据，包含返回数据
function ajaxRespond(data_JQuery){
    this.data = data_JQuery;

    this.result_bool = () => {
        var temp = this.data;
        var resultNode = temp.filter('result').first();
        if (resultNode.attr('value') == 'True')
            return true;
        else
            return false;
    }

    this.reason_string = () => {
        var temp = this.data;
        var reasonNode = temp.filter('reason').first();
        return reasonNode.prop('innerHTML');
    }

    this.newToken_string = () => {
        var tokenNode = this.data.filter('token').first();
        return tokenNode.attr('token');
    }

    this.xmlContent_JQuery = () => {
        return this.data.filter('content').first();
    }
    this.textContent_string = () => {
        return this.xmlContent_JQuery.prop('innerHTML');
    }
}

//生成一个request数据源,数据源的固有属性是actName和token
function ajaxRequest(actName_string, token_string){

    this.postData = {
        actName:actName_string,
        token:token_string
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


$(document).ready(
    () => {
        var ajaxp = new AjaxPort('cgi-bin/S_AccountCheck.py');
        var req = new ajaxRequest('pla', 'anyToken');
        var respd = ajaxp.postRequest_ajaxRespond(req);
        alert(respd.result_bool + ":" + respd.reason_string);
        alert("====================");
    }
);
