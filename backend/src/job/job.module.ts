import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RequestGateway} from "./request.gateway";
import {Entry} from "../entities/entry.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'OFFER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
      TypeOrmModule.forFeature(
        [User, Entry],
      )
  ],
  providers: [JobService, RequestGateway],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
