import { Log, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/modules/prisma-management/prisma.service';

@Injectable()
export class LogService {
  constructor(private prismaService: PrismaService) {}

  async add(logObj: Prisma.LogCreateInput): Promise<Log> {
    return await this.prismaService.log.create({ data: logObj });
  }
}
