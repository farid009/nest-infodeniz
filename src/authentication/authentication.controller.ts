import {
  Body,
  Controller,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '@src/log/log.interceptor';
import { UserRole } from '@src/user/user.type';
import { AuthenticationService } from './authentication.service';
import { AppToken } from './authentication.type';
import { LoginUserByEmailAndPasswordDto, RegisterUserDto } from './dto';

@Controller('v1/authentication')
@ApiTags('authentication')
@UseInterceptors(LoggingInterceptor)
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Post('/register')
  async registerUser(
    @Body()
    registerUserObj: RegisterUserDto,
  ): Promise<AppToken> {
    return await this.authenticationService.registerUser(registerUserObj);
  }

  @ApiParam({ name: 'userRole', enum: UserRole })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Post('/user-role/:userRole/login')
  async loginUser(
    @Param('userRole') userRole: UserRole,
    @Body()
    loginUserObj: LoginUserByEmailAndPasswordDto,
  ): Promise<AppToken> {
    return await this.authenticationService.loginUserByEmailAndPassword(
      userRole,
      loginUserObj,
    );
  }
}
