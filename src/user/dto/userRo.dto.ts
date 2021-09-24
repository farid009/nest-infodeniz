import { User } from '@prisma/client';
import { Id } from '@src/shared/types';

export class UserRoDto {
  id!: Id;
  name!: string;
  email!: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
