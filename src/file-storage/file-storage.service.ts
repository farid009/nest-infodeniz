import { File, Prisma } from '.prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Id } from '@src/shared/types';
import { PrismaService } from '../shared/modules/prisma-management/prisma.service';

@Injectable()
export class FileStorageService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async add(fileObj: Prisma.FileCreateInput): Promise<File> {
    return await this.prismaService.file.create({ data: fileObj });
  }

  async getAllByOwnerUserId(ownerUserId: Id): Promise<File[]> {
    return await this.prismaService.file.findMany({
      where: {
        ownerUserId: ownerUserId,
      },
    });
  }

  async removeOneByIdAndOwnerUserId(
    fileId: Id,
    ownerUserId: Id,
  ): Promise<void> {
    console.log(fileId);
    console.log(ownerUserId);
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerUserId: ownerUserId,
      },
    });

    if (!file) {
      throw new NotFoundException('فایل مورد نظر یافت نشد');
    }

    await this.prismaService.file.delete({
      where: { id: fileId },
    });
  }

  generateFileAccessUrl(fileName: string): string {
    return `${this.configService.get(
      'fileStorage.accessFileEndpoint',
    )}/${fileName}`;
  }
}
