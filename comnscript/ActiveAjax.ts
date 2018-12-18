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

    export class Reply {
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

    export interface Task{
        execute(reply:Reply):void;
        errorRespond():void;
    }

    export class Port{
        public resolve:Array<Task> = new Array<Task>();
        private url:string;

        constructor(url:string) { this.url = url;}

        public postRequest(req: Request, reciever:Task[] ):void {
            this.resolve.concat(reciever);
            console.log(this.resolve);

            $.ajax({
                method:'POST',
                url:this.url,
                data:req.getData(),
                success:this.processServerResponds.bind(this),
                error:this.ajaxOperateFailed.bind(this)
            });
        }

        private processServerResponds(data:any):void{
            var x:Reply = new Reply($(data));

            for (var item in this.resolve){
                this.resolve[item].execute(x);
                console.log(item);
            }
        }

        private ajaxOperateFailed(jqxhr, status, errorMSG){
            console.log('ajax请求出错:status('+ status +")"+ errorMSG);
            
            for (var item in this.resolve){
                this.resolve[item].errorRespond();
            }
        }
    }
}