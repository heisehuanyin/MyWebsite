import $ = require("jquery")

export namespace Ajax {
    export class Request {
        private _data: { [key: string]: string; } = {
            "t" : 'no'
        };

        constructor(actName: string, token: string) {
            this._data['actName'] = actName;
            this._data['token'] = token;
        }
        public appendArgs(key: string, value: string) {
            this._data[key] = value;
        }
        public appendXMLContent(key: string, value: JQuery) {
            this._data[key] = value.prop('outerHTML');
        }

        public getData(): { [key: string]: string } { return this._data; };
    }

    export class Respond {
        private _result: JQuery;

        constructor(result:JQuery<HTMLElement>) {
            this._result = result;
        }

        public result(): boolean {
            var temp = this._result;
            var resultNode = temp.find('result').first();
            if (resultNode.attr('value') == 'True')
                return true;
            else
                return false;
        }
        public reason(): string {
            var temp = this._result;
            var reasonNode = temp.find('reason').first();
            return reasonNode.prop('innerHTML');
        }
        public newToken(): string {
            var tokenNode = this._result.find('token').first();
            return tokenNode.attr('token');
        }
        public xmlContent(): JQuery<HTMLElement> {
            return this._result.find('content').first();
        }
        public textContent(): string {
            return this._result.find('content').first().prop('innerHTML');
        }
    }

    export class Port {
        private recieve:(respond:Respond)=>void;
        private url:string;

        constructor(url:string) { this.url = url;}

        public postRequest(req: Request, recieve: (respond:Respond)=>void ):void {
            this.recieve = recieve;

            $.ajax({
                method:'POST',
                url:this.url,
                data:req.getData(),
                success:this.processServerResponds,
                error:this.ajaxOperateFailed
            });
        }

        private processServerResponds(data:any):void{
            var x:Respond = new Respond(jQuery(data));

            this.recieve(x);
        }

        private ajaxOperateFailed(jqxhr, status, errorMSG){
            console.log('ajax请求错误=》'+ status + errorMSG)
        }
    }
}