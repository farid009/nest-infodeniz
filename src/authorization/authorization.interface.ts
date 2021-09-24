import { ExecutionContext } from '@nestjs/common';
import { Id } from '@src/shared/types';
import { UserRole } from '@src/user/user.type';
import { AuthActionVerb, AuthPossession } from './authorization.types';

export interface IPermission {
  resource: string;
  action: AuthActionVerb;
  possession: AuthPossession;
  isOwn?: (ctx: ExecutionContext) => boolean;
}
export type IRole = UserRole | string;
export interface IAuthorizationService {
  addRoleToUser(userId: Id, role: IRole): Promise<boolean>;

  deleteRoleFromUser(userId: Id, role: IRole): Promise<boolean>;

  getUserRoles(userId: Id): Promise<IRole[]>;

  getRoleUsers(role: IRole): Promise<string[]>;

  getAllRoles(): Promise<IRole[]>;

  checkUserRole(userId: Id, role: IRole): Promise<boolean>;

  addPermissionToRole(role: IRole, permission: IPermission): Promise<boolean>;

  deletePermissionFromRole(
    role: IRole,
    permission: IPermission,
  ): Promise<boolean>;

  checkUserResourceAccess(
    userId: Id,
    permission: IPermission,
  ): Promise<boolean>;
}
export interface IAuthorizationModuleOptions {
  userIdFromContext: (context: ExecutionContext) => Id;
}
