// offer.service.ts
import {Injectable, Inject} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {RequestGateway} from "./request.gateway";
import {AIRequestDTO} from "./DTOs/AiRequestDTO";


@Injectable()
export class JobService {
    constructor(
        @Inject('OFFER_SERVICE') private readonly client: ClientProxy,
        private readonly requestGateway: RequestGateway
    ) {
    }

    async createRequest(requestData: AIRequestDTO) {
        console.log(requestData)
        this.client.emit('create_request', {
            requestData
        })
    }


    async handleOfferCompleted(data: any) {
        const {clientId, resultData} = data;
        console.log('Received offer_completed event with data:', data);
        this.requestGateway.sendOfferReadyNotification(clientId, data.response.value);
        console.log("frontend client notified")
    }


}
