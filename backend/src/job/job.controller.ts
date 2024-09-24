// offer.controller.ts
import {Controller, Post, Body, Param} from '@nestjs/common';
import { JobService} from "./job.service";
import {EventPattern} from "@nestjs/microservices";

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Post('requestJob')
    async requestJob(@Body() requestJobDTO: any) {
        const { clientId, userId, requestData } = requestJobDTO;

        const offer = await this.jobService.createRequest(
            clientId,
            userId,
            requestData
        );
        return { message: 'Angebot wird erstellt.'};
    }

    @EventPattern('offer_completed')
    handleOfferCompleted(data:any){
        return this.jobService.handleOfferCompleted(data);
    }

}
