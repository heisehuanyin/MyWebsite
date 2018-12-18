export enum StorageType {
    LocalStorage,
    SessionStorage
}

export class StorageAccess {
    private _type;

    constructor(type: StorageType) {
        this._type = type;
    }

    public getValue(key: string): string {
        if (this._type == StorageType.LocalStorage)
            return localStorage.getItem(key);
        else {
            return sessionStorage.getItem(key);
        }
    }
    public setValue(key: string, value: string): void {
        if (this._type == StorageType.LocalStorage) {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    }
}
