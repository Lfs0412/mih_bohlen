import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to the WebSocket server
    this.socket = io('ws://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Client connected with socket ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  }

  // Send only the entryId when the chat starts
  joinChat(entryId: number) {
    this.socket.emit('join', entryId);
    console.log('Joined chat with entryId:', entryId);
  }

  // Listen for requestReady event
  onRequestReady(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('requestReady', (data: string) => {
        observer.next(data);
        console.log('Received "requestReady" event with data:', data);
      });
    });
  }
}
