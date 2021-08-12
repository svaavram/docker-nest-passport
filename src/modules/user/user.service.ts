import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/iuser.interface';

@Injectable()
export class UserService {
  hello(): IUser {
    return {
      name: 'John Doe',
      email: 'jdoe@email.com',
    };
  }
}
