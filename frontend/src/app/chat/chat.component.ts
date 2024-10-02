import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import sanitizer for safe HTML
import { SocketService } from './web-socket.service';
import { EntriesService } from '../entries/entries.service';
import { Entry } from '../entries/Entry';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ChatService } from './chat.service';
import { marked } from 'marked'; // Update this import


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  standalone: true
})
export class ChatComponent implements OnInit {
  messages: { sender: string; text: string | SafeHtml; isMarkdown: boolean }[] = [];
  newMessage: string = '';
  isPending: boolean = true;
  waitingMessage: string = 'Waiting for assistant...';
  entryId: number | undefined;
  entry: Entry | undefined;

  constructor(
    private socketService: SocketService,
    private entryService: EntriesService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private sanitizer: DomSanitizer // Inject DomSanitizer for safe HTML rendering
  ) {}

  ngOnInit() {
    // Extract entryId from the URL
    this.route.paramMap.subscribe((params) => {
      this.entryId = Number(params.get('entryId'));
      this.socketService.joinChat(this.entryId);

      // Subscribe to WebSocket events directly
      this.socketService.onRequestReady().subscribe((message) => {
        this.addMessage('Assistant', message);
        this.isPending = false;
      });

      // Fetch the entry details from the server using the entryId
      if (this.entryId) {
        this.entryService.getEntry(this.entryId).subscribe((entry: Entry) => {
          this.entry = entry;
          this.isPending = entry.pending;
        });
      }

      // Fetch thread messages
      this.chatService.getThreadContext(this.entryId).subscribe((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          this.messages = response.data.map((message: any) => {
            const content = message.content[0]?.text?.value || message.content[0]?.value || 'No text';
            const isMarkdown = this.isMarkdown(content);
            return {
              sender: message.role === 'assistant' ? 'Assistant' : 'User',
              text: isMarkdown ? this.sanitizer.bypassSecurityTrustHtml(<string>marked(content)) : content,
              isMarkdown: isMarkdown
            };
          }).reverse(); // Reverse the array to show latest messages on top
        } else {
          console.error('Expected an array of messages, but got:', response);
        }
      });
    });
  }

  sendMessage() {
    if (this.newMessage.trim() !== '' && !this.isPending && this.entryId) {
      this.addMessage('User', this.newMessage);

      // Send message to backend via ChatService
      this.chatService.sendMessage(this.newMessage, this.entryId).subscribe(
        (response) => {
          console.log('Message sent to backend:', response);
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
      this.newMessage = '';
      this.isPending = true;
    }
  }

  addMessage(sender: string, content: string) {
    const isMarkdown = this.isMarkdown(content);
    this.messages.push({
      sender,
      text: isMarkdown ? this.sanitizer.bypassSecurityTrustHtml(<string>marked(content)) : content,
      isMarkdown: isMarkdown
    });
  }

  isMarkdown(content: string): boolean {
    // Simple check to determine if content might be Markdown (you can improve this logic)
    return content.includes('#') || content.includes('*') || content.includes('[') || content.includes(']');
  }
}
