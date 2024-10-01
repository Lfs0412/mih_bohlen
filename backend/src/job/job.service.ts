// offer.service.ts
import {Injectable, Inject} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {RequestGateway} from "./request.gateway";
import {AIRequestDTO} from "./DTOs/AiRequestDTO";
import {Entry} from "../entities/entry.entity";
import OpenAI from "openai";
import {User} from "../entities/user.entity";
import {MessageDTO} from "./DTOs/MessageDTO";


@Injectable()
export class JobService {
    constructor(
        @Inject('OFFER_SERVICE') private readonly client: ClientProxy,
        private readonly requestGateway: RequestGateway,
        @InjectRepository(Entry)
        private readonly entryRepository: Repository<Entry>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async createRequest(data: MessageDTO | AIRequestDTO, userId?: number): Promise<void> {
        let requestData: AIRequestDTO;

        if ('apiKey' in data) {
            // Case 1: It's already an AIRequestDTO, just emit it
            requestData = data as AIRequestDTO;
        } else {
            // Case 2: It's a MessageDTO, so fetch the threadId and apiKey
            if (!userId) {
                throw new Error('User ID is required for MessageDTO');
            }

            // Fetch the entry and user data from the repositories
            const entry = await this.entryRepository.findOne({ where: { id: data.entryId } });
            if (!entry) {
                throw new Error('Entry not found');
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }

            // Build the AIRequestDTO from the MessageDTO
            requestData = {
                entryId: entry.id,
                apiKey: user.apiKey,  // Get the apiKey from the user
                threadId: entry.threadId,  // Get the threadId from the entry
                message: data.message,  // Pass the message from the MessageDTO
            };

            // Set isPending to true when the request is sent
            entry.pending = true;
            await this.entryRepository.save(entry); // Save the updated entry
        }

        // Now proceed with sending the request to the microservice
        try {
            await this.client.connect();
            this.client.emit('create_request', { data: requestData });
        } catch (error) {
            console.error('Microservice connection error:', error);
        }
    }

    async handleOfferCompleted(data: any) {
        const { entryId, response } = data;
        console.log(`Received request_completed event for entryId: ${entryId}`);

        // Fetch the entry by entryId
        const entry = await this.entryRepository.findOne({ where: { id: entryId } });
        if (!entry) {
            throw new Error('Entry not found');
        }

        // Set isPending to false and save the entry
        entry.pending = false;
        await this.entryRepository.save(entry);

        // Notify the client via WebSocket
        this.requestGateway.sendOfferReadyNotification(entryId, response.value);
    }






    async getMessages(id: number, userId: number) {
        const entry = await this.entryRepository.findOne({where: {id}})
        const user = await this.userRepository.findOne({where: {id: userId}});
        console.log(user)
        const openai = new OpenAI({
            apiKey: user.apiKey,
        })
        return openai.beta.threads.messages.list(
            `${entry.threadId}`
        );
    }
}
