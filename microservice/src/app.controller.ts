// app.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import {AIMessageDTO} from "./DTOs/AiMessageDTO";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_request')
  async handleCreateRequest(data: { requestData: AIMessageDTO }) {
    console.log('Received create_request event with data:', data);

    const { apiKey, threadId, message, entryId } = data.requestData; // Access nested requestData
    return await this.appService.messageToAssist(apiKey, threadId, message, entryId);

  }
}