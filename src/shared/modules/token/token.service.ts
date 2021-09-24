import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { constants } from './token.configs';
import {
  AccessToken,
  AccessTokenPayload,
  RefreshToken,
  RefreshTokenPayload,
} from './token.type';

@Injectable()
export class TokenService {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}
  async createRefreshToken(
    refreshTokenPayload: RefreshTokenPayload,
  ): Promise<RefreshToken> {
    const expireDate = new Date();
    const refreshToken = randomBytes(32).toString('hex');
    const redisDbClient = this.redisService.getClient();

    expireDate.setHours(
      expireDate.getHours() + constants.refreshTokenExpireInHours,
    );

    const payload = { ...refreshTokenPayload, expireDate: expireDate };
    const payloadStr = JSON.stringify(payload);

    await redisDbClient.hset('refresh_tokens', refreshToken, payloadStr);
    return refreshToken;
  }

  async createAccessToken(
    payload: AccessTokenPayload,
    expInHours: number = constants.accessTokenExpireDateInHours,
  ): Promise<AccessToken> {
    return await this.jwtService.signAsync(
      {
        ...payload,
        expInHours: expInHours,
      },
      { expiresIn: `${expInHours}h` },
    );
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('دسترسی غیرمجاز');
    }
  }

  async revokeAccessToken(token: string): Promise<void> {
    const redisDbClient = this.redisService.getClient();

    await redisDbClient.sadd('revoked:tokens', token);
  }

  async checkAccessToken(token: string): Promise<boolean> {
    const redisDbClient = this.redisService.getClient();
    const result = await redisDbClient.sismember('revoked:tokens', token);

    return result === 0 ? false : true;
  }

  async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    const nowDate = new Date();
    const redisDbClient = this.redisService.getClient();
    const data = await redisDbClient.hget('refresh_tokens', refreshToken);

    if (!data) {
      throw new ForbiddenException('دسترسی غیرمجاز');
    }

    const { userId, expireDate: expireDateStr } = JSON.parse(data);
    const expireDate = new Date(expireDateStr);

    if (expireDate < nowDate) {
      throw new ForbiddenException('دسترسی غیرمجاز');
    }
    return { userId };
  }
}
