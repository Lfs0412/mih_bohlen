import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryEventsService {
  // Create a subject for broadcasting project creation
  private entryCreatedSource = new Subject<void>();

  // Observable that other components can subscribe to
  entryCreated$ = this.entryCreatedSource.asObservable();

  // Method to broadcast the project creation event
  notifyEntryCreated() {
    this.entryCreatedSource.next();
  }
}
