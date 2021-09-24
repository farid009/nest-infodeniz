import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserByEmailAndPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
