export class StorageService {
  private storage: Storage;

  constructor() {
    if (!window.localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.storage = localStorage;
  }

  exists(key: string): boolean {
    return !!this.storage.getItem(key);
  }

  retrieve(key: string): any {
    const result = this.storage.getItem(key);
    if (result === undefined || result == null) {
      return null;
    }
    try {
      return JSON.parse(result);
    } catch (e) {
      return result;
    }
  }

  store(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    return this.storage.removeItem(key);
  }

}
