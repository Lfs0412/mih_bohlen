import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {CreateUserDTO} from "./user.DTO";
import {UserService} from "./user.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import {User} from "../entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() request: CreateUserDTO) {
        await this.userService.create(request);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUsers(@CurrentUser() user: User) {
        return this.userService.getUsers();
    }
}
