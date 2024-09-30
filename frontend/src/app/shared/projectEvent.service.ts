import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectEventsService {
  // Create a subject for broadcasting project creation
  private projectCreatedSource = new Subject<void>();

  // Observable that other components can subscribe to
  projectCreated$ = this.projectCreatedSource.asObservable();

  // Method to broadcast the project creation event
  notifyProjectCreated() {
    this.projectCreatedSource.next();
  }
}
