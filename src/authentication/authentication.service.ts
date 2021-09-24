import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthorizationService } from '@src/authorization/authorization.service';
import { TokenService } from '@src/shared/modules/token/token.service';
import { Id } from '@src/shared/types';
import { UserService } from '@src/user/user.service';
import { UserRole } from '@src/user/user.type';
import { AppToken } from './authentication.type';
import { LoginUserByEmailAndPasswordDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private userService: UserService,
  ) {}
  async signAppToken(userRole: UserRole, userId: Id): Promise<AppToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.createAccessToken({
        userId: userId,
        role: userRole,
      }),
      this.tokenService.createRefreshToken({ userId: userId }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signAppTokenByRefreshToken(
    userRole: UserRole,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!(await this.authorizationService.checkUserRole(userId, userRole))) {
      throw new UnauthorizedException('دسترسی غیر مجاز');
    }

    const accessToken = await this.tokenService.createAccessToken({
      userId: userId,
      role: userRole,
    });

    return { accessToken };
  }

  async registerUser(registerUserObj: RegisterUserDto): Promise<AppToken> {
    const existResult = await this.userService.checkExistByEmail(
      registerUserObj.email,
    );

    if (existResult) {
      throw new BadRequestException('امکان ثبت نام با این مشخصات وجود ندارد');
    }

    const user = await this.userService.add(UserRole.ORDINARY, registerUserObj);
    const appToken = await this.signAppToken(UserRole.ORDINARY, user.id);

    return appToken;
  }

  async loginUserByEmailAndPassword(
    userRole: UserRole,
    loginUserByEmailAndPasswordObj: LoginUserByEmailAndPasswordDto,
  ): Promise<AppToken> {
    const user = await this.userService.getByEmail(
      loginUserByEmailAndPasswordObj.email,
    );

    if (!(await this.authorizationService.checkUserRole(user.id, userRole))) {
      throw new UnauthorizedException('دسترسی غیر مجاز');
    }

    const verifyPasswordResult = await this.userService.verifyUserPassword(
      user.password,
      loginUserByEmailAndPasswordObj.password,
    );

    if (!verifyPasswordResult) {
      {
        throw new BadRequestException('ایمیل و یا رمز عبور اشتباه است');
      }
    }
    return await this.signAppToken(userRole, user.id);
  }

  async logout(token: string): Promise<void> {
    await this.tokenService.revokeAccessToken(token);
  }
}
