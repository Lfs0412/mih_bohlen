import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Entry} from "../entities/entry.entity";
import {Project} from "../entities/project.entity";
import {User} from "../entities/user.entity";
import {JobService} from "../job/job.service";
import {JobModule} from "../job/job.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry, Project, User]), // Repositories registrieren
      JobModule
  ],
  controllers: [EntriesController],
  providers: [EntriesService]
})
export class EntriesModule {}
