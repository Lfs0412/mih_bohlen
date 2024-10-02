// app.service.ts
import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import OpenAI from 'openai';
import { AIMessageDTO } from './DTOs/AiMessageDTO';

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

  async messageToAssist(apiKey: string, threadId: string, message: string, entryId: number): Promise<any> {
    console.log(apiKey, threadId, message, entryId);

    const openai = new OpenAI({ apiKey: apiKey });

    try {
      // Retrieve the assistant information
      const assistant = await openai.beta.assistants.retrieve('asst_QNcSu6ZmYsMqVePu7osy86bu');
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      // Return a promise to resolve when the response is received
      return new Promise((resolve, reject) => {
        const stream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistant.id,
        })
            .on('messageDone', (event) => {
              if (event.content[0].type === 'text') {
                const responseText = event.content[0].text;

                // Emit the response text to the main backend and include the entryId
                this.client.emit('request_completed', { entryId, response: responseText });

                // Resolve the promise with the response text
                resolve({ response: responseText });
                console.log(responseText);
              } else {
                const noTextResponse = 'No text response';

                // Emit the no text response to the main backend
                this.client.emit('request_completed', { entryId, response: noTextResponse });

                // Resolve the promise with no text response
                resolve({ response: noTextResponse });
              }
            })
            .on('error', (err) => {
              console.error(`Error in stream: ${err.message}`);
              reject(err);
            });
      });
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
      throw new Error(error.message);
    }
  }

}
