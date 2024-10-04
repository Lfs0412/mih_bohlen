import {Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {SocketService} from './web-socket.service';
import {EntriesService} from '../entries/entries.service';
import {Entry} from '../entries/Entry';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {ChatService} from './chat.service';
import {marked} from 'marked';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  animateChild,
  state,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, NgForOf, NgClass, NgIf, NgStyle],
  standalone: true,
  animations: [
    trigger('componentAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('500ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({opacity: 0}), // Remove transform here
        animate('300ms ease-out', style({opacity: 1, transform: 'translateX(0)'})),
      ]),
    ]),
  ]
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {
  messages: { sender: string; text: string | SafeHtml; isMarkdown: boolean; isNew: boolean }[] = [];
  newMessage: string = '';
  isPending: boolean = true;
  waitingMessage: string = 'Warte auf den Assistenten...';
  entryId: number | undefined;
  entry: Entry | undefined;

  @ViewChild('chatWindow')
  private chatWindow!: ElementRef;
  private shouldScrollToBottom = false;

  constructor(
    private socketService: SocketService,
    private entryService: EntriesService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    // Entry ID aus der URL extrahieren
    this.route.paramMap.subscribe((params) => {
      this.entryId = Number(params.get('entryId'));
      this.socketService.joinChat(this.entryId);

      // WebSocket-Ereignisse abonnieren
      this.socketService.onRequestReady().subscribe((message) => {
        this.addMessage('Assistant', message);
        this.isPending = false;
      });

      // Eintragsdetails abrufen
      if (this.entryId) {
        this.entryService.getEntry(this.entryId).subscribe((entry: Entry) => {
          this.entry = entry;
          this.isPending = entry.pending;
        });
      }

      // Nachrichtenkontext abrufen
      this.chatService.getThreadContext(this.entryId).subscribe((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          this.messages = response.data
            .map((message: any) => {
              const content = message.content[0]?.text?.value || message.content[0]?.value || 'Kein Text';
              const isMarkdown = this.isMarkdown(content);
              return {
                sender: message.role === 'assistant' ? 'Assistant' : 'User',
                text: isMarkdown
                  ? this.sanitizer.bypassSecurityTrustHtml(<string>marked(content))
                  : content,
                isMarkdown: isMarkdown,
                isNew: false, // Initiale Nachrichten als nicht neu markieren
              };
            })
            .reverse();
          this.shouldScrollToBottom = true; // Nach dem Laden nach unten scrollen
        } else {
          console.error('Erwartetes Nachrichtenarray nicht erhalten:', response);
        }
      });
    });
  }

  ngAfterViewInit() {
    this.shouldScrollToBottom = true; // Nach der View-Initialisierung nach unten scrollen
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Konnte nicht nach unten scrollen:', err);
    }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '' && !this.isPending && this.entryId) {
      this.addMessage('User', this.newMessage);

      // Nachricht an das Backend senden
      this.chatService.sendMessage(this.newMessage, this.entryId).subscribe(
        (response) => {
          console.log('Nachricht an Backend gesendet:', response);
        },
        (error) => {
          console.error('Fehler beim Senden der Nachricht:', error);
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
      isMarkdown: isMarkdown,
      isNew: true, // Neue Nachrichten als neu markieren
    });
    this.shouldScrollToBottom = true; // Nach dem Hinzufügen nach unten scrollen
  }

  isMarkdown(content: string): boolean {
    // Einfache Überprüfung, ob der Inhalt Markdown sein könnte
    return content.includes('#') || content.includes('*') || content.includes('[') || content.includes(']');
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
