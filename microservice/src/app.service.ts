// app.service.ts
import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3002, // Ensure this matches the backend's microservice port
      },
    });
  }

  async processCreateRequest(data: any) {
    const { clientId, requestData, userId } = data;

    // Simulate a task that takes 5 seconds
    setTimeout(async () => {
      const resultData = { message: 'Task completed successfully', offerId: 1, userId };

      // Notify the backend that the task is complete
      this.client.emit('offer_completed', {
        clientId,
        resultData,
      });

      console.log('Task completed, notification sent to the backend.');
    }, 5000);
  }
}
