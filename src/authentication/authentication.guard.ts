import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getJwtTokenFromRequest } from '@src/shared/helpers/getJwtTokenFromRequest';
import { TokenService } from '@src/shared/modules/token/token.service';

@Injectable()
export class JwtAuthenticateGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = getJwtTokenFromRequest(req);
    const payload = await this.tokenService.verifyAccessToken(token);

    req.user = payload;
    return true;
  }
}
