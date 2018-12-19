import $ = require("jquery")

export namespace Ajax {
    /**
     * 类型用来规范ajax请求参数的填充
     */
    export class Request {
        private _data: { [key: string]: string; } = {
            "t" : 'no'
        };

        /**
         * 新建一个ajaxRequest，利用本类型附带方法填充参数，自动格式化
         * @param actName 用户名
         * @param token token字符串
         */
        constructor(actName: string, token: string) {
            this._data['actName'] = actName;
            this._data['token'] = token;
        }
        /**
         * 向Request中添加参数键值对，供服务器读取
         * @param key 键名
         * @param value 键值
         */
        public appendArgs(key: string, value: string) {
            this._data[key] = value;
        }
        /**
         * 向Request中添加参数键值对，value可以直接填充JQuery节点，自动格式化
         * @param key 键名
         * @param value JQuery XML节点
         */
        public appendXMLContent(key: string, value: JQuery) {
            this._data[key] = value.prop('outerHTML');
        }

        /**
         * 获取格式化完成的数据
         * @returns 实际ajax要用到的数据
         */
        public getData(): { [key: string]: string } { return this._data; };
    }

    /**
     * 类型用于格式化ajax获取的数据
     */
    export class Reply {
        private data:any;
        private _result: JQuery;

        constructor(result:any) {
            this.data = result;
            this._result = $(result);
        }

        /**
         * 返回原始数据类型，此方法专用于获取服务器静态文件，不遵守cgi固定格式
         * @returns 原始数据
         * */
        public representData():any{
            return this.data;
        }

        /**
         * 从标准cgi回复中获取执行结果
         * @returns 判断
         */
        public result(): boolean {
            var temp = this._result;
            var resultNode = temp.find('result').first();
            if (resultNode.attr('value') == 'True')
                return true;
            else
                return false;
        }
        /**
         * 从标准cgi回复中获取原因
         * @returns 原因
         */
        public reason(): string {
            var temp = this._result;
            var reasonNode = temp.find('reason').first();
            return reasonNode.prop('innerHTML');
        }
        /**
         * 从标准cgi回复中获取新token
         * @returns 新token
         */
        public newToken(): string {
            var tokenNode = this._result.find('token').first();
            return tokenNode.attr('token');
        }
        /**
         * 从标准cgi回复中获取附加内容节点中的xml
         * @returns 返回的是JQuery对象，需要注意
         */
        public xmlContent(): JQuery<HTMLElement> {
            return this._result.find('content').first();
        }
        /**
         * 从标准cgi回复中获取附加内容节点中的text
         * @readonly 返回附加的text文本，意味着这些内容无论什么格式，都被当成text返回
         */
        public textContent(): string {
            return this._result.find('content').first().prop('innerHTML');
        }
    }

    export interface Task{
        /**
         * 当请求完成的时候，自动调用本方法
         * @param reply ajax回复获取的数据单元
         */
        execute(reply:Reply):void;

        /**
         * 当ajax请求出现问题的时候，自动调用本方法
         * @param url ajax指向的url链接
         */
        errorRespond(url:string):void;
    }

    export class Port{
        private resolve:Array<Task> = new Array<Task>();
        private url:string;

        /**
         * 构建一个指向指定url连接的ajax端口
         * @param url 指向链接
         */
        constructor(url:string) { this.url = url;}

        /**
         * 向端口发送一个Request，并附带异步任务
         * @param req Request数据
         * @param tasks 异步任务，完成后自动调用
         */
        public postRequest(req: Request, tasks:Task[] ):void {
            this.resolve = this.resolve.concat(tasks);

            $.ajax({
                method:'POST',
                url:this.url,
                data:req.getData(),
                success:this.processServerResponds.bind(this),
                error:this.ajaxOperateFailed.bind(this)
            });
        }

        private processServerResponds(data:any):void{
            var x:Reply = new Reply(data);

            for (var item in this.resolve){
                this.resolve[item].execute(x);
            }
        }

        private ajaxOperateFailed(jqxhr, status, errorMSG){
            console.log('ajax请求出错:status('+ status +")"+ errorMSG);
            
            for (var item in this.resolve){
                this.resolve[item].errorRespond(this.url);
            }
        }
    }
}