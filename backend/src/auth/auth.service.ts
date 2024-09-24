import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { TokenPayload } from './token-payload.interface';
import {User} from '../entities/user.entity'
import {UserService} from "../users/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: User, response: Response, redirect = false) {
        const expiresAccessToken = new Date();
        expiresAccessToken.setMilliseconds(
            expiresAccessToken.getTime() +
            parseInt(
                this.configService.getOrThrow<string>(
                    'JWT_ACCESS_TOKEN_EXPIRATION_MS',
                ),
            ),
        );

        const expiresRefreshToken = new Date();
        expiresRefreshToken.setMilliseconds(
            expiresRefreshToken.getTime() +
            parseInt(
                this.configService.getOrThrow<string>(
                    'JWT_REFRESH_TOKEN_EXPIRATION_MS',
                ),
            ),
        );

        const tokenPayload: TokenPayload = {
            userId: user.id,
            username: user.username,
        };
        const accessToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow(
                'JWT_ACCESS_TOKEN_EXPIRATION_MS',
            )}ms`,
        });
        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow(
                'JWT_REFRESH_TOKEN_EXPIRATION_MS',
            )}ms`,
        });

        await this.usersService.updateUser(
            { id: user.id },  // Pass the ID directly (ensure it matches your entity's primary key)
            { refreshToken: await hash(refreshToken, 10) }  // Directly provide the field to update
        );


        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: expiresAccessToken,
        });
        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: expiresRefreshToken,
        });

        if (redirect) {
            response.redirect(this.configService.getOrThrow('AUTH_UI_REDIRECT'));
        }
    }

    async verifyUser(username: string, password: string) {
        try {
            const user = await this.usersService.getUser({
                username
            });
            const authenticated = await compare(password, user.password);
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (err) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
    }

    async veryifyUserRefreshToken(refreshToken: string, userId: number) {
        try {
            const user = await this.usersService.getUser({ id: userId });
            const authenticated = await compare(refreshToken, user.refreshToken);
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (err) {
            throw new UnauthorizedException('Refresh token is not valid.');
        }
    }
}