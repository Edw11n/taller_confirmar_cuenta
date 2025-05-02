import { Controller, Put, Param } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('admin/usuarios')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Roles('admin')
  @Put('activar/:id')
  async activate(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = true;
    return this.usersService.create(user);
  }

  @Roles('admin')
  @Put('desactivar/:id')
  async deactivate(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = false;
    return this.usersService.create(user);
  }
}
