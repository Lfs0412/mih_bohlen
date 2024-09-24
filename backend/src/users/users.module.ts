import { Module } from '@nestjs/common';
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {UsersController} from "./user.controller";


@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService]
})
export class UsersModule {}
