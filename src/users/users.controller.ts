import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('codes')
    async getActivationCodes(@Req() req: Request) {
        const user = req.user as any;
        const userId = user.id;
        return this.usersService.findActivationCodes(userId);
    }
}
