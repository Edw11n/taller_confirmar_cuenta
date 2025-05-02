import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ActivationCode } from './entities/activation-code.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ActivateDto } from './dtos/activate.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { ResendDto } from './dtos/resend.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(ActivationCode) private codesRepo: Repository<ActivationCode>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private mailer: MailerService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepo.findOne({ where: [{ email: dto.email }, { username: dto.username }] });
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new BadRequestException('Email ya registrado');
      }
      if (existingUser.username === dto.username) {
        throw new BadRequestException('Nombre de usuario no disponible');
      }
    }
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      isActive: false,
      roles: ['user'],
    });
    await this.sendCode(user);
    return { message: 'Usuario Registrado. Verifique su correo electronico para activar su cuenta' };
  }

  async login(dto: LoginDto) {
    const { email } = dto;
    const user = await this.usersRepo.findOne({ where: { email }, });
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    if (!user.isActive) {
      throw new BadRequestException('Usuario no activado');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }
    const payload = { id: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return token;
  }

  private async sendCode(user: User) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const dateCreated = new Date(Date.now());
    const expiration = new Date(Date.now() + 10*60*1000);
    const activation = this.codesRepo.create({ user, code, dateCreated, expiration });
    await this.codesRepo.save(activation);
    await this.mailer.sendMail({
      to: user.email,
      subject: 'Código de activación',
      template: 'confirm-account',
      context: { 
        name: user.username, 
        code: code 
      },
    });
  }

  async activate(dto: ActivateDto) {
    const activation = await this.codesRepo.findOne({ where: { code: dto.code, used: false }, relations: ['user'] });
    if (!activation || activation.expiration < new Date()) {
      throw new BadRequestException('Codigo Invalido o expirado');
    }
    activation.used = true;
    activation.dateUsed = new Date(Date.now());
    activation.user.isActive = true;
    await this.codesRepo.save(activation);
    await this.usersRepo.save(activation.user);
    return { message: 'Cuenta Activada' };
  }

  async resendCode(dto: ResendDto) {
    const { email } = dto;
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    if (user.isActive) {
      throw new BadRequestException('El usuario ya está activo');
    }
    await this.sendCode(user);
    return { message: 'Codigo de activacion reenviado.' };
  }
}
