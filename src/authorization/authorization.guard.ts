import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { asyncSome } from '@src/shared/helpers/asyncSome';
import {
  AUTHORIZATION_MODULE_OPTIONS,
  ROLES_METADATA,
} from './authorization.config';
import { IAuthorizationModuleOptions, IRole } from './authorization.interface';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizeRBACGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AUTHORIZATION_MODULE_OPTIONS)
    private options: IAuthorizationModuleOptions,
    private authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: IRole[] = this.reflector.getAllAndOverride<IRole[]>(
      ROLES_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!roles) {
      return true;
    }

    const userId = this.options.userIdFromContext(context);

    if (!userId) {
      throw new UnauthorizedException('دسترسی غیرمجاز');
    }

    const result = await asyncSome<IRole>(roles, async (r) => {
      return this.authorizationService.checkUserRole(userId, r);
    });

    if (!result) {
      throw new UnauthorizedException('دسترسی غیرمجاز');
    }
    return result;
  }
}
