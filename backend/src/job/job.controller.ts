// offer.controller.ts
import {Controller, Post, Body, Param} from '@nestjs/common';
import { JobService} from "./job.service";
import {EventPattern} from "@nestjs/microservices";
import {AIRequestDTO} from "./DTOs/AiRequestDTO";

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Post('requestJob')
    async requestJob(@Body() aiRequest: AIRequestDTO) {

        await this.jobService.createRequest(
            aiRequest
        );
        return { message: 'Request to AI pending.'};
    }

    @EventPattern('request_completed')
    handleOfferCompleted(data:any){
        return this.jobService.handleOfferCompleted(data);
    }

}
