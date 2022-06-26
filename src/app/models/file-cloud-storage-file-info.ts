import { Entity } from './entity';

export interface FileCloudStorageFileInfo extends Entity<string> {
  id: string;
  name: string;
  parents: string[] | null;
  size?: number;
  createdTime?: Date;
  mimeType: string
}