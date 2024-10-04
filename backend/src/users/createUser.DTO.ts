import {IsString, IsStrongPassword, MaxLength} from 'class-validator';

export class CreateUserDTO {

    @IsString()
    username: string;

    @IsString()
    @IsStrongPassword()
    password: string;
    @IsString()
    firstname: string;
    @IsString()
    lastname: string;
    @IsString()
    apiKey: string;
}