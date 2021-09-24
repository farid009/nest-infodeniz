import { Inject, Injectable } from '@nestjs/common';
import { Id } from '@src/shared/types';
import { Enforcer } from 'casbin';
import { CASBIN_ENFORCER } from './authorization.config';
import {
  IAuthorizationService,
  IPermission,
  IRole,
} from './authorization.interface';

@Injectable()
export class AuthorizationService implements IAuthorizationService {
  constructor(@Inject(CASBIN_ENFORCER) private casbinEnforcer: Enforcer) {}

  async addRoleToUser(userId: Id, role: IRole): Promise<boolean> {
    return await this.casbinEnforcer.addRoleForUser(userId.toString(), role);
  }

  async getUserRoles(userId: Id): Promise<string[]> {
    return await this.casbinEnforcer.getRolesForUser(userId.toString());
  }

  async getRoleUsers(role: IRole): Promise<string[]> {
    return await this.casbinEnforcer.getUsersForRole(role);
  }

  async getAllRoles(): Promise<string[]> {
    return await this.casbinEnforcer.getAllRoles();
  }

  async deleteRoleFromUser(userId: Id, role: IRole): Promise<boolean> {
    return await this.casbinEnforcer.deleteRoleForUser(userId.toString(), role);
  }

  async checkUserRole(userId: Id, role: IRole): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);

    return userRoles.includes(role);
  }

  async addPermissionToRole(
    role: IRole,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.casbinEnforcer.addPermissionForUser(
      role,
      permission.resource,
      permission.action,
    );
  }

  async deletePermissionFromRole(
    role: IRole,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.casbinEnforcer.deletePermissionForUser(
      role,
      permission.resource,
    );
  }

  async checkUserResourceAccess(
    userId: Id,
    permission: IPermission,
  ): Promise<boolean> {
    return await this.casbinEnforcer.hasPermissionForUser(
      userId.toString(),
      permission.resource,
      permission.action,
    );
  }
}
