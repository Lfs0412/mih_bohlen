// app.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import {AIMessageDTO} from "./DTOs/AiMessageDTO";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_request')
  async handleCreateRequest({ data }: { data: AIMessageDTO }) {
    console.log('Received create_request event with data:', data);
    console.log('API Key:', data.apiKey);
    console.log('Thread ID:', data.threadId);

    return await this.appService.messageToAssist(
        data.apiKey,
        data.threadId,
        data.message,
        data.entryId
    );
  }
}