import { File } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'file' })
  file!: File;
}
