// app.service.ts
import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import OpenAI from 'openai';
import { AIMessageDTO } from './DTOs/AiMessageDTO';

@Injectable()
export class AppService {
  private client: ClientProxy;
  private userApiKey: string =
      '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';

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
    console.log(apiKey);

    const openai = new OpenAI({ apiKey: apiKey });

    try {
      // Retrieve the assistant information
      const assistant = await openai.beta.assistants.retrieve('asst_QNcSu6ZmYsMqVePu7osy86bu');
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      //TODO simply Promise logic!!!

      // Return a promise to resolve when the response is received
      return new Promise((resolve, reject) => {
        const stream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistant.id,
        })
            .on('messageDone', (event) => {
              if (event.content[0].type === 'text') {
                const responseText = event.content[0].text;

                // Emit the response text to the client
                this.client.emit('request_completed', { response: responseText });

                // Resolve the promise with the response text
                resolve({ response: responseText });
                console.log(responseText);
              } else {
                const noTextResponse = 'No text response';

                // Emit the no text response to the client
                this.client.emit('response_event', { response: noTextResponse });

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
