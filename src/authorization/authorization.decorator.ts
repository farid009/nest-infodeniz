import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES_METADATA } from './authorization.config';
import { IRole } from './authorization.interface';

export const UseRoles = (...roles: IRole[]): CustomDecorator =>
  SetMetadata(ROLES_METADATA, roles);
