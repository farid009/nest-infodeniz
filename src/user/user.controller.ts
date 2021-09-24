import { File } from '.prisma/client';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticateGuard } from '@src/authentication/authentication.guard';
import { FileRoDto } from '@src/file-storage/dto';
import { CurrentUser } from '@src/shared/decorators';
import { Id } from '@src/shared/types';
import { Express } from 'express';
import { UserService } from './user.service';
@Controller('v1/users')
@UseGuards(JwtAuthenticateGuard)
@ApiTags('users')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Post('/files')
  @ApiBearerAuth('access-token')
  async addFile(
    @CurrentUser('userId') userId: Id,
    @UploadedFile()
    fileObj: Express.Multer.File,
  ): Promise<File> {
    return await this.userService.addFile(userId, {
      filename: fileObj.filename,
      mimetype: fileObj.mimetype,
    });
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Get('files')
  async getFiles(@CurrentUser('userId') userId: Id): Promise<FileRoDto[]> {
    const files = await this.userService.getAllFiles(userId);
    const res = files.map((f) => new FileRoDto(f));

    return res;
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Delete('files/:fileId')
  async removeFile(
    @CurrentUser('userId') userId: Id,
    @Param('fileId') fileId: Id,
  ): Promise<void> {
    await this.userService.removeFile(userId, fileId);
  }
}
