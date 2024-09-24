// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // Create the main (HTTP) application
  const app = await NestFactory.create(AppModule);

  // Set up the microservice to listen for events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002, // This should match the port the microservice's ClientProxy is emitting to
    },
  });

  // Start both HTTP and microservice servers
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
