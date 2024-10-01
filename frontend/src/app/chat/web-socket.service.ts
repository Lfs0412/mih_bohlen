import { Injectable } from '@angular/core';
import { io, Socket} from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  clientId: string | undefined;
  apiUrl = 'http://localhost:3000/api/projects';

  constructor() {
    // Verbindung zu deinem Nest.js Backend (angepasst an deine Backend-URL)
    this.socket = io(`${this.apiUrl}`); // URL deines Backends
    this.socket.on('connect', () => {
      this.clientId = this.socket.id;
      console.log('Client connected', this.clientId);
    })
    this.socket.on('disconnect', () => {
      console.log('Client disconnected');
    })
  }

  // Methode, um einem Raum beizutreten
  joinRoom(clientId: string): void {
    this.socket.emit('join', clientId);
  }

  // Nachrichten empfangen
  onRequestReady(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('requestReady', (data: string) => {
        observer.next(data);
      });
    });
  }

  // Methode zum Senden von Nachrichten (falls nötig)
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
}
