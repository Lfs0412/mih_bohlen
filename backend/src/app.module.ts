import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { User} from "./entities/user.entity";
import {Project} from "./entities/project.entity";
import {Entry} from "./entities/entry.entity";

@Module({
  imports: [ ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'production'
        ? '../.env.production'
        : '../.env.development',
    isGlobal: true,
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return {
          type: isProduction ? 'postgres' : 'sqlite',
          host: isProduction ? configService.get<string>('DB_HOST') : undefined,
          port: isProduction ? parseInt(configService.get<string>('DB_PORT'), 10) : undefined,
          username: isProduction ? configService.get<string>('DB_USERNAME') : undefined,
          password: isProduction ? configService.get<string>('DB_PASSWORD') : undefined,
          database: configService.get<string>('DB_NAME'),
          entities: [User, Project, Entry],
          synchronize: !isProduction,
        };
      },
    }),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
