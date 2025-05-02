import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginDto {
  @IsNotEmpty() email!: string;
  @IsNotEmpty() password!: string;
}
