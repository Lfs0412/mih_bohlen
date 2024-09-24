// offer.service.ts
import {Injectable, Inject} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {RequestGateway} from "./request.gateway";


@Injectable()
export class JobService {
    constructor(
        @Inject('OFFER_SERVICE') private readonly client: ClientProxy,
        private readonly requestGateway: RequestGateway
    ) {
    }

    async createRequest(clientId: string, userId: number, requestData: any) {
        this.client.emit('create_request', {
            clientId,
            requestData,
            userId,
        })
    }


    async handleOfferCompleted(data: any) {
        const {clientId, resultData} = data;
        console.log('Received offer_completed event with data:', data);
        this.requestGateway.sendOfferReadyNotification(clientId);
        console.log("frontend client notified")
    }


}
