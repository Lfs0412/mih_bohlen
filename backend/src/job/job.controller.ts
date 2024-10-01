// offer.controller.ts
import {Controller, Post, Body, Param, Get, UseGuards} from '@nestjs/common';
import { JobService} from "./job.service";
import {EventPattern} from "@nestjs/microservices";
import {AIRequestDTO} from "./DTOs/AiRequestDTO";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../auth/current-user.decorator";
import {User} from "../entities/user.entity";
import {MessageDTO} from "./DTOs/MessageDTO";
import {RequestGateway} from "./request.gateway";


@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService,
                private requestGateway: RequestGateway,) {}

    @UseGuards(JwtAuthGuard)
    @Post('requestJob')
    async requestJob(@Body() message: MessageDTO, @CurrentUser() user: User) {
        await this.jobService.createRequest(message, user.id);
        return { message: 'Request to AI pending.' };
    }


    @EventPattern('request_completed')
    handleOfferCompleted(data: any) {
        return this.jobService.handleOfferCompleted(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get('messages/:id')
    async getMessages(@Param('id') entryId: number, @CurrentUser() user: User) {
        const messages = await this.jobService.getMessages(entryId, user.id)
        return messages
}

}
