import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { User} from "./entities/user.entity";
import {Project} from "./entities/project.entity";
import {Entry} from "./entities/entry.entity";
import { JobModule } from './job/job.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [ ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'production'
        ? '../.env.production'
        : '../.env.development',
    isGlobal: true,
  }),
    ...(process.env.NODE_ENV === 'development'
        ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser'),
            exclude: ['/api*'], // Exclude API routes
          }),
        ]
        : []),
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
    }),UsersModule, JobModule, AuthModule, ProjectsModule, EntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
