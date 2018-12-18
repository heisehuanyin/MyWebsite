export namespace Store{
    export enum Type {
        Local,
        Session
    }
    
    export class Access {
        private _type;
    
        constructor(type: Type) {
            this._type = type;
        }
    
        public getValue(key: string): string {
            if (this._type == Type.Local)
                return localStorage.getItem(key);
            else {
                return sessionStorage.getItem(key);
            }
        }
        public setValue(key: string, value: string): void {
            if (this._type == Type.Local) {
                localStorage.setItem(key, value);
            } else {
                sessionStorage.setItem(key, value);
            }
        }
    }
    
}