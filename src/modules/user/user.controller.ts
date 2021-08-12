import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './interfaces/iuser.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async hello(): Promise<IUser> {
    return this.userService.hello();
  }
}
