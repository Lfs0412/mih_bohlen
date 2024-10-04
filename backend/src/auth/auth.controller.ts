import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {User} from "../entities/user.entity";
import {Response} from "express";
import {CurrentUser} from "./current-user.decorator";
import {JwtRefreshAuthGuard} from "./guards/jwt-refresh-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(
        @Body() body: { username: string, password: string },
        @Res({ passthrough: true }) response: Response,
    ) {
        const { username, password } = body;
        const user = await this.authService.verifyUser(username, password);
        await this.authService.login(user, response);
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(
        @CurrentUser() user: User,
        @Res({passthrough: true}) response: Response,
    ) {
        await this.authService.login(user, response);
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        // Clear the Authentication and Refresh cookies
        response.clearCookie('Authentication', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        response.clearCookie('Refresh', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        return {message: 'Logged out successfully'};
    }

    @Get('me')
    @UseGuards(JwtAuthGuard) // Use JwtAuthGuard to protect the route
    getMe(@CurrentUser() user: User) {
        return user;
    }
}
