import { Component,OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {SocketService} from "./web-socket.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages:string[] = [];
  newMessage:string = '';
  clientId: string | undefined;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.clientId = this.socketService.clientId;
    if (this.clientId !== undefined){
      this.socketService.joinRoom(this.clientId);

      this.socketService.onRequestReady().subscribe((message)=>{
        this.messages.push(message);
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.socketService.sendMessage(this.newMessage);
      this.messages.push(this.newMessage);
      this.newMessage = '';
    }
  }
}
