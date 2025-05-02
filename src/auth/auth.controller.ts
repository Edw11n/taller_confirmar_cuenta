import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ActivateDto } from './dtos/activate.dto';
import { Public } from './public.decorator';
import { ResendDto } from './dtos/resend.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register') register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login') login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('activar-cuenta') activate(@Body() dto: ActivateDto) {
    return this.authService.activate(dto);
  }

  @Public()
  @Post('resend-code') resendCode(@Body() dto: ResendDto) {
    return this.authService.resendCode(dto);
  } 
}
