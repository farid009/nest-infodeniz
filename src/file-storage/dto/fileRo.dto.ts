import { File } from '@prisma/client';
import { Id } from '@src/shared/types';
export class FileRoDto {
  id!: Id;
  name: string;

  extension: string;

  accessUrl: string;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.extension = file.extension;
    this.accessUrl = file.accessUrl;
  }
}
