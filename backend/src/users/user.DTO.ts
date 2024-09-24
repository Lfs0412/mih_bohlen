import {IsStrongPassword } from 'class-validator';

export class CreateUserDTO {

    username: string;

    @IsStrongPassword()
    password: string;
}