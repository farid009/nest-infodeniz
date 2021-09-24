import { UnauthorizedException } from '@nestjs/common';

export function getJwtTokenFromRequest(request: any): string {
  if (!request.headers.authorization) {
    throw new UnauthorizedException('دسترسی غیرمجاز');
  }

  const [, token] = request.headers.authorization.split(' ');

  return token;
}
