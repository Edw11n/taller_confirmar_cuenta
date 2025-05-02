import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
}