import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  getData(key: string): any {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }

  getString(key: string): string {
    return localStorage.getItem(key) || '';
  }

  clearAll(): void {
    localStorage.clear();
  }
}
