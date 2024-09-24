// app.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_request')
  async handleCreateRequest(data: any) {
    console.log('Received create_request event with data:', data);
    await this.appService.processCreateRequest(data);
  }
}