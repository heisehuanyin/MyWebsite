export namespace Store{
    export enum Type {
        Local,
        Session
    }
    
    export class Access {
        private _type;
    
        /**
         * 利用本接口访问浏览器存储
         * @param type 接口类型
         */
        constructor(type: Type) {
            this._type = type;
        }
    
        /**
         * 获取浏览器存储数据
         * @param key 键名
         * @returns 值
         */
        public getValue(key: string): string {
            if (this._type == Type.Local)
                return localStorage.getItem(key);
            else {
                return sessionStorage.getItem(key);
            }
        }
        /**
         * 将键值对写入浏览器存储
         * @param key 键名
         * @param value 键值
         */
        public setValue(key: string, value: string): void {
            if (this._type == Type.Local) {
                localStorage.setItem(key, value);
            } else {
                sessionStorage.setItem(key, value);
            }
        }
        /**
         * 删除存储中的指定键值对
         * @param key 指定键
         */
        public removeValue(key:string){
            if(this._type == Type.Local)
                localStorage.removeItem(key);
            else
                sessionStorage.removeItem(key);
        }

        /**
         * 获取用户上次浏览时候在浏览器缓存中存储的数据
         * @returns 浏览数据，是一个方便类型
         */
        public getNavDataFormLocalStorage():NavData{
            var x:{[key:string]:string} = { "__t":"x" };

            var numStr = this.getValue('NavDataCount');
            if(numStr == null)
                numStr = "" + 0;
            var numCount = Number(numStr);

            for(var w=0; w < numCount; ++w){
                var target = this.getValue('NavitemCount_'+ w);
                x[target.slice(target.indexOf(':')+1)] = 
                        target.slice(0,target.indexOf(":"));
            }

            delete x.__t;
            return new NavData(x);
        }

        /**
         * 为缓存中的指定网址浏览记录加1
         * @param url 网址地址
         */
        public refreshNaviDataAtLocalStorage(url:string):void{
            //NavDataCount = 5;
            //NavitemCount_1 = 9:www.bbb.com
            var numStr = this.getValue('NavDataCount');
            if(numStr == null)
                numStr = "" + 0;
            var numCount = Number(numStr);

            for(var x=0; x < numCount; ++x){
                var target = this.getValue('NavitemCount_' + x);
                if(target.slice(target.indexOf(':')+1) == url){
                    var NavNum = Number(target.slice(0,target.indexOf(':')));
                    this.setValue('NavitemCount_' + x, NavNum+1 + ":" + url);
                    return;
                }
            }
            this.setValue("NavitemCount_"+numCount, 1+":"+url);
            this.setValue('NavDataCount', String(numCount+1));
        }

        /**
         * 清除浏览器中的用户浏览数据
         */
        public clearNaviDataAtLocalStorage():void{
            //NavDataCount = 5;
            //NavitemCount_1 = 9:www.bbb.com
            var numStr = this.getValue('NavDataCount');
            if(numStr == null)
                numStr = "" + 0;
            var numCount = Number(numStr);

            for(var x=0; x < numCount; ++x){
                this.removeValue('NavitemCount_' + x);
            }
            this.removeValue('NavDataCount');
        }

    }
    export class NavData{
        private data:{[key:string]:string} = {'key':'value'};

        /**
         * 利用从浏览器中获取的数据生成实例，不传数据也可以后期利用接口赋值
         * @param navData 从浏览存储中获取的用户数据，普通js对象
         */
        constructor(navData?:{[key:string]:string}){
            if(navData){
                this.data = navData;
            }
            delete this.data.key;
        }

        /**
         * 本方法将指定实例内的数据汇聚到本实例内，是一个便捷方法
         * @param navData 其他同类数据实例
         */
        public mergeNavData(navData:NavData):void{
            var xdata = navData.getInData();
            for(var item in xdata){
                if(this.data[item] != null){
                    var clickNum = Number(this.data[item]);
                    this.data[item] = String(clickNum + Number(xdata[item]));
                }else{
                    this.data[item] = xdata[item];
                }
            }
        }

        /**
         * 利用指定格式的字符串初始化本数据单元内的数据
         * @warring 本方法将删除原实例内的数据
         * @param formateStr 本类型生成的格式组成的字符串
         */
        public parseString(formateStr:string):void{
            var xlist = formateStr.split('：');
            this.data = {}
            
            for(var item in xlist){
                this.data[item.slice(1,item.indexOf(']'))] = 
                    item.slice(item.indexOf(']')+1);
            }
        }
        /**
         * 获取数据的文本描述
         * @returns 获取本数据的文本描述
         */
        public toString():string{
            var rtn:string = '{';
            for(var item in this.data){
                rtn += "[" + item + "]" + this.data[item] + "：";
            }
            rtn += "}";
            return rtn;
        }

        /**
         * 获取内部数据，改数据是一个普通JavaScript键值对
         * @returns js键值对表示的数据
         */
        public getInData():{[key:string]:string}{
            return this.data;
        }

    }
}
