import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @MinLength(5)
  password!: string;
}
