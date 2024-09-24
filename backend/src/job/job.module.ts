import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RequestGateway} from "./request.gateway";

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
        [],
      )
  ],
  providers: [JobService, RequestGateway],
  controllers: [JobController]
})
export class JobModule {}
