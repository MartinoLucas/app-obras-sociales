import fs from 'node:fs/promises';
import path from 'node:path';
import { StorageAdapter } from '@/domain/ports/storage';

const BASE = path.join(process.cwd(), 'public', 'uploads');

export class LocalStorageAdapter implements StorageAdapter {
  async put(key: string, file: Blob): Promise<string> {
    const buff = Buffer.from(await file.arrayBuffer());
    const filepath = path.join(BASE, key);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buff);
    return `/uploads/${key}`;
  }
}
