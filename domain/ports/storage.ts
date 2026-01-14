export interface StorageAdapter {
  put(key: string, file: Blob): Promise<string>; // devuelve URL
}
