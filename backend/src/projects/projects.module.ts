import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Project} from "../entities/project.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Project, User]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
