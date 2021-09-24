import { Injectable } from '@nestjs/common';
import { File, Prisma, User } from '@prisma/client';
import { AuthorizationService } from '@src/authorization/authorization.service';
import { EmailQueueService } from '@src/email-management/email.service';
import { FileStorageService } from '@src/file-storage/file-storage.service';
import { AppExtension } from '@src/file-storage/file-storage.type';
import { PrismaService } from '@src/shared/modules/prisma-management/prisma.service';
import { Id } from '@src/shared/types';
import { hash, verify } from 'argon2';
import { extension } from 'mime-types';
import { UserRole } from './user.type';

@Injectable()
export class UserService {
  private readonly adminUserEmail = 'admin@infodeniz.com';
  constructor(
    private prismaService: PrismaService,
    private authorizationService: AuthorizationService,
    private fileStorageService: FileStorageService,
    private emailQueueService: EmailQueueService,
  ) {}

  async add(
    userRole: UserRole,
    userObj: Prisma.UserCreateInput,
  ): Promise<User> {
    userObj.password = await hash(userObj.password);

    const user = await this.prismaService.user.create({ data: userObj });

    await this.authorizationService.addRoleToUser(user.id, userRole);
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async checkExistByEmail(email: string): Promise<boolean> {
    const count = await this.prismaService.user.count({ where: { email } });

    return count > 0 ? true : false;
  }

  async verifyUserPassword(
    userPassword: string,
    password: string,
  ): Promise<boolean> {
    return await verify(userPassword, password);
  }

  async addFile(
    userId: Id,
    fileObj: { filename: string; mimetype: string },
  ): Promise<File> {
    const fileMimeType = fileObj.mimetype;
    const fileName = fileObj.filename;
    const fileExt = <AppExtension>extension(fileMimeType);
    const fileAccessUrl =
      this.fileStorageService.generateFileAccessUrl(fileName);
    const file = await this.fileStorageService.add({
      name: fileName,
      accessUrl: fileAccessUrl,
      mimetype: fileMimeType,
      extension: fileExt,
      ownerUser: { connect: { id: userId } },
    });

    await this.emailQueueService.send(
      'notify@infodeniz.com',
      this.adminUserEmail,
      'new-file-added',
      `<p>new file added</p>`,
    );
    return file;
  }

  async getAllFiles(userId: Id): Promise<File[]> {
    return await this.fileStorageService.getAllByOwnerUserId(userId);
  }

  async removeFile(userId: Id, fileId: Id): Promise<void> {
    await this.fileStorageService.removeOneByIdAndOwnerUserId(fileId, userId);
  }
}
