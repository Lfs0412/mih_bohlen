import {Body, ConflictException, Controller, Get, InternalServerErrorException, Post, UseGuards} from '@nestjs/common';
import {CreateUserDTO} from "./createUser.DTO";
import {UserService} from "./user.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import {User} from "../entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() request: CreateUserDTO) {
        try {
            const user = await this.userService.create(request);
            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    username: user.username,
                },
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while creating the user.');
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUsers(@CurrentUser() user: User) {
        return this.userService.getUsers();
    }
}
