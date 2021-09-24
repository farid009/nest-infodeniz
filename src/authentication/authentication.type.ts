import { ApiProperty } from '@nestjs/swagger';
import {
  AccessToken,
  RefreshToken,
} from '@src/shared/modules/token/token.type';

export class AppToken {
  @ApiProperty({ type: 'string' })
  accessToken: AccessToken;
  @ApiProperty({ type: 'string' })
  refreshToken: RefreshToken;
}
