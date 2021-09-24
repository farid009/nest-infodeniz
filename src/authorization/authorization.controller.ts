import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticateGuard } from '@src/authentication/authentication.guard';
import { Id } from '@src/shared/types';
import { UserRole } from '@src/user/user.type';
import { UseRoles } from './authorization.decorator';
import { AuthorizeRBACGuard } from './authorization.guard';
import { IPermission, IRole } from './authorization.interface';
import { AuthorizationService } from './authorization.service';

@Controller('v1/authorization')
@UseGuards(JwtAuthenticateGuard, AuthorizeRBACGuard)
@UseRoles(UserRole.ADMIN)
@ApiTags('authorization-admin')
@ApiBearerAuth('access-token')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  async addRoleToUser(userId: Id, role: IRole): Promise<boolean> {
    return await this.authorizationService.addRoleToUser(userId, role);
  }

  async getUserRoles(userId: Id): Promise<string[]> {
    return await this.authorizationService.getUserRoles(userId);
  }

  async getRoleUsers(role: IRole): Promise<string[]> {
    return await this.authorizationService.getRoleUsers(role);
  }

  async getAllRoles(): Promise<string[]> {
    return await this.authorizationService.getAllRoles();
  }

  async deleteRoleFromUser(userId: Id, userRole: IRole): Promise<boolean> {
    return await this.authorizationService.deleteRoleFromUser(userId, userRole);
  }

  async checkUserRole(userId: Id, userRole: IRole): Promise<boolean> {
    return this.authorizationService.checkUserRole(userId, userRole);
  }

  async addPermissionToRole(
    role: IRole,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.authorizationService.addPermissionToRole(
      role,
      permission,
    );
  }

  async deletePermissionFromRole(
    role: IRole,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.authorizationService.deletePermissionFromRole(
      role,
      permission,
    );
  }

  async checkUserResourceAccess(
    userId: Id,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.authorizationService.checkUserResourceAccess(
      userId,
      permission,
    );
  }
}
